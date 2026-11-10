# Check an Interval Against Existing Intervals for Conflicts
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Easy · Pattern: Intervals / Sweep Line

## Problem
You are given a large, **unsorted** collection of existing intervals and one candidate interval. All intervals are half-open: `[start, end)` covers times `t` with `start <= t < end`, and `start < end`.

Return `True` if the candidate overlaps at least one existing interval, `False` otherwise. Two half-open intervals `[a, b)` and `[c, d)` conflict exactly when `a < d` and `c < b`. Intervals that only touch at an endpoint (e.g. `[1,5)` and `[5,8)`) do **not** conflict. Existing intervals may overlap each other; that is irrelevant to the answer.

Follow-up: if many candidates are checked against the same collection, preprocess it so each check takes O(log n).

## Function signature
```python
from typing import List

def has_conflict(intervals: List[List[int]], candidate: List[int]) -> bool:
    ...

class ConflictChecker:            # follow-up
    def __init__(self, intervals: List[List[int]]): ...
    def conflicts(self, start: int, end: int) -> bool: ...
```

## Constraints
- `0 <= len(intervals) <= 10^6`
- `-10^9 <= start < end <= 10^9`

## Examples
**Example 1**
Input: `intervals = [[10,20],[1,5],[30,40]]`, `candidate = [4,8]`
Output: `True`
Explanation: `[4,8)` and `[1,5)` share times 4 to 5.

**Example 2** (touching endpoints)
Input: `intervals = [[10,20],[1,5],[30,40]]`, `candidate = [5,10]`
Output: `False`
Explanation: The candidate starts exactly when `[1,5)` ends and ends exactly when `[10,20)` starts.

**Example 3**
Input: same `intervals`; `candidate = [15,16]` → `True`; `[20,30]` → `False`; `[0,100]` → `True`

**Example 4** (empty collection)
Input: `intervals = []`, `candidate = [1,2]` → `False`

<details><summary>Approach (spoiler)</summary>

A single query on unsorted data cannot beat a linear scan: check `a < end and start < b` for every interval, stopping at the first hit. Sorting first would cost O(n log n) and is only worth it for repeated queries. For the follow-up, sort and merge overlapping intervals (strict `<` so touching ones stay separate is fine either way), then binary-search the last merged block that starts before the candidate's end and check whether it ends after the candidate's start.
**Time:** O(n) per query; follow-up O(n log n) preprocessing + O(log n) per query · **Space:** O(1); follow-up O(n)

```python
import bisect
from typing import List

def has_conflict(intervals: List[List[int]], candidate: List[int]) -> bool:
    s, e = candidate
    return any(a < e and s < b for a, b in intervals)

class ConflictChecker:
    """Follow-up: many queries against a fixed set of (possibly overlapping) intervals."""
    def __init__(self, intervals: List[List[int]]):
        merged = []
        for a, b in sorted(intervals):
            if merged and a < merged[-1][1]:
                merged[-1][1] = max(merged[-1][1], b)
            else:
                merged.append([a, b])
        self.starts = [a for a, _ in merged]
        self.ends = [b for _, b in merged]

    def conflicts(self, s: int, e: int) -> bool:
        i = bisect.bisect_left(self.starts, e) - 1   # last merged block starting before e
        return i >= 0 and self.ends[i] > s
```
</details>
