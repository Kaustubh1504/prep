# Simulate meeting-room bookings and return busiest room
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Intervals / Sweep Line

## Problem
There are `n` rooms numbered `0 .. n-1`. You are given `meetings`, where `meetings[i] = [start_i, end_i]` is a meeting on the half-open interval `[start_i, end_i)`. All start times are **unique**.

Meetings are allocated in increasing order of their original start time:
1. A room freed at time `t` can host a meeting starting at `t`.
2. If any rooms are free when a meeting starts, it uses the free room with the **lowest number**.
3. If no room is free, the meeting is **delayed** until the earliest time some room frees up, and keeps its original duration. If several rooms free up at that same time, it takes the lowest-numbered one.
4. Delayed meetings are served in order of their original start time.

Return the number of the room that hosted the **most meetings**. If several rooms tie, return the **lowest** room number.

## Function signature
```python
from typing import List

def most_booked(n: int, meetings: List[List[int]]) -> int:
    ...
```

## Constraints
- `1 <= n <= 100`
- `1 <= len(meetings) <= 10^5`
- `0 <= start_i < end_i <= 5 * 10^5`; start times are unique
- Delayed end times can exceed the input range (use 64-bit integers in other languages)

## Examples
**Example 1**
Input: `n = 2, meetings = [[0,10],[1,5],[2,7],[3,4]]`
Output: `0`
Explanation: Room 0 gets `[0,10)`, room 1 gets `[1,5)`. `[2,7)` is delayed to `[5,10)` in room 1. `[3,4)` waits until both rooms free at 10 and takes room 0 as `[10,11)`. Both rooms hosted 2 meetings; the lower number wins.

**Example 2**
Input: `n = 3, meetings = [[1,20],[2,10],[3,5],[4,9],[6,8]]`
Output: `1`
Explanation: `[4,9)` is delayed to `[5,10)` in room 2, and `[6,8)` is delayed to `[10,12)` in room 1 (rooms 1 and 2 both free at 10). Rooms 1 and 2 each hosted 2 meetings, so the answer is 1.

**Example 3** (edge cases)
Input: `n = 2, meetings = [[0,5],[5,10],[10,15]]`
Output: `0`
Explanation: Back-to-back meetings reuse room 0, because a room freed at `t` is available at `t`. With `n = 4, meetings = [[0,1]]`, the answer is also `0` — unused rooms tie at 0 meetings and lose to room 0.

<details><summary>Approach (spoiler)</summary>

Sort meetings by start and simulate with two min-heaps: free room numbers, and busy rooms keyed by `(free_at, room)`. At each meeting's start, release every busy room with `free_at <= start`. If a free room exists, take the smallest; otherwise pop the busy room with the smallest `(free_at, room)` — the earliest to free up, lowest number on ties — and reschedule it to `free_at + duration`. Count bookings per room and return the max count with the lowest index. Processing in original start order automatically serves delayed meetings first-come-first-served.
**Time:** O(m log m + m log n) · **Space:** O(n + m)

```python
import heapq
from typing import List

def most_booked(n: int, meetings: List[List[int]]) -> int:
    free = list(range(n))            # available room numbers
    heapq.heapify(free)
    busy = []                        # (free_at, room)
    count = [0] * n
    for start, end in sorted(meetings):
        while busy and busy[0][0] <= start:
            heapq.heappush(free, heapq.heappop(busy)[1])
        if free:
            room = heapq.heappop(free)
            heapq.heappush(busy, (end, room))
        else:
            free_at, room = heapq.heappop(busy)
            heapq.heappush(busy, (free_at + end - start, room))
        count[room] += 1
    return max(range(n), key=lambda r: (count[r], -r))
```
</details>
