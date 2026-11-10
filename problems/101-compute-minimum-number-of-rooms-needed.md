# Compute minimum number of rooms needed
> Google · Technical Screen · medium · Pattern: Intervals / Sweep Line
> Source: https://prachub.com/interview-questions/compute-minimum-number-of-rooms-needed

## Problem
You are given a list of meetings, each with a start time and end time. A single room can host only one meeting at a time.

Two meetings **overlap** if one starts before the other ends (treat meetings as half-open intervals **[start, end)** so a meeting ending at time `t` does not conflict with another starting at time `t`).

### Task
Return the **minimum number of rooms** required to host all meetings.

### Input
- `intervals`: an array of `n` pairs `[start, end]` where `0 <= start <= end`.

### Output
- An integer: the minimum number of rooms needed.

### Constraints (typical interview bounds)
- `1 <= n <= 200000`
- Times are integers in a reasonable range (e.g., `0 . 10^9`).

### Example
- Input: `[[0,30],[5,10],[15,20]]`
- Output: `2`

(One room can host `[0,30]`, the other can host `[5,10]` then `[15,20]`.)

<details><summary>Hints (spoiler)</summary>

1. Try turning each meeting into two events: one when it starts and one when it ends.
2. Because intervals are half-open, if a meeting ends at the same time another starts, process the ending event first.
</details>
