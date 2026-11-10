# Streaming Points: Remove Any Pair Within a Distance
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Design / Data Structure, Hashing / Counting

## Problem
Points on a number line (real numbers) arrive one at a time. You maintain a collection of **unpaired** points and a distance threshold `d >= 0`.

When a new point `x` arrives:
- If the collection contains at least one point `y` with `|x - y| <= d`, then `x` and one such `y` form a pair and are **both removed**: `y` is deleted from the collection and `x` is never stored. Report `y`.
- Otherwise `x` is added to the collection and nothing is reported.

Any valid partner is acceptable in principle; to make the output deterministic, choose the partner **closest** to `x`, and if two candidates are equally close (one on each side) choose the **smaller** one.

Floating-point handling: compare distances with a tolerance `EPS = 1e-9`, i.e. treat `|x - y| <= d + EPS` as "within distance", and treat two gaps as equal if they differ by at most `EPS`. Duplicate values are allowed (an identical point is always within distance).

Implement a class with:
- `PointStream(d)` — create an empty stream (raise `ValueError` if `d < 0`).
- `add(x) -> Optional[float]` — process `x` as above; return the removed partner `y`, or `None` if `x` was stored.
- `remaining() -> List[float]` — the currently unpaired points in ascending order.

Each `add` should run in O(log n) with a balanced BST / sorted set.

## Function signature
```python
from typing import List, Optional

class PointStream:
    def __init__(self, d: float): ...
    def add(self, x: float) -> Optional[float]: ...
    def remaining(self) -> List[float]: ...
```

## Constraints
- Up to `2 * 10^5` calls to `add`
- `-10^9 <= x <= 10^9`, `0 <= d <= 10^9`
- Values are floats; comparisons use the tolerance above

## Examples
**Example 1**
Input: `d = 2.0`, adds `[5.0, 10.0, 6.5, 1.0, 11.0, 3.0, 8.0]`
Output: add results `[None, None, 5.0, None, 10.0, 1.0, None]`, `remaining() = [8.0]`
Explanation: `6.5` pairs with `5.0` (gap 1.5). `11.0` pairs with `10.0`. `3.0` is exactly `2.0` from `1.0`, which counts as within distance. `8.0` finds nothing within 2 (the collection is empty), so it stays.

**Example 2** (floating-point edge case)
Input: `d = 0.1`, adds `[0.3, 0.4, 0.75]`
Output: `[None, 0.3, None]`, `remaining() = [0.75]`
Explanation: In binary floating point `0.4 - 0.3` evaluates to `0.10000000000000003`, slightly above `0.1`; the tolerance makes it count as within distance, as intended.

**Example 3** (tie-break)
Input: `d = 1.0`, adds `[4.0, 6.0, 5.0]`
Output: `[None, None, 4.0]`, `remaining() = [6.0]`
Explanation: `5.0` is equally close to `4.0` and `6.0`; the smaller one is removed.

<details><summary>Approach (spoiler)</summary>

Keep the unpaired points in a sorted structure. The closest stored point to `x` is always either its predecessor or its successor, so a single binary search (`bisect`) finds the only two candidates; check them against `d + EPS`, pick the closer (smaller on ties), and delete it — otherwise insert `x`. Greedy pairing is safe here because the problem only asks to pair a point with any partner within range. In Python, `sortedcontainers.SortedList` gives O(log n) insert/delete; the plain-list version below is O(n) per update due to shifting but has identical logic. (In a hashing variant, bucketing points into cells of width `d` and checking the neighbouring buckets gives expected O(1).)
**Time:** O(log n) per `add` with a balanced BST (O(n) with a plain list) · **Space:** O(n)

```python
import bisect
from typing import List, Optional

class PointStream:
    EPS = 1e-9

    def __init__(self, d: float):
        if d < 0:
            raise ValueError("d must be non-negative")
        self.d = d
        self.pts: List[float] = []  # kept sorted; use SortedList for O(log n)

    def add(self, x: float) -> Optional[float]:
        i = bisect.bisect_left(self.pts, x)
        best = None
        for j in (i - 1, i):  # predecessor, then successor
            if 0 <= j < len(self.pts):
                gap = abs(x - self.pts[j])
                if gap <= self.d + self.EPS:
                    if best is None or gap < abs(x - self.pts[best]) - self.EPS:
                        best = j
        if best is None:
            self.pts.insert(i, x)
            return None
        return self.pts.pop(best)

    def remaining(self) -> List[float]:
        return list(self.pts)
```
</details>
