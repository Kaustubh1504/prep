# Design a logger that returns top-K messages
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Heap / Top-K

## Problem
Design an in-memory logger that records messages with timestamps and can report the most frequent messages within a time range.

Implement a class `TopKLogger`:
- `log(timestamp, message)` — record that `message` was logged at `timestamp`. Timestamps arrive in non-decreasing order. The same message may be logged many times (including at the same timestamp).
- `top_k(k, start, end)` — return up to `k` distinct messages that were logged most often during the inclusive time range `[start, end]`, ordered by frequency descending. Ties in frequency are broken by message in lexicographically ascending order. If fewer than `k` distinct messages fall in the range, return all of them; if none do (or `k == 0`), return an empty list.

## Function signature
```python
from typing import List

class TopKLogger:
    def __init__(self): ...
    def log(self, timestamp: int, message: str) -> None: ...
    def top_k(self, k: int, start: int, end: int) -> List[str]: ...
```

## Constraints
- Up to `10^5` calls to `log` and `10^4` calls to `top_k`
- `0 <= timestamp, start, end <= 10^9`, `start <= end`
- `0 <= k <= 10^5`
- Messages are non-empty strings of length `<= 100`

## Examples
**Example 1**
Input:
```
log(1, "disk full"); log(2, "timeout"); log(3, "disk full")
log(5, "auth fail"); log(6, "timeout"); log(7, "timeout")
top_k(2, 1, 7)
top_k(2, 1, 5)
```
Output: `["timeout", "disk full"]`, then `["disk full", "auth fail"]`
Explanation: In `[1,7]`: timeout×3, disk full×2, auth fail×1. In `[1,5]`: disk full×2, then auth fail and timeout tie at 1 and `"auth fail"` is lexicographically smaller.

**Example 2** (fewer than k / empty range)
Input (same logs): `top_k(5, 4, 5)`, `top_k(3, 8, 10)`
Output: `["auth fail"]`, then `[]`

<details><summary>Approach (spoiler)</summary>

Because timestamps are non-decreasing, store logs in two parallel arrays; a query binary-searches for the slice `[start, end]`. Count messages in that slice with a hash map, then select the top `k` using a size-k heap keyed by `(-count, message)` so ties resolve lexicographically. If queries dominated and ranges were fixed buckets, one could precompute per-bucket counters, but the slice-and-heap version is the clean baseline.
**Time:** `log` O(1); `top_k` O(log n + m + d log k) for m logs and d distinct messages in range · **Space:** O(n)

```python
import bisect, heapq
from collections import Counter
from typing import List

class TopKLogger:
    def __init__(self):
        self.times: List[int] = []
        self.msgs: List[str] = []

    def log(self, timestamp: int, message: str) -> None:
        # timestamps arrive in non-decreasing order
        self.times.append(timestamp)
        self.msgs.append(message)

    def top_k(self, k: int, start: int, end: int) -> List[str]:
        lo = bisect.bisect_left(self.times, start)
        hi = bisect.bisect_right(self.times, end)
        cnt = Counter(self.msgs[lo:hi])
        return [m for _, m in heapq.nsmallest(k, ((-c, m) for m, c in cnt.items()))]
```
</details>
