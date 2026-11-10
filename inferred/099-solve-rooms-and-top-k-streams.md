# Solve Rooms and Top-K Streams
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Heap / Top-K, Intervals / Sweep Line

## Problem
Two independent parts.

### Part 1 — Most booked room
There are `n` rooms numbered `0..n-1` and a list of meetings `[start, end)` with **unique** start times. Meetings are allocated in order of start time:
1. A meeting takes the **lowest-numbered** room that is free at its start time (a room whose previous meeting ended at or before `start` is free).
2. If no room is free, the meeting is delayed until the earliest time a room frees up and keeps its original duration. If several rooms free up at that same earliest time, it takes the lowest-numbered one. Delayed meetings keep their original start-order priority.

Return the number of the room that held the most meetings; break ties by the lowest room number.

### Part 2 — Top-K over a stream
Implement `TopKStream(k)` that consumes a stream of words:
- `add(word)` records one occurrence.
- `top()` returns the up to `k` most frequent words seen so far, ordered by count descending, with ties broken by word in lexicographically ascending order. Before any `add`, it returns `[]`.

Discuss the trade-off: answering `top()` by a heap over all distinct words is O(d log k) per query with O(1) updates; maintaining an ordered structure keyed by `(-count, word)` makes updates O(log d) and queries O(k).

## Function signature
```python
from typing import List

def most_booked_room(n: int, meetings: List[List[int]]) -> int: ...

class TopKStream:
    def __init__(self, k: int): ...
    def add(self, word: str) -> None: ...
    def top(self) -> List[str]: ...
```

## Constraints
- Part 1: `1 <= n <= 100`, `1 <= len(meetings) <= 10^5`, `0 <= start < end <= 5·10^5`, start times are unique
- Part 2: up to `10^5` `add` calls and `10^4` `top` calls, `1 <= k <= 100`, words are lowercase strings of length `<= 20`

## Examples
**Example 1** (Part 1)
Input: `n = 2`, `meetings = [[0,10],[1,5],[2,7],[3,4]]`
Output: `0`
Explanation: `[0,10)` → room 0, `[1,5)` → room 1. `[2,7)` waits until room 1 frees at 5 and runs `[5,10)`. `[3,4)` waits until 10; both rooms free then, so it takes room 0 and runs `[10,11)`. Rooms 0 and 1 each hold 2 meetings; the tie goes to room 0.

**Example 2** (Part 1)
Input: `n = 3`, `meetings = [[1,20],[2,10],[3,5],[4,9],[6,8]]`
Output: `1`
Explanation: `[4,9)` is delayed to `[5,10)` in room 2; `[6,8)` is delayed to `[10,12)` in room 1 (rooms 1 and 2 both free at 10; the lower number wins). Rooms 1 and 2 hold 2 meetings each, so the answer is 1.

**Example 3** (Part 1 edge case: rooms freed exactly on time)
Input: `n = 3`, `meetings = [[0,1],[1,2],[2,3]]`
Output: `0`

**Example 4** (Part 2)
Input: `s = TopKStream(2)`, then `add` each of `"b","a","c","a","c","c"` and call `top()` after each add.
Output: `["b"]`, `["a","b"]`, `["a","b"]`, `["a","b"]`, `["a","c"]`, `["c","a"]`
Explanation: After the first three adds all counts are 1, so ties resolve alphabetically. After the fifth add `a` and `c` both have 2.

<details><summary>Approach (spoiler)</summary>

Part 1: sort meetings by start and keep two min-heaps: free room numbers, and busy rooms keyed by `(end_time, room)`. Before each meeting, release every busy room with `end <= start`. If a room is free, use the smallest; otherwise pop the busy room with the earliest end (smallest number on ties) and schedule the meeting from that end time for its original duration. Count meetings per room.
Part 2: keep a hash map of counts; `top()` selects the k smallest `(-count, word)` pairs with a bounded heap.
**Time:** Part 1 O(m log m + m log n); Part 2 `add` O(1), `top` O(d log k) · **Space:** O(n + m) / O(d)

```python
import heapq
from collections import defaultdict
from typing import List

# Part 1
def most_booked_room(n: int, meetings: List[List[int]]) -> int:
    free = list(range(n))            # free room numbers (min-heap)
    busy = []                        # (end_time, room)
    count = [0] * n
    for start, end in sorted(meetings):
        while busy and busy[0][0] <= start:
            heapq.heappush(free, heapq.heappop(busy)[1])
        if free:
            room = heapq.heappop(free)
            heapq.heappush(busy, (end, room))
        else:
            avail, room = heapq.heappop(busy)      # earliest-free room, smallest number on ties
            heapq.heappush(busy, (avail + end - start, room))
        count[room] += 1
    return max(range(n), key=lambda r: (count[r], -r))

# Part 2
class TopKStream:
    def __init__(self, k: int):
        self.k = k
        self.freq = defaultdict(int)

    def add(self, item: str) -> None:
        self.freq[item] += 1

    def top(self) -> List[str]:
        return [w for _, w in heapq.nsmallest(self.k, ((-c, w) for w, c in self.freq.items()))]
```
</details>
