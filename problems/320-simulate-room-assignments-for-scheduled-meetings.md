# Simulate room assignments for scheduled meetings
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Intervals / Sweep Line

## Problem
There are `n` meeting rooms numbered `0 .. n-1`. You are given `meetings`, where `meetings[i] = [start_i, end_i]` describes a meeting on the half-open interval `[start_i, end_i)`. All start times are **distinct**.

Simulate the allocation of meetings to rooms in increasing order of start time using these rules:
1. A room that becomes free at time `x` is available to a meeting starting at time `x` (half-open intervals).
2. When a meeting starts, if one or more rooms are free, it takes the free room with the **lowest number**.
3. If no room is free, the meeting is **delayed** until the earliest time a room frees up. It keeps its original duration (`end_i - start_i`). If several rooms free up at that same earliest time, it takes the lowest-numbered one.
4. When several meetings are waiting, the one with the earlier **original** start time is placed first.

Return a pair:
- `assignments`: a list where `assignments[i]` is the room meeting `i` was held in (indexed by the original input order), and
- `most_booked`: the room that held the most meetings. If several rooms tie, return the lowest-numbered one.

## Function signature
```python
from typing import List, Tuple

def assign_rooms(n: int, meetings: List[List[int]]) -> Tuple[List[int], int]:
    ...
```

## Constraints
- `1 <= n <= 100`
- `1 <= len(meetings) <= 10^5`
- `0 <= start_i < end_i <= 5 * 10^5`; all `start_i` are distinct
- Delayed end times may exceed `5 * 10^5` (use 64-bit integers in other languages)

## Examples
**Example 1**
Input: `n = 2, meetings = [[0,10],[1,5],[2,7],[3,4]]`
Output: `([0, 1, 1, 0], 0)`
Explanation: `[0,10)` takes room 0, `[1,5)` takes room 1. `[2,7)` has no free room; room 1 frees first at 5, so it runs `[5,10)` in room 1. `[3,4)` waits; both rooms free at 10, so it runs `[10,11)` in the lowest-numbered room 0. Rooms 0 and 1 each held 2 meetings, so the answer is room 0.

**Example 2**
Input: `n = 3, meetings = [[1,20],[2,10],[3,5],[4,9],[6,8]]`
Output: `([0, 1, 2, 2, 1], 1)`
Explanation: `[4,9)` is delayed to `[5,10)` in room 2; `[6,8)` is delayed to `[10,12)` in room 1 (rooms 1 and 2 both free at 10, the lower number wins). Rooms 1 and 2 both held 2 meetings; the tie goes to room 1.

**Example 3** (an edge case)
Input: `n = 1, meetings = [[3,4],[0,2],[1,3]]`
Output: `([0, 0, 0], 0)`
Explanation: Input is not sorted. `[0,2)` runs first; `[1,3)` is delayed to `[2,4)`; `[3,4)` is delayed to `[4,5)`. Assignments are reported in input order.

<details><summary>Approach (spoiler)</summary>

Sort meeting indices by start time and keep two min-heaps: free room numbers, and busy rooms as `(free_at, room)`. For each meeting, first move every busy room with `free_at <= start` into the free heap. If a room is free, pop the smallest number and mark it busy until `end`. Otherwise pop the busy room with the smallest `(free_at, room)` and push it back with `free_at + duration` — this implements both the delay and the lowest-number tie-break. Since meetings are processed by original start, waiting meetings are naturally served in that order. Track a count per room and pick the max with the lowest index.
**Time:** O(m log m + m log n) · **Space:** O(n + m)

```python
import heapq
from typing import List, Tuple

def assign_rooms(n: int, meetings: List[List[int]]) -> Tuple[List[int], int]:
    order = sorted(range(len(meetings)), key=lambda i: meetings[i][0])
    free = list(range(n))
    heapq.heapify(free)
    busy = []  # (free_at, room)
    count = [0] * n
    assigned = [-1] * len(meetings)

    for i in order:
        start, end = meetings[i]
        while busy and busy[0][0] <= start:
            heapq.heappush(free, heapq.heappop(busy)[1])
        if free:
            room = heapq.heappop(free)
            heapq.heappush(busy, (end, room))
        else:
            free_at, room = heapq.heappop(busy)
            heapq.heappush(busy, (free_at + (end - start), room))
        assigned[i] = room
        count[room] += 1

    most_booked = max(range(n), key=lambda r: (count[r], -r))
    return assigned, most_booked
```
</details>
