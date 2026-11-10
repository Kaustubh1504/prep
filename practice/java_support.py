"""Java support for the practice runner: starter generation and judging.

Starter code is derived from each spec's Python signature (LeetCode conventions: list params
become arrays, list returns become List<...>). Problems whose Python starter carries extra
driver code need a hand-written override in java/overrides/<rank>.json; until one exists they
are marked unsupported in Java.

Judging compiles the solution with javac, runs java/Driver.java against the spec's tests, and
compares each result with harness.matches() or the spec's checker, so Java is held to exactly
the same tests as Python.
"""
import ast
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

import harness

HERE = Path(__file__).resolve().parent
JAVA_DIR = HERE / "java"
OVERRIDES_DIR = JAVA_DIR / "overrides"
RUNTIME_SOURCES = ["Driver.java", "ListNode.java", "TreeNode.java"]
RUNTIME_BUILD = JAVA_DIR / ".build"
TIME_LIMIT_S = {"run": 10, "submit": 20}
COMPILE_TIMEOUT_S = 30
JVM_FLAGS = ["-Xss256m", "-XX:+UseSerialGC", "-XX:TieredStopAtLevel=1"]
# Like LeetCode, common packages are imported for the student. They are prepended on the same
# line as the student's first line so compiler line numbers still match the editor.
AUTO_IMPORTS = ("import java.util.*; import java.util.function.*; import java.util.stream.*; "
                "import java.math.*; import java.io.*; ")

PRIMITIVES = {"int": "int", "float": "double", "bool": "boolean", "str": "String"}
BOXED = {"int": "Integer", "double": "Double", "boolean": "Boolean", "char": "Character", "long": "Long"}
DEFAULT_RETURN = {"int": "0", "long": "0", "double": "0.0", "boolean": "false", "char": "' '", "void": None}


# ---------- Starter generation ----------

def camel(name: str) -> str:
    """snake_case -> camelCase; names that are already camelCase are unchanged."""
    head, *rest = name.split("_")
    return head + "".join(part[:1].upper() + part[1:] for part in rest)


def _name(node) -> str:
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        return node.attr
    if isinstance(node, ast.Constant) and node.value is None:
        return "None"
    return ""


def _args(node) -> list:
    sub = node.slice
    if isinstance(sub, ast.Index):  # Python 3.8 AST
        sub = sub.value
    return list(sub.elts) if isinstance(sub, ast.Tuple) else [sub]


def _all_single_chars(sample) -> bool:
    flat = sample
    while isinstance(flat, list) and flat and isinstance(flat[0], list):
        flat = [x for row in flat for x in row]
    return isinstance(flat, list) and bool(flat) and all(isinstance(x, str) and len(x) == 1 for x in flat)


def java_type(node, role: str, sample=None) -> str:
    """Map a Python annotation to a Java type. role is 'param' or 'return'; sample is a test value for that slot."""
    if node is None:
        return "Object" if role == "param" else "void"
    name = _name(node)
    if isinstance(node, ast.Subscript):
        outer = _name(node.value).lower()
        inner = _args(node)
        if outer in ("list", "sequence"):
            elem = inner[0]
            elem_name = _name(elem)
            if role == "param" and elem_name in PRIMITIVES:
                if elem_name == "str" and _all_single_chars(sample):
                    return "char[]"
                return PRIMITIVES[elem_name] + "[]"
            if role == "param" and isinstance(elem, ast.Subscript) and _name(elem.value).lower() in ("list", "sequence"):
                leaf = _name(_args(elem)[0])
                if leaf in PRIMITIVES:
                    if leaf == "str" and _all_single_chars(sample):
                        return "char[][]"
                    return PRIMITIVES[leaf] + "[][]"
            return f"List<{boxed(java_type(elem, 'elem'))}>"
        if outer == "optional":
            return boxed(java_type(inner[0], role, sample))
        if outer == "tuple":
            names = {_name(n) for n in inner if _name(n) != "Ellipsis"}
            if names == {"int"}:
                return "int[]"
            return "List<Object>"
        if outer == "dict":
            return f"Map<{boxed(java_type(inner[0], 'elem'))}, {boxed(java_type(inner[1], 'elem'))}>"
        if outer in ("set", "frozenset"):
            return f"Set<{boxed(java_type(inner[0], 'elem'))}>"
        return "Object"
    if name in PRIMITIVES:
        return PRIMITIVES[name]
    if name == "None":
        return "void"
    if name in ("list", "List"):
        return "List<Object>"
    if name in ("dict", "Dict"):
        return "Map<String, Object>"
    return "Object"


def boxed(java: str) -> str:
    return BOXED.get(java, java)


def _method(func, sample_args, is_constructor=False, class_name=""):
    params = [a for a in func.args.args if a.arg != "self"]
    samples = list(sample_args or []) + [None] * len(params)
    parts = [f"{java_type(a.annotation, 'param', samples[i])} {camel(a.arg)}" for i, a in enumerate(params)]
    if is_constructor:
        return f"    public {class_name}({', '.join(parts)}) {{\n        \n    }}\n"
    ret = java_type(func.returns, "return")
    default = DEFAULT_RETURN.get(ret, "null")
    body = "        \n" if default is None else f"        \n        return {default};\n"
    return f"    public {ret} {camel(func.name)}({', '.join(parts)}) {{\n{body}    }}\n"


def _imports(code: str) -> str:
    return "import java.util.*;\n\n" if re.search(r"\b(List|Map|Set)<", code) else ""


def generate_starter(spec: dict):
    """Return (starter, className, method) or raise ValueError when the Python starter can't be mapped mechanically."""
    tree = ast.parse(spec["starter"])
    top = [n for n in tree.body if isinstance(n, (ast.FunctionDef, ast.ClassDef))]
    entry = [n for n in top if n.name == spec["entry"]]
    helpers = [n for n in top if n.name != spec["entry"]]
    if not entry:
        raise ValueError("entry not found in the Python starter")
    if helpers:
        raise ValueError(f"the Python starter includes helper code ({', '.join(h.name for h in helpers)}) that needs a Java override")
    node = entry[0]
    first_test = next((t for t in spec["tests"] if not t.get("hidden")), spec["tests"][0])

    if spec["kind"] == "class":
        methods = [m for m in node.body if isinstance(m, ast.FunctionDef)]
        init = next((m for m in methods if m.name == "__init__"), None)
        args_by_op = dict(zip(first_test["ops"], first_test["args"]))
        body = _method(init, first_test["args"][0], is_constructor=True, class_name=node.name) if init else ""
        for m in methods:
            if m.name.startswith("_"):
                continue
            body += "\n" + _method(m, args_by_op.get(m.name))
        code = f"class {node.name} {{\n{body}}}\n"
        return _imports(code) + code, node.name, None

    code = "class Solution {\n" + _method(node, first_test["args"]) + "}\n"
    return _imports(code) + code, "Solution", camel(node.name)


def parameter_defaults(spec: dict):
    """(parameter count, Python defaults of the trailing parameters) for the entry function, or None for classes."""
    if spec["kind"] != "function":
        return None
    for node in ast.parse(spec["starter"]).body:
        if isinstance(node, ast.FunctionDef) and node.name == spec["entry"]:
            params = [a for a in node.args.args if a.arg != "self"]
            return len(params), [ast.literal_eval(d) for d in node.args.defaults]
    return None


def _load_checker(spec: dict):
    if not spec.get("checker"):
        return None
    namespace = {}
    exec(spec["checker"], namespace)
    return namespace["check"]


def _checker_needs_solution(spec: dict) -> bool:
    checker = _load_checker(spec)
    return checker is not None and checker.__code__.co_argcount >= 3


def java_info(spec: dict) -> dict:
    """What the browser and the judge need for Java: starter, class, method, notes, or why it's unsupported."""
    override_path = OVERRIDES_DIR / f"{spec['rank']}.json"
    if override_path.exists():
        override = json.loads(override_path.read_text())
        return {k: override.get(k) for k in ("starter", "className", "method", "notes", "unsupported", "opNames")}
    if _checker_needs_solution(spec):
        return {"unsupported": "This problem's checker calls your Python function directly; solve it in Python."}
    try:
        starter, class_name, method = generate_starter(spec)
    except (ValueError, SyntaxError) as err:
        return {"unsupported": f"Java isn't set up for this problem yet ({err})."}
    return {"starter": starter, "className": class_name, "method": method, "notes": None, "unsupported": None, "opNames": None}


# ---------- Judging ----------

def _runtime_classes() -> Path:
    """Compile Driver/ListNode/TreeNode once, recompiling when a source changes."""
    sources = [JAVA_DIR / name for name in RUNTIME_SOURCES]
    stamp = RUNTIME_BUILD / ".stamp"
    newest = max(s.stat().st_mtime for s in sources)
    if not stamp.exists() or stamp.stat().st_mtime < newest:
        if RUNTIME_BUILD.exists():
            shutil.rmtree(RUNTIME_BUILD)
        RUNTIME_BUILD.mkdir(parents=True)
        subprocess.run(["javac", "-nowarn", "-d", str(RUNTIME_BUILD), *map(str, sources)],
                       check=True, capture_output=True, timeout=COMPILE_TIMEOUT_S)
        stamp.touch()
    return RUNTIME_BUILD


def _source_file_name(code: str, default: str) -> str:
    """javac requires a public top-level class to live in a file of the same name."""
    match = re.search(r"^\s*public\s+(?:final\s+|abstract\s+)*class\s+(\w+)", code, re.M)
    return (match.group(1) if match else default) + ".java"


def _clean_compiler_output(text: str, workdir: str) -> str:
    text = text.replace(workdir + "/", "")
    return "\n".join(line for line in text.splitlines() if not line.startswith("Note:")).strip()


def _failure(status: str, error: str) -> dict:
    return {"status": status, "error": error, "tests": []}


def run(spec: dict, code: str, include_hidden: bool) -> dict:
    """Judge Java code against the spec; returns the same shape as harness.run()."""
    info = java_info(spec)
    if info.get("unsupported"):
        return _failure("Unsupported", info["unsupported"])
    runtime = _runtime_classes()
    selected = [(i, t) for i, t in enumerate(spec["tests"]) if include_hidden or not t.get("hidden")]

    with tempfile.TemporaryDirectory(prefix="practice-java-") as workdir:
        work = Path(workdir)
        source = work / _source_file_name(code, info["className"])
        source.write_text(AUTO_IMPORTS + code)
        classes = work / "classes"
        classes.mkdir()
        compiled = subprocess.run(["javac", "-nowarn", "-encoding", "UTF-8", "-cp", str(runtime), "-d", str(classes), str(source)],
                                  capture_output=True, text=True, timeout=COMPILE_TIMEOUT_S)
        if compiled.returncode != 0:
            return _failure("Compile Error", _clean_compiler_output(compiled.stderr, workdir))

        op_names = info.get("opNames") or {}
        # Overrides define their own Java signature; generated starters mirror the Python one, defaults included.
        defaults = None if (OVERRIDES_DIR / f"{spec['rank']}.json").exists() else parameter_defaults(spec)
        job_tests = []
        for _, test in selected:
            if spec["kind"] == "class":
                ops = [op_names.get(op, camel(op)) for op in test["ops"]]
                job_tests.append({"ops": ops, "args": test["args"]})
            else:
                job_tests.append({"args": _with_defaults(test["args"], defaults)})
        job = {"kind": spec["kind"], "className": info["className"], "method": info["method"],
               "mutates": spec.get("mutates"), "tests": job_tests}
        (work / "job.json").write_text(json.dumps(job))
        results_path = work / "results.jsonl"
        limit = TIME_LIMIT_S["submit" if include_hidden else "run"]
        timed_out, stderr = False, ""
        try:
            finished = subprocess.run(["java", *JVM_FLAGS, "-cp", f"{classes}:{runtime}", "Driver", str(work / "job.json"), str(results_path)],
                                      capture_output=True, text=True, timeout=limit)
            stderr = finished.stderr
        except subprocess.TimeoutExpired:
            timed_out = True
        lines = results_path.read_text().splitlines() if results_path.exists() else []

    return _judge(spec, selected, [json.loads(line) for line in lines], include_hidden, timed_out, limit, stderr)


def _with_defaults(args: list, defaults) -> list:
    """Append Python default values for trailing parameters this test omits (Java has no default arguments)."""
    if not defaults:
        return args
    param_count, values = defaults
    missing = param_count - len(args)
    return args + values[len(values) - missing:] if 0 < missing <= len(values) else args


def _judge(spec, selected, raw_results, include_hidden, timed_out, limit, stderr):
    checker = _load_checker(spec)

    tests = []
    for (index, test), raw in zip(selected, raw_results):
        if raw.get("driver_error"):
            return _failure("Runtime Error", raw["driver_error"])
        got = json.loads(raw["got"]) if "got" in raw else None
        error = raw.get("error")
        passed = False
        if error is None:
            try:
                passed = bool(checker(json.loads(json.dumps(test["args"])), harness.normalize(got))) if checker \
                    else harness.matches(got, test["expected"], spec.get("compare", "exact"))
            except Exception:  # a checker choking on a malformed answer means the answer is wrong
                passed = False
        shown_input = test["args"] if spec["kind"] == "function" else {"ops": test["ops"], "args": test["args"]}
        tests.append({
            "index": index,
            "hidden": bool(test.get("hidden")),
            "passed": passed,
            "input": harness._shown(shown_input),
            "expected": harness._shown(test["expected"]),
            "got": harness._shown(got) if error is None else None,
            "error": error,
            "stdout": raw.get("stdout", "")[:harness.MAX_SHOWN_CHARS],
            "ms": raw.get("ms", 0),
        })
        if include_hidden and not passed:
            break  # like a judge: Submit stops at the first failing test

    failed = [t for t in tests if not t["passed"]]
    if not failed and not timed_out and len(tests) < len(selected):
        # The JVM stopped mid-run (System.exit, OutOfMemoryError, ...): report it on the unfinished test.
        detail = (stderr or "").strip().splitlines()
        return {"status": "Runtime Error",
                "error": f"Your program stopped during test {len(tests) + 1}." + (f"\n{detail[0]}" if detail else ""),
                "tests": tests, "passed": len(tests), "total": len(selected)}
    if timed_out and not failed:
        return {"status": "Time Limit Exceeded",
                "error": f"Stopped after {limit} s on test {len(tests) + 1}. Look for an infinite loop or a slower-than-needed algorithm.",
                "tests": tests, "passed": len(tests), "total": len(selected)}
    if not failed:
        status = "Accepted"
    elif any(t["error"] for t in failed):
        status = "Runtime Error"
    else:
        status = "Wrong Answer"
    return {"status": status, "error": None, "tests": tests, "passed": len(tests) - len(failed), "total": len(selected)}
