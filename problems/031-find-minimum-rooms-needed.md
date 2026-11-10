# Find Minimum Rooms Needed
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Intervals / Sweep Line

## Problem
You are given a list of meetings, each as `[start, end]` with `start < end`. A meeting occupies a room during the half-open interval `[start, end)`, so a meeting that ends at time `t` frees its room for a meeting starting at exactly `t`.

Return the minimum number of meeting rooms needed so that all meetings can be held without any two overlapping meetings sharing a room. Return `0` for an empty list.

## Function signature
```python
from typing import List

def min_meeting_rooms(intervals: List[List[int]]) -> int:
    ...
```

## Constraints
- `0 <= len(intervals) <= 10^5`
- `0 <= start < end <= 10^9`
- Intervals are not necessarily sorted

## Examples
**Example 1**
Input: `intervals = [[0,30],[5,10],[15,20]]`
Output: `2`
Explanation: `[0,30]` overlaps both other meetings, but `[5,10]` and `[15,20]` can share a room.

**Example 2** (back-to-back meetings)
Input: `intervals = [[1,5],[5,8],[8,9]]`
Output: `1`
Explanation: Each meeting ends exactly when the next begins, so one room suffices.

**Example 3**
Input: `intervals = [[1,4],[2,5],[3,6],[7,8]]`
Output: `3`

**Example 4** (empty)
Input: `intervals = []`
Output: `0`

<details><summary>Approach (spoiler)</summary>

Sort start times and end times separately and sweep through the starts. Before placing a meeting starting at `s`, release every room whose end time is `<= s` (advance the end pointer). Then take a room and track the maximum number in use at once. This equals the peak number of overlapping meetings, which is both a lower bound and achievable. A min-heap of end times works equally well.
**Time:** O(n log n) · **Space:** O(n)

```python
from typing import List

def min_meeting_rooms(intervals: List[List[int]]) -> int:
    starts = sorted(s for s, _ in intervals)
    ends = sorted(e for _, e in intervals)
    rooms = best = 0
    j = 0
    for s in starts:
        while j < len(ends) and ends[j] <= s:
            j += 1; rooms -= 1
        rooms += 1
        best = max(best, rooms)
    return best
```
</details>
