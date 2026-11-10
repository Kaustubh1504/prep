# Design a rolling hit counter API
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Design / Data Structure

## Problem
Build a hit counter that reports how many hits happened in the **last 300 seconds** (a rolling window).

You are given a sequence of operations, each a pair `(op, timestamp)`:
- `("hit", t)` records one hit at second `t`.
- `("getHits", t)` asks for the number of hits whose timestamp lies in the window `[t - 299, t]`, i.e. hits strictly newer than `t - 300`.

Timestamps are in seconds and are given in **non-decreasing** order across all operations (several hits can share the same timestamp). Process the operations in order and return the list of answers to the `getHits` operations, in order.

Aim for amortized O(1) work per operation and memory proportional to the number of distinct timestamps inside the window, not the total number of hits (many hits may arrive in the same second).

## Function signature
```python
from typing import List, Tuple

def processOperations(operations: List[Tuple[str, int]]) -> List[int]:
    ...
```

## Constraints
- `1 <= len(operations) <= 10^5`
- `1 <= timestamp <= 2 * 10^9`, non-decreasing across operations
- `op` is either `"hit"` or `"getHits"`

## Examples
**Example 1**
Input: `operations = [("hit",1), ("hit",2), ("hit",3), ("getHits",4), ("hit",300), ("getHits",300), ("getHits",301)]`
Output: `[3, 4, 3]`
Explanation: At t=4 the window `[-295, 4]` holds hits 1, 2, 3. At t=300 the window `[1, 300]` holds all four hits. At t=301 the window is `[2, 301]`, so the hit at second 1 has expired.

**Example 2** (an edge case)
Input: `operations = [("getHits",5), ("hit",10), ("hit",10), ("hit",10), ("getHits",309), ("getHits",310)]`
Output: `[0, 3, 0]`
Explanation: No hits yet at t=5. Three hits share second 10; they are still counted at t=309 (window `[10, 309]`) and all expire together at t=310.

<details><summary>Approach (spoiler)</summary>

Keep a deque of `[timestamp, count]` buckets (one bucket per distinct second, in increasing order) plus a running total. Before each operation, pop buckets from the front whose timestamp is `<= t - 300` and subtract their counts. A hit either increments the last bucket (same second) or appends a new one. `getHits` just returns the running total. Each bucket is pushed and popped once, so the work is amortized O(1). If the timestamps were unbounded in number per window, a fixed 300-slot circular array indexed by `t % 300` gives O(1) memory as an alternative.
**Time:** O(1) amortized per operation · **Space:** O(min(300, distinct timestamps in window))

```python
from collections import deque
from typing import List, Tuple

def processOperations(operations: List[Tuple[str, int]]) -> List[int]:
    WINDOW = 300
    window = deque()  # [timestamp, count]
    total = 0
    result = []
    for op, t in operations:
        while window and window[0][0] <= t - WINDOW:
            total -= window.popleft()[1]
        if op == "hit":
            if window and window[-1][0] == t:
                window[-1][1] += 1
            else:
                window.append([t, 1])
            total += 1
        elif op == "getHits":
            result.append(total)
        else:
            raise ValueError(f"unknown op {op!r}")
    return result
```
</details>
