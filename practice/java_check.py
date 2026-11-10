"""Judge a Java solution locally with the same tests the app uses.

Usage: python3 java_check.py tests/200.json Solution.java          (submit: all tests)
       python3 java_check.py tests/200.json --starter               (run the generated starter on sample tests)
"""
import json
import sys
from pathlib import Path

import java_support


def main() -> None:
    spec = json.loads(Path(sys.argv[1]).read_text())
    if sys.argv[2] == "--starter":
        info = java_support.java_info(spec)
        if info.get("unsupported"):
            print(f"{Path(sys.argv[1]).name}: Unsupported - {info['unsupported']}")
            sys.exit(2)
        result = java_support.run(spec, info["starter"], include_hidden=False)
    else:
        result = java_support.run(spec, Path(sys.argv[2]).read_text(), include_hidden=True)
    print(f"{Path(sys.argv[1]).name}: {result['status']} {result.get('passed', 0)}/{result.get('total', 0)}")
    failing = next((t for t in result["tests"] if not t["passed"]), None)
    if result.get("error") or failing:
        print("  ", json.dumps(result.get("error") or failing)[:800])
    sys.exit(0 if result["status"] == "Accepted" else 1)


if __name__ == "__main__":
    main()
