# Assign meetings to rooms with delays
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Intervals / Sweep Line, Heap / Top-K

## Problem
There are `n` rooms, numbered `0` to `n - 1`. You get a list `meetings`, where `meetings[i] = [start_i, end_i]` is a meeting on the half-open interval `[start_i, end_i)`. All start times are distinct. Meetings are allocated as follows:

1. Process meetings in order of increasing original start time.
2. When a meeting starts, give it the **lowest-numbered free room**. A room that becomes free at time `t` can host a meeting that starts at `t`.
3. If no room is free, **delay** the meeting until a room frees up. It keeps its original duration (`end_i - start_i`) and runs in the room that frees earliest. If several rooms free at the same time, it takes the lowest-numbered one. Among delayed meetings, the one with the earlier original start time goes first.

Return the room number that hosted the **most meetings**. If there is a tie, return the lowest room number.

## Function signature
```python
def most_booked(n: int, meetings: list[list[int]]) -> int:
```

## Constraints
- `1 <= n <= 100`
- `1 <= len(meetings) <= 10^5`
- `0 <= start_i < end_i <= 5 * 10^5`, and all `start_i` are distinct
- Delayed end times can exceed `5 * 10^5`, so use wide integers in other languages

## Examples
**Example 1**
Input: `n = 2, meetings = [[0,10],[1,5],[2,7],[3,4]]`
Output: `0`
Explanation: [0,10) takes room 0 and [1,5) takes room 1. [2,7) is delayed until room 1 frees at 5 and runs during [5,10). [3,4) is delayed until 10. At that point rooms 0 and 1 both become free, so it takes room 0 and runs during [10,11). Each room hosted 2 meetings, and the tie goes to room 0.

**Example 2**
Input: `n = 3, meetings = [[1,20],[2,10],[3,5],[4,9],[6,8]]`
Output: `1`
Explanation: Rooms 1 and 2 each host 2 meetings and room 0 hosts 1. The lower-numbered room is 1.

**Example 3** (an edge case)
Input: `n = 3, meetings = [[0,5],[5,10],[10,15]]`
Output: `0`
Explanation: Room 0 frees exactly when the next meeting starts, so it is reused every time.

**Example 4** (an edge case)
Input: `n = 4, meetings = [[0,1]]`
Output: `0`
Explanation: Rooms that host no meetings tie at 0, which loses to room 0's count of 1.

<details><summary>Approach (spoiler)</summary>

Sort the meetings by start time and keep two min-heaps. `free` holds the IDs of free rooms. `busy` holds `(end_time, room_id)` pairs. Before placing each meeting, move every room with `end_time <= start` from `busy` to `free`. If a room is free, pop the smallest ID. Otherwise pop the top of `busy`: it is the earliest-ending room, and ties break on the lowest ID because of tuple ordering. The meeting then runs from that end time for its original duration. Processing in sorted order means the earliest-start delayed meeting is always served first.
**Time:** O(m log m + m log n) · **Space:** O(n + log m), excluding the sort

```python
import heapq
def most_booked(n, meetings):
    free = list(range(n))            # min-heap of free room ids
    busy = []                        # min-heap of (end_time, room)
    count = [0] * n
    for start, end in sorted(meetings):
        while busy and busy[0][0] <= start:
            _, room = heapq.heappop(busy)
            heapq.heappush(free, room)
        if free:
            room = heapq.heappop(free)
            heapq.heappush(busy, (end, room))
        else:
            t, room = heapq.heappop(busy)          # earliest-free room (ties -> lowest id)
            heapq.heappush(busy, (t + end - start, room))
        count[room] += 1
    return max(range(n), key=lambda r: (count[r], -r))
```
</details>
