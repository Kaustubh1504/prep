# Compute minimum rooms for time intervals
> Google · Technical Screen · easy · Pattern: Intervals / Sweep Line
> Source: https://prachub.com/interview-questions/compute-minimum-rooms-for-time-intervals

You are given a list of meeting time intervals, where each interval is represented as `[start, end)` (start time inclusive, end time exclusive) and `start < end`.

Two meetings overlap if one starts before the other ends.

**Task:** Return the minimum number of conference rooms required so that all meetings can be held without conflicts.

### Input
- `intervals`: an array of `n` intervals, each interval is a pair of integers `[start, end)`.

### Output
- An integer: the minimum number of rooms needed.

### Constraints (typical interview constraints)
- `1 <= n <= 10^5`
- `0 <= start < end <= 10^9`

### Example
- Input: `[[0,30],[5,10],[15,20]]`
- Output: `2` (because at time 5–10, two meetings overlap)

<details><summary>Hints (spoiler)</summary>

1. Try sorting all start times and all end times separately, then sweep through time.
2. If the next meeting starts at or after the earliest ending meeting, that room can be reused because intervals are [start, end).
</details>
