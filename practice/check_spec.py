"""Validate a test spec and prove it with a reference solution, using the same harness the browser runs.

Usage: python3 check_spec.py practice/tests/200.json path/to/reference.py
Exit code 0 only when the spec is well-formed and the reference passes every test.
"""
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import harness  # noqa: E402

MIN_VISIBLE, MIN_HIDDEN = 2, 6
MAX_SPEC_BYTES = 300_000
MAX_REFERENCE_SECONDS = 3.0
COMPARE_MODES = {"exact", "float", "unordered", "unordered_nested"}


def structural_problems(spec: dict) -> list:
    problems = []
    for key in ("rank", "kind", "entry", "starter", "tests"):
        if key not in spec:
            problems.append(f"missing key {key!r}")
    if problems:
        return problems
    if spec["kind"] not in ("function", "class"):
        problems.append("kind must be 'function' or 'class'")
    if spec.get("compare", "exact") not in COMPARE_MODES:
        problems.append(f"compare must be one of {sorted(COMPARE_MODES)}")
    if spec["entry"] not in spec["starter"]:
        problems.append("starter code must define the entry name")
    try:
        compile(spec["starter"], "starter.py", "exec")
    except SyntaxError as err:
        problems.append(f"starter does not compile: {err}")
    visible = [t for t in spec["tests"] if not t.get("hidden")]
    hidden = [t for t in spec["tests"] if t.get("hidden")]
    if len(visible) < MIN_VISIBLE or len(hidden) < MIN_HIDDEN:
        problems.append(f"need at least {MIN_VISIBLE} visible and {MIN_HIDDEN} hidden tests (have {len(visible)}/{len(hidden)})")
    for i, test in enumerate(spec["tests"]):
        needed = ("ops", "args", "expected") if spec["kind"] == "class" else ("args", "expected")
        missing = [k for k in needed if k not in test]
        if missing:
            problems.append(f"test {i} missing {missing}")
        elif spec["kind"] == "class" and not (len(test["ops"]) == len(test["args"]) == len(test["expected"])):
            problems.append(f"test {i}: ops, args and expected must have equal length")
        elif spec["kind"] == "function" and not isinstance(test["args"], list):
            problems.append(f"test {i}: args must be a list of positional arguments")
    if len(json.dumps(spec)) > MAX_SPEC_BYTES:
        problems.append(f"spec larger than {MAX_SPEC_BYTES} bytes; shrink the big tests")
    return problems


def main() -> None:
    spec_path, reference_path = Path(sys.argv[1]), Path(sys.argv[2])
    spec = json.loads(spec_path.read_text())
    problems = structural_problems(spec)
    if problems:
        print("INVALID SPEC:\n  " + "\n  ".join(problems))
        sys.exit(1)

    started = time.perf_counter()
    result = harness.run(spec, reference_path.read_text(), include_hidden=True)
    elapsed = time.perf_counter() - started
    starter_result = harness.run(spec, spec["starter"], include_hidden=False)

    print(f"{spec_path.name}: {result['status']} {result.get('passed', 0)}/{result.get('total', 0)} in {elapsed:.2f}s")
    if result["status"] != "Accepted":
        failing = next((t for t in result["tests"] if not t["passed"]), None)
        print("  first failure:", json.dumps(failing or result.get("error"), indent=2)[:1500])
        sys.exit(1)
    if elapsed > MAX_REFERENCE_SECONDS:
        print(f"  reference took {elapsed:.2f}s (> {MAX_REFERENCE_SECONDS}s); browsers run Python ~3x slower, so shrink the tests")
        sys.exit(1)
    if starter_result["status"] == "Accepted":
        print("  the empty starter passes the visible tests; tests are too weak")
        sys.exit(1)
    print("  OK")


if __name__ == "__main__":
    main()
