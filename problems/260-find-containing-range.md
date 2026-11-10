# Find Containing Range
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Intervals / Sweep Line, Design / Data Structure

## Problem
You get a collection of **non-overlapping** closed integer ranges `[l, r]` with `l <= r`, in arbitrary order. Build a data structure that preprocesses them once and then answers many queries quickly.

- `find(a, b)` with `a <= b`: return the stored range `[l, r]` that **fully contains** the query interval, meaning `l <= a` and `b <= r`. If no stored range contains it, return `None`. A point query is `find(x, x)`. Because the ranges don't overlap, at most one range can contain a given query.

Queries are much more frequent than preprocessing, so each query should be sub-linear. Scanning every range per query is the baseline to improve on.

*Discussion follow-ups:* supporting `add_range` and `remove_range` online (use a balanced BST or sorted container keyed by start), and what changes when ranges may overlap (for example, returning the shortest containing range with an interval tree or offline sweep).

## Function signature
```python
class RangeIndex:
    def __init__(self, ranges: list[list[int]]) -> None: ...
    def find(self, a: int, b: int) -> list[int] | None: ...
```

## Constraints
- `0 <= len(ranges) <= 10^5`, and the ranges are pairwise disjoint
- `-10^9 <= l <= r <= 10^9`
- Up to `10^5` queries, each with `a <= b`

## Examples
**Example 1**
```
ri = RangeIndex([[10,20],[1,5],[30,40],[22,25]])
ri.find(3, 4)    -> [1, 5]
ri.find(15, 15)  -> [10, 20]
ri.find(18, 21)  -> None        # starts inside [10,20] but runs past its end
ri.find(6, 9)    -> None        # falls in a gap
```

**Example 2** (edge cases: boundaries are inclusive)
```
ri.find(5, 5)    -> [1, 5]
ri.find(40, 40)  -> [30, 40]
ri.find(41, 41)  -> None
ri.find(0, 1)    -> None
RangeIndex([]).find(1, 1) -> None
```

<details><summary>Approach (spoiler)</summary>

Sort the ranges by start. Because they are disjoint, the ends come out sorted too. For a query `[a, b]`, binary search for the last range whose start is `<= a`. That range is the only one that could contain `a`, so the query is contained exactly when that range's end is `>= b`. Preprocessing is a single sort, and every query is one binary search.
**Time:** O(n log n) preprocessing, O(log n) per query · **Space:** O(n)

```python
from bisect import bisect_right
from typing import Optional

class RangeIndex:
    def __init__(self, ranges: list[list[int]]) -> None:
        self.ranges = sorted(ranges)                 # non-overlapping, so sorted by start
        self.starts = [l for l, _ in self.ranges]

    def find(self, a: int, b: int) -> Optional[list[int]]:
        i = bisect_right(self.starts, a) - 1         # last range starting at or before a
        if i >= 0 and self.ranges[i][1] >= b:
            return self.ranges[i]
        return None
```
</details>
