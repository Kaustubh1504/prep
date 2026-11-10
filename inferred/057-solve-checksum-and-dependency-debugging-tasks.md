# Solve checksum and dependency debugging tasks
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Online Assessment · Hard · Pattern: Topological Sort

## Problem
This assessment has two independent parts. In the original, at least the second part was presented as **buggy existing code to debug**; here both parts are stated as "implement the correct behaviour", and the approach lists the bugs such code typically contains.

### Part 1 — Checksum character
Product codes carry a trailing checksum character. Use the 36-symbol alphabet `"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"`, where each symbol's value is its index (`'0'`→0 … `'9'`→9, `'A'`→10 … `'Z'`→35).

To compute the checksum of a code body:
1. Convert to upper case and drop every character not in the alphabet (e.g. hyphens and spaces are ignored entirely and do not take up a position).
2. With 1-based positions `i` over the remaining characters, compute `total = Σ i · value(c_i)`.
3. The checksum is the alphabet symbol at index `total mod 36`.

Implement `checksum_char(body)` and `is_valid_code(code)`, which treats the last character of `code` as the checksum of everything before it (case-insensitive). A code shorter than 2 characters is invalid. The checksum of an empty body is `'0'`.

### Part 2 — Feature enablement with dependencies
A configuration file lists features and their dependencies, one feature per line:
```
feature_name: dep1, dep2, ...
```
- `#` starts a comment that runs to end of line; blank lines are ignored.
- The colon and dependency list are optional (`auth:` or just `storage` both mean "no dependencies").
- A dependency that has no line of its own is a valid feature with no dependencies.

Given the config text and a list of `requested` features, return the list of features to enable, in an order where every feature appears after all of its (transitive) dependencies. Each feature appears once. The order is deterministic: process `requested` left to right, and for each feature first enable its dependencies in the order they are listed (depth-first), then the feature itself; already-enabled features are skipped.

If enabling any requested feature would require a **dependency cycle**, return `None`. Cycles among features that are never needed do not matter.

## Function signature
```python
from typing import List, Optional

def checksum_char(body: str) -> str: ...
def is_valid_code(code: str) -> bool: ...

def enable_features(config: str, requested: List[str]) -> Optional[List[str]]: ...
```

## Constraints
- Part 1: code length `<= 10^5`
- Part 2: up to `10^4` features and `10^5` dependency edges; names are non-empty strings without `:`, `,` or `#`

## Examples
**Example 1** (Part 1)
Input: `checksum_char("AB12")`
Output: `"7"`
Explanation: `1·10 + 2·11 + 3·1 + 4·2 = 43`, `43 mod 36 = 7`. So `is_valid_code("AB127")` is `True` and `is_valid_code("AB12Z")` is `False`.

**Example 2** (Part 1, separators ignored)
Input: `checksum_char("GOOG")`, `checksum_char("a-1")`
Output: `"K"`, `"C"`
Explanation: `GOOG`: `16 + 48 + 72 + 64 = 200`, `200 mod 36 = 20` → `K`. `a-1` becomes `A1`: `10 + 2 = 12` → `C`.

**Example 3** (Part 2)
Input:
```
config = "# feature: dependencies\nsearch: index, auth\nindex: storage\nauth:\nstorage\n"
requested = ["search"]
```
Output: `["storage", "index", "auth", "search"]`
With `requested = ["auth", "search", "auth"]` the output is `["auth", "storage", "index", "search"]`.

**Example 4** (Part 2, cycles)
Input: `config = "a: b\nb: c\nc: a\nd:"`
- `requested = ["d"]` → Output: `["d"]` (the cycle is never touched)
- `requested = ["d", "a"]` → Output: `None`

Also: `enable_features("x: y", ["x"])` → `["y", "x"]` (undeclared dependency `y` has no dependencies).

<details><summary>Approach (spoiler)</summary>

Part 1 is a direct weighted sum mod 36; the usual bugs are 0-based instead of 1-based weights, letting skipped separators consume a position, forgetting to upper-case, and comparing the checksum case-sensitively. Part 2 is a DFS topological sort with three colours: "visiting" (on the current stack) and "done". Reaching a "visiting" node means a cycle. Typical bugs in the buggy version: marking a node done before its dependencies (wrong order), using one `visited` set (cannot tell a cycle from a shared dependency, causing false cycle reports or infinite recursion), not stripping whitespace/comments, and adding duplicates.
**Time:** Part 1 O(L); Part 2 O(V + E) · **Space:** O(V + E)

```python
from typing import List, Optional

ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

def checksum_char(code: str) -> str:
    chars = [ch for ch in code.upper() if ch in ALPHABET]   # ignore separators like '-'
    total = sum((i + 1) * ALPHABET.index(ch) for i, ch in enumerate(chars))
    return ALPHABET[total % 36]

def is_valid_code(code: str) -> bool:
    return len(code) >= 2 and checksum_char(code[:-1]) == code[-1].upper()

def enable_features(config: str, requested: List[str]) -> Optional[List[str]]:
    deps = {}
    for raw in config.splitlines():
        line = raw.split("#", 1)[0].strip()
        if not line:
            continue
        name, _, rest = line.partition(":")
        name = name.strip()
        deps.setdefault(name, [])
        for d in rest.split(","):
            d = d.strip()
            if d:
                deps[name].append(d)
    state = {}          # 1 = on stack, 2 = done
    order: List[str] = []

    def visit(f) -> bool:
        s = state.get(f)
        if s == 2: return True
        if s == 1: return False          # cycle
        state[f] = 1
        for d in deps.get(f, []):
            if not visit(d): return False
        state[f] = 2
        order.append(f)
        return True

    for f in requested:
        if not visit(f):
            return None
    return order
```
</details>
