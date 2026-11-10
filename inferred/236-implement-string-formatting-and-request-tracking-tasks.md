# Implement string formatting and request tracking tasks
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · easy · Pattern: String Processing, Design / Data Structure

## Problem
This is a multi-part screen with three independent warm-up tasks. The overview names numeric formatting, validating characters under a 180° rotation, and tracking events so they can be output in order. The precise original wording is unknown, so each part uses the most standard version.

### Part 1 — Format a number with thousands separators
You get a decimal number as a string. It may have a leading `+` or `-`, leading zeros, and an optional fractional part after one `.`. Return it with a comma between every group of three digits in the **integer part**, counting from the right. Remove leading zeros from the integer part, keeping one `0` if nothing is left. Drop a leading `+`. Keep the fractional part exactly as given. Write a value equal to zero without a minus sign (`"-0"` becomes `"0"`).

### Part 2 — Rotate a digit string by 180°
When you turn a digit string upside down, it reverses and each digit maps as `0→0, 1→1, 6→9, 8→8, 9→6`. No other digit can be rotated. Return the rotated string, or `None` if any character can't be rotated. Keep the result exactly as produced, including leading zeros. A string is **strobogrammatic** when `rotate_180(s) == s`.

### Part 3 — Request tracker with ordered output
Design a `RequestTracker` that receives `start(request_id, timestamp)` and `end(request_id, timestamp)` events. Requests have to be reported **in the order they started**. A request can only be reported after it has ended **and** every request that started before it has already been reported. Each call to `end` returns the list of `(request_id, start_time, end_time)` tuples that become reportable because of that call, in start order. The list may be empty.

You may assume every `end` matches an earlier `start`, IDs are unique among active requests, and each operation should run in amortised O(1) time.

## Function signature
```python
# Part 1
def format_number(s: str) -> str: ...

# Part 2
def rotate_180(s: str) -> str | None: ...

# Part 3
class RequestTracker:
    def __init__(self) -> None: ...
    def start(self, request_id: str, timestamp: int) -> None: ...
    def end(self, request_id: str, timestamp: int) -> list[tuple[str, int, int]]: ...
```

## Constraints
- Part 1: `1 <= len(s) <= 10^5`, and the string is a well-formed decimal
- Part 2: `0 <= len(s) <= 10^5`
- Part 3: up to `10^5` events, with timestamps non-decreasing across calls

## Examples
**Part 1**
- `format_number("1234567")` returns `"1,234,567"`
- `format_number("-1234567.891")` returns `"-1,234,567.891"`
- `format_number("999")` returns `"999"`, and `format_number("1000")` returns `"1,000"`
- Edge cases: `format_number("+0001000000")` returns `"1,000,000"`, `format_number("-0")` returns `"0"`, and `format_number("-0.50")` returns `"-0.50"`

**Part 2**
- `rotate_180("619")` returns `"619"`, so it is strobogrammatic
- `rotate_180("10")` returns `"01"`, so it is rotatable but not strobogrammatic
- Edge cases: `rotate_180("1234")` returns `None`, and `rotate_180("2")` returns `None`

**Part 3**
```
t = RequestTracker()
t.start("A", 1); t.start("B", 2); t.start("C", 3)
t.end("B", 4)  -> []                              # A (started earlier) still running
t.end("A", 5)  -> [("A", 1, 5), ("B", 2, 4)]
t.start("D", 6)
t.end("D", 7)  -> []                              # C still running
t.end("C", 8)  -> [("C", 3, 8), ("D", 6, 7)]
```

<details><summary>Approach (spoiler)</summary>

**Part 1:** Separate the sign, integer part and fractional part. Strip leading zeros, cut the integer part into groups of 3 from the right, and join them with commas. Drop the minus sign if every digit is zero. **Time** O(n), **Space** O(n).

**Part 2:** Walk the string backwards and map each digit through the rotation table, returning `None` on any digit not in the table. **Time** O(n), **Space** O(n).

**Part 3:** Keep a FIFO queue of request IDs in start order and a map from ID to `[start, end]`. `end` records the end time, then pops from the front of the queue for as long as the front request has finished. Every request is pushed and popped once, so each operation is amortised O(1). **Space** O(active requests).

```python
from __future__ import annotations
from collections import deque

def format_number(s: str) -> str:
    sign = ""
    if s and s[0] in "+-":
        sign, s = ("-" if s[0] == "-" else ""), s[1:]
    ip, fp = (s.split(".", 1) if "." in s else (s, None))
    fp = "." + fp if fp is not None else ""
    ip = ip.lstrip("0") or "0"
    groups = []
    while len(ip) > 3:
        groups.append(ip[-3:])
        ip = ip[:-3]
    groups.append(ip)
    out = ",".join(reversed(groups)) + fp
    if sign == "-" and out.strip("0.,") == "":   # value is zero
        sign = ""
    return sign + out

ROT = {"0": "0", "1": "1", "6": "9", "8": "8", "9": "6"}

def rotate_180(s: str) -> str | None:
    out = []
    for ch in reversed(s):
        if ch not in ROT:
            return None
        out.append(ROT[ch])
    return "".join(out)

class RequestTracker:
    def __init__(self) -> None:
        self.order = deque()
        self.info = {}

    def start(self, request_id: str, timestamp: int) -> None:
        self.order.append(request_id)
        self.info[request_id] = [timestamp, None]

    def end(self, request_id: str, timestamp: int) -> list[tuple[str, int, int]]:
        self.info[request_id][1] = timestamp
        out = []
        while self.order and self.info[self.order[0]][1] is not None:
            rid = self.order.popleft()
            s, e = self.info.pop(rid)
            out.append((rid, s, e))
        return out
```
</details>
