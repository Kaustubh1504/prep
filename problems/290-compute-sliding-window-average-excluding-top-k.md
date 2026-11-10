# Compute sliding-window average excluding top k
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Sliding Window, Heap / Top-K

## Problem
Design a streaming class for a moving average that is robust to spikes. It is built with a window size `w` and an integer `k` where `0 <= k < w`. Each call `next(val)` appends one integer to the stream and then looks at the **last `w` values**:
- If fewer than `w` values have arrived, return `None`.
- Otherwise, drop the `k` largest values in the window and return the average of the other `w - k` as a float. Duplicates count separately: if the window holds two 7s and `k = 1`, only one 7 is dropped.

Values may be negative. With `k = 0`, this is a plain moving average. Each call should take O(log w) amortised time. Re-sorting the window on every call is too slow.

## Function signature
```python
class TrimmedMovingAverage:
    def __init__(self, w: int, k: int) -> None: ...
    def next(self, val: int) -> float | None: ...
```

## Constraints
- `1 <= w <= 10^5`, `0 <= k < w`
- Up to `2 * 10^5` calls to `next`
- `-10^9 <= val <= 10^9`

## Examples
**Example 1**
```
m = TrimmedMovingAverage(w=3, k=1)
[m.next(x) for x in [4, 10, 2, 7, 7, 1]]  ->  [None, None, 3.0, 4.5, 4.5, 4.0]
```
Explanation: For [4,10,2], 10 is dropped, giving (4+2)/2 = 3.0. For [10,2,7], 10 is dropped, giving 4.5. For [2,7,7], one 7 is dropped, giving 4.5. For [7,7,1], one 7 is dropped, giving 4.0.

**Example 2** (an edge case: duplicates of the maximum)
`w = 2, k = 1`, stream `[5, 5, 5, 1]` returns `[None, 5.0, 5.0, 1.0]`.

**Example 3** (an edge case: k = 0 with negative values)
`w = 2, k = 0`, stream `[-2, 3, -8, 0]` returns `[None, 0.5, -2.5, -4.0]`.

**Example 4** (an edge case)
`w = 1, k = 0`, stream `[9]` returns `[9.0]`. With `w = 3, k = 2`, the stream `[1, 2]` returns `[None, None]`.

<details><summary>Approach (spoiler)</summary>

Split the window into two heaps. `top` is a min-heap holding the `k` largest values, and `rest` is a max-heap holding the remaining `w - k` values, with a running sum `rest_sum`. Tag every value with its stream index. This makes duplicates distinct and allows **lazy deletion**: an entry has expired exactly when `idx <= i - w`, and expired entries are discarded when they reach the top of a heap. When a value leaves the window, subtract it from the count or sum of the side it is on, tracked in a `side[idx]` array. To add a new value, push it into `top` and move the smallest entry of `top` into `rest`. This keeps every value in `top` at least as large as every value in `rest`. Then move the largest of `rest` back into `top` until `top` holds `k` live values. The answer is `rest_sum / (w - k)`.
**Time:** O(log n) amortised per call · **Space:** O(n) because of index tagging. Use a dict of live indices to keep it at O(w).

```python
import heapq
from typing import Optional

class TrimmedMovingAverage:
    """Average of the last `w` stream values after excluding the `k` largest.
    Two lazy-deletion heaps: `top` (min-heap) holds the k largest, `rest`
    (max-heap) holds the other w - k. Entries carry their stream index, so
    an entry is expired exactly when index <= i - w."""

    def __init__(self, w: int, k: int) -> None:
        self.w, self.k = w, k
        self.i = -1                        # index of the latest value
        self.vals = []                     # value by stream index
        self.side = []                     # 'T' or 'R' by stream index
        self.top, self.rest = [], []       # (val, idx) and (-val, -idx)
        self.top_n = self.rest_n = 0
        self.rest_sum = 0

    def _expired(self, idx: int) -> bool:
        return idx <= self.i - self.w

    def _prune(self) -> None:
        while self.top and self._expired(self.top[0][1]):
            heapq.heappop(self.top)
        while self.rest and self._expired(-self.rest[0][1]):
            heapq.heappop(self.rest)

    def _top_to_rest(self) -> None:
        self._prune()
        v, idx = heapq.heappop(self.top)
        self.top_n -= 1
        heapq.heappush(self.rest, (-v, -idx))
        self.rest_n += 1; self.rest_sum += v; self.side[idx] = "R"

    def _rest_to_top(self) -> None:
        self._prune()
        nv, nidx = heapq.heappop(self.rest)
        v, idx = -nv, -nidx
        self.rest_n -= 1; self.rest_sum -= v
        heapq.heappush(self.top, (v, idx))
        self.top_n += 1; self.side[idx] = "T"

    def next(self, val: int) -> Optional[float]:
        self.i += 1
        self.vals.append(val); self.side.append("T")
        old = self.i - self.w                       # value leaving the window
        if old >= 0:
            if self.side[old] == "T":
                self.top_n -= 1
            else:
                self.rest_n -= 1; self.rest_sum -= self.vals[old]
        heapq.heappush(self.top, (val, self.i)); self.top_n += 1
        self._top_to_rest()                         # smallest of top ∪ {val} goes to rest
        while self.top_n < self.k and self.rest_n > 0:
            self._rest_to_top()
        if self.i < self.w - 1:
            return None                             # window not full yet
        return self.rest_sum / self.rest_n
```
</details>
