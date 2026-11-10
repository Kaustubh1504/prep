# Find Common Free Time Slots Across Calendars
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · easy · Pattern: Intervals / Sweep Line

## Problem
You get a working day `[day_start, day_end)` and the calendars of several people. `schedules[p]` lists person `p`'s busy intervals `[s, e)`. The intervals are **half-open**, so a meeting `[9, 10)` leaves the person free from 10 on. A person's intervals can be unsorted, can overlap each other, and can extend past the working day.

Return every **maximal** time window inside `[day_start, day_end)` when **everyone** is free and the window is at least `duration` long. Report each window as `[start, end)` and list them in increasing order.

- Clip busy intervals to the working day before using them, and ignore intervals that become empty (`s >= e`).
- Two busy intervals that only touch, such as `[2,4)` and `[4,6)`, leave **no** gap between them. Zero-length windows are never reported.
- If nobody has any meetings, the whole day is one free window, as long as it is long enough.

## Function signature
```python
def common_free_slots(day_start: int, day_end: int,
                      schedules: list[list[list[int]]], duration: int) -> list[list[int]]:
```

## Constraints
- `0 <= day_start < day_end <= 10^9`
- `0 <= len(schedules) <= 10^3`, with up to `10^5` intervals in total
- `1 <= duration <= 10^9`

## Examples
**Example 1**
Input: `day_start = 9, day_end = 17, schedules = [[[9,10],[12,13]], [[9,11],[14,15]], [[16,17]]], duration = 1`
Output: `[[11,12],[13,14],[15,16]]`
Explanation: The merged busy time is [9,11), [12,13), [14,15) and [16,17). The gaps between those blocks are the free windows.

**Example 2**
The same input with `duration = 2` returns `[]`, because every gap is only 1 long.

**Example 3** (an edge case: touching intervals)
Input: `day_start = 0, day_end = 10, schedules = [[[2,4]], [[4,6]]], duration = 1`
Output: `[[0,2],[6,10]]`

**Example 4** (an edge case: clipping)
Input: `day_start = 9, day_end = 17, schedules = [[[8,9],[17,20]], [[5,6]]], duration = 8`
Output: `[[9,17]]`
Explanation: After clipping to the day, every interval is empty, so the whole 8-hour day is free.

**Example 5** (edge cases)
`common_free_slots(9, 17, [[[8,18]]], 1)` returns `[]`, and `common_free_slots(9, 17, [], 1)` returns `[[9,17]]`.

<details><summary>Approach (spoiler)</summary>

The time everyone is free is the complement of the *union* of everyone's busy intervals, so gather all clipped intervals into one list and sort them by start. Sweep while keeping `cursor`, the end of the merged busy time seen so far, which starts at `day_start`. When the next interval starts strictly after `cursor`, the window `[cursor, s)` is free, so record it if it is long enough. Then set `cursor = max(cursor, e)`. After the sweep, check the trailing window `[cursor, day_end)`. Because the test is strict (`s > cursor`), touching intervals never create a zero-length gap. If the per-person lists are already sorted, a k-way merge with a heap gives O(N log k).
**Time:** O(N log N) · **Space:** O(N)

```python
def common_free_slots(day_start: int, day_end: int,
                      schedules: list[list[list[int]]], duration: int) -> list[list[int]]:
    busy = []
    for person in schedules:
        for s, e in person:
            s, e = max(s, day_start), min(e, day_end)     # clip to the working day
            if s < e:
                busy.append((s, e))
    busy.sort()
    free, cursor = [], day_start                           # cursor = end of merged busy time so far
    for s, e in busy:
        if s > cursor and s - cursor >= duration:
            free.append([cursor, s])
        cursor = max(cursor, e)
    if day_end > cursor and day_end - cursor >= duration:
        free.append([cursor, day_end])
    return free
```
</details>
