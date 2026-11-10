"""Test runner shared by the browser (via Pyodide) and the local spec checker.

A spec describes one problem's tests:
  kind      "function" (call `entry` with args) or "class" (LeetCode-style ops on class `entry`)
  entry     function or class name the solution must define
  compare   "exact" | "float" | "unordered" | "unordered_nested"
  checker   optional Python source defining check(args, got) -> bool, for problems with many valid answers;
            check(args, got, solution) also receives the solution's top-level names (e.g. to call it again)
  mutates   optional index of an argument the solution modifies in place; that argument is compared instead
  tests     list of {"args": [...], "expected": ..., "hidden": bool}
            class tests use {"ops": [...], "args": [[...], ...], "expected": [...], "hidden": bool}

Must stay compatible with Python 3.9 (local checks) and 3.12 (Pyodide).
"""
import copy
import io
import json
import math
import sys
import time
import traceback

FLOAT_TOLERANCE = 1e-6
MAX_SHOWN_CHARS = 2000


def normalize(value):
    """Make results JSON-comparable: tuples -> lists, sets -> sorted lists, dict keys -> str."""
    if isinstance(value, (list, tuple)):
        return [normalize(v) for v in value]
    if isinstance(value, (set, frozenset)):
        return sorted((normalize(v) for v in value), key=repr)
    if isinstance(value, dict):
        return {str(k): normalize(v) for k, v in value.items()}
    return value


def _close(got, expected):
    if isinstance(got, bool) or isinstance(expected, bool):
        return got == expected
    if isinstance(got, (int, float)) and isinstance(expected, (int, float)):
        return math.isclose(got, expected, rel_tol=FLOAT_TOLERANCE, abs_tol=FLOAT_TOLERANCE)
    if isinstance(got, list) and isinstance(expected, list):
        return len(got) == len(expected) and all(_close(g, e) for g, e in zip(got, expected))
    if isinstance(got, dict) and isinstance(expected, dict):
        return got.keys() == expected.keys() and all(_close(got[k], expected[k]) for k in got)
    return got == expected


def _sorted_repr(items):
    return sorted(items, key=lambda v: json.dumps(v, sort_keys=True))


def matches(got, expected, mode):
    got = normalize(got)
    if mode == "float":
        return _close(got, expected)
    if mode == "unordered":
        return isinstance(got, list) and _sorted_repr(got) == _sorted_repr(expected)
    if mode == "unordered_nested":
        if not isinstance(got, list) or not all(isinstance(g, list) for g in got):
            return False
        return _sorted_repr([_sorted_repr(g) for g in got]) == _sorted_repr([_sorted_repr(e) for e in expected])
    return got == expected


def _shown(value):
    text = json.dumps(normalize(value)) if _jsonable(value) else repr(value)
    return text if len(text) <= MAX_SHOWN_CHARS else text[:MAX_SHOWN_CHARS] + " …"


def _jsonable(value):
    try:
        json.dumps(normalize(value))
        return True
    except (TypeError, ValueError):
        return False


def _run_class(cls_name, namespace, test):
    cls = namespace[cls_name]
    ops, args = test["ops"], copy.deepcopy(test["args"])
    obj = cls(*args[0])
    outputs = [None]
    for op, op_args in zip(ops[1:], args[1:]):
        outputs.append(getattr(obj, op)(*op_args))
    return outputs


def _error_summary():
    """Traceback limited to frames from the user's code."""
    lines = traceback.format_exc().splitlines()
    start = next((i for i, line in enumerate(lines) if '"solution.py"' in line), 1)
    return "\n".join(["Traceback (most recent call last):"] + lines[start:])


def run(spec, code, include_hidden):
    """Run the solution against the spec's tests; return a JSON-serialisable result dict."""
    namespace = {"__name__": "solution"}
    try:
        exec(compile(code, "solution.py", "exec"), namespace)
    except SyntaxError as err:
        return {"status": "Compile Error", "error": f"Line {err.lineno}: {err.msg}", "tests": []}
    except Exception:
        return {"status": "Runtime Error", "error": _error_summary(), "tests": []}
    if spec["entry"] not in namespace:
        kind = "class" if spec["kind"] == "class" else "function"
        return {"status": "Compile Error", "error": f"Define a {kind} named {spec['entry']}.", "tests": []}

    checker = None
    if spec.get("checker"):
        checker_ns = {}
        exec(spec["checker"], checker_ns)
        checker = checker_ns["check"]

    selected = [(i, t) for i, t in enumerate(spec["tests"]) if include_hidden or not t.get("hidden")]
    results = []
    for index, test in selected:
        # print() to stdout and stderr both go to the test's output log.
        stdout, saved = io.StringIO(), (sys.stdout, sys.stderr)
        sys.stdout = sys.stderr = stdout
        started = time.perf_counter()
        error, got = None, None
        try:
            if spec["kind"] == "class":
                got = _run_class(spec["entry"], namespace, test)
            else:
                args = copy.deepcopy(test["args"])
                returned = namespace[spec["entry"]](*args)
                got = args[spec["mutates"]] if spec.get("mutates") is not None else returned
            if checker:
                extra = (namespace,) if checker.__code__.co_argcount >= 3 else ()
                passed = bool(checker(copy.deepcopy(test["args"]), normalize(got), *extra))
            else:
                passed = matches(got, test["expected"], spec.get("compare", "exact"))
        except Exception:
            passed, error = False, _error_summary()
        finally:
            sys.stdout, sys.stderr = saved
        results.append({
            "index": index,
            "hidden": bool(test.get("hidden")),
            "passed": passed,
            "input": _shown(test["args"]) if spec["kind"] == "function" else _shown({"ops": test["ops"], "args": test["args"]}),
            "expected": _shown(test["expected"]),
            "got": _shown(got) if error is None else None,
            "error": error,
            "stdout": stdout.getvalue()[:MAX_SHOWN_CHARS],
            "ms": round((time.perf_counter() - started) * 1000, 1),
        })
        if include_hidden and not passed:
            break  # like a judge: Submit stops at the first failing test

    failed = [r for r in results if not r["passed"]]
    if not failed:
        status = "Accepted"
    elif any(r["error"] for r in failed):
        status = "Runtime Error"
    else:
        status = "Wrong Answer"
    return {"status": status, "error": None, "tests": results,
            "passed": len(results) - len(failed), "total": len(selected)}


def run_json(spec_json, code, include_hidden):
    """Entry point for the browser: JSON in, JSON out."""
    return json.dumps(run(json.loads(spec_json), code, include_hidden))
