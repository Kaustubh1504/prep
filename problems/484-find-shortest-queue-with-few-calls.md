# Find Shortest Queue with Few Calls
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Design / Data Structure

## Problem
You are given `k` queues of integers. Each queue exposes a **restricted API** with only two operations, and every call is expensive:
- `is_empty() -> bool`
- `poll() -> int` — remove and return the front element (only valid when non-empty).

There is no `size()`, no peeking and no random access. Find the **shortest** queue (the one with the fewest elements) and return a pair `(length, total)` where `length` is its number of elements and `total` is the sum of its elements. If several queues tie for shortest, use the one with the **smallest index**. If the list of queues is empty, return `(0, 0)`. Consuming (destroying) the queues is allowed.

Minimise the total number of API calls. Draining every queue to count it costs about `2 · (sum of all lengths)` calls, which is wasteful when one queue is short and the others are huge. Your solution should use at most `k · (2L + 1)` calls, where `L` is the length of the shortest queue.

## Function signature
```python
from typing import List, Tuple

class RestrictedQueue:
    def is_empty(self) -> bool: ...
    def poll(self) -> int: ...

def shortest_queue(queues: List[RestrictedQueue]) -> Tuple[int, int]:
    ...
```

## Constraints
- `0 <= k <= 10^4`
- Each queue holds between `0` and `10^9` elements (so draining long queues is infeasible); `L * k <= 10^7`
- `-10^9 <= element <= 10^9`

## Examples
**Example 1**
Input: `queues = [[5,1,7,2], [3,3], [9,9,9]]`
Output: `(2, 6)` using 15 calls
Explanation: Poll the queues in lock-step rounds. After two full rounds (12 calls), round 3 polls queue 0 (2 calls) and then finds queue 1 empty (1 call): queue 1 is the shortest, with length 2 and sum `3 + 3 = 6`. Draining every queue (one `is_empty` before each `poll`, plus a final check) would have cost 21 calls.

**Example 2** (tie)
Input: `queues = [[1,2], [10,20,30], [4,6]]`
Output: `(2, 3)` using 13 calls
Explanation: Queues 0 and 2 both have length 2; queue 0 has the smaller index and is detected first.

**Example 3** (edge cases)
Input: `queues = [[1,2,3], []]` → Output: `(0, 0)` using 3 calls; `queues = []` → Output: `(0, 0)` using 0 calls.
Explanation: An empty queue is the shortest possible; we stop as soon as we see it.

<details><summary>Approach (spoiler)</summary>

Advance all queues in lock-step: in round `d`, visit queues in index order, and for each one call `is_empty()`; if it is empty, it has exactly `d` elements and every other queue has at least `d` (each queue already survived `d` polls), so it is the shortest — and the first such index wins ties. Otherwise `poll()` once and add the value to that queue's running sum. Every queue is polled at most `L` times, so the total is at most `k·L` polls plus `k·(L+1)` emptiness checks — optimal up to a constant, since any algorithm must poll every queue `L` times to prove none is shorter.
**Time:** O(k · L) calls · **Space:** O(k)

```python
from collections import deque
from typing import List, Tuple

class RestrictedQueue:
    """Only is_empty() and poll() are available; every call is counted."""
    def __init__(self, items: List[int]):
        self._items = deque(items)
        self.calls = 0

    def is_empty(self) -> bool:
        self.calls += 1
        return not self._items

    def poll(self) -> int:
        self.calls += 1
        return self._items.popleft()

def shortest_queue(queues: List[RestrictedQueue]) -> Tuple[int, int]:
    if not queues:
        return (0, 0)
    sums = [0] * len(queues)
    depth = 0
    while True:
        for i, q in enumerate(queues):
            if q.is_empty():          # first queue to run dry is the shortest
                return (depth, sums[i])
            sums[i] += q.poll()
        depth += 1
```
</details>
