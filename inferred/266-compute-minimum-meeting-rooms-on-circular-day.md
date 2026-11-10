# Compute minimum meeting rooms on circular day
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · easy · Pattern: Intervals / Sweep Line

## Problem
The same set of meetings repeats every day. Time is measured in minutes on a circular clock `[0, day)`, where `day = 1440` by default. Each meeting is `[start, end]` with `0 <= start, end < day` and `start != end`, and it occupies the half-open time span from `start` to `end`:
- If `start < end`, the meeting covers `[start, end)`.
- If `start > end`, the meeting **wraps past midnight** and covers `[start, day)` together with `[0, end)`.

A meeting ending at minute `t` does not overlap one starting at `t`. Return the minimum number of rooms needed so that no two overlapping meetings share a room, which is the maximum number of meetings in progress at any moment. Because the schedule repeats every day, a meeting that wraps past midnight overlaps early-morning meetings. If there are no meetings, return `0`.

## Function signature
```python
def min_rooms_circular(meetings: list[list[int]], day: int = 1440) -> int:
```

## Constraints
- `0 <= len(meetings) <= 10^5`
- `2 <= day <= 10^9`, `0 <= start, end < day`, `start != end`

## Examples
**Example 1**
Input: `meetings = [[1380,120],[60,180],[0,30]]`
Output: `2`
Explanation: The 23:00–02:00 meeting wraps. It overlaps [0,30) at 00:00–00:30 and [60,180) at 01:00–02:00, but those two don't overlap each other, so 2 rooms are enough.

**Example 2**
Input: `meetings = [[1300,100],[90,1310]]`
Output: `2`
Explanation: Both meetings are long, and they overlap during [90,100) and during [1300,1310).

**Example 3** (an edge case: touching across midnight)
Input: `meetings = [[1400,0],[0,60]]`
Output: `1`
Explanation: The first meeting ends exactly at midnight, when the second one starts.

**Example 4** (an edge case: a custom day length)
Input: `meetings = [[22,2],[23,1],[1,3]], day = 24`
Output: `2`

**Example 5**
Input: `meetings = []`
Output: `0`

<details><summary>Approach (spoiler)</summary>

Split each wrapping meeting into two linear pieces, `[start, day)` and `[0, end)`, dropping the second piece when `end == 0`. Then this is the standard sweep. Emit `+1` at each start and `-1` at each end, and sort the events so that at equal times the `-1` comes before the `+1` (sorting `(time, delta)` tuples does this automatically). The running maximum is the answer. Splitting is safe because each split meeting contributes at most 1 at any instant.
**Time:** O(n log n) · **Space:** O(n)

```python
def min_rooms_circular(meetings: list[list[int]], day: int = 1440) -> int:
    events = []
    for s, e in meetings:
        if s < e:
            events += [(s, 1), (e, -1)]
        else:                              # wraps past midnight: [s, day) and [0, e)
            events += [(s, 1), (day, -1)]
            if e > 0:
                events += [(0, 1), (e, -1)]
    events.sort()                          # at equal times, -1 (end) sorts before +1 (start)
    cur = best = 0
    for _, d in events:
        cur += d
        best = max(best, cur)
    return best
```
</details>
