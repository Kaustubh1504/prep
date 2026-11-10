# Minimum Number of Rooms to Schedule Overlapping Meetings
> Google · Onsite · medium · Pattern: Intervals / Sweep Line
> Source: https://prachub.com/interview-questions/minimum-number-of-rooms-to-schedule-overlapping-meetings

You are given a list of meetings, where `meetings[i] = [start, end]` means meeting `i` occupies the half-open time interval `[start, end)`. Every meeting must be held in one room for its whole interval, and two meetings can share a room only if their intervals do not overlap.

Return the minimum number of rooms needed to hold all the meetings.

### Function Signature

```python
def min_meeting_rooms(meetings: list[list[int]]) -> int:
```

### Rules

- Intervals are half-open: a meeting that ends at time `t` and a meeting that starts at time `t` do not overlap and may use the same room.
- Meetings are given in no particular order. Identical intervals are separate meetings, and each needs its own room.
- An empty list needs `0` rooms.

### Constraints

- `0 <= len(meetings) <= 10^5`
- Each `meetings[i]` contains exactly two integers with `0 <= start < end <= 10^9`.
- The result is an integer from `0` to `len(meetings)` inclusive.

### Examples

**Example 1**

- Input: `meetings = [[1, 10], [2, 6], [7, 12]]`
- Output: `2`
- Explanation: `[1, 10)` overlaps both other meetings, so it needs a room of its own. `[2, 6)` ends before `[7, 12)` starts, so those two can share a second room.

**Example 2**

- Input: `meetings = [[4, 8], [8, 12], [1, 4]]`
- Output: `1`
- Explanation: In time order the meetings are `[1, 4)`, `[4, 8)` and `[8, 12)`, each starting exactly when the previous one ends, so one room is enough.

**Example 3**

- Input: `meetings = [[1, 5], [2, 6], [3, 7], [5, 9]]`
- Output: `3`
- Explanation: During `[3, 5)` the first three meetings are all in progress, so at least three rooms are needed. Three are enough, because `[5, 9)` can use the room that `[1, 5)` frees at time `5`.

<details><summary>Hints (spoiler)</summary>

1. The number of rooms you need equals the largest number of meetings that are in progress at the same moment. Why can you never do better, and why is that many always enough?
2. You do not need to remember which meeting holds which room. Consider the start times and end times as two separate sorted lists.
3. Be careful at shared boundaries: when one meeting ends at time t and another starts at t, the ending must be processed first so the room is freed.
</details>

<details><summary>Approach (spoiler)</summary>

The minimum number of rooms equals the maximum number of meetings in progress at any single moment: that many meetings pairwise overlap at that moment, so no fewer rooms can work, and greedily assigning each meeting (in start order) to any room whose last meeting has already ended never needs more rooms than that peak. The reference sorts all start times and all end times independently. It walks the starts in increasing order while a second pointer walks the ends. Before counting a meeting that starts at time s, it releases every meeting whose end time is <= s; using <= rather than < is exactly the half-open rule, so a meeting ending at s frees its room for one starting at s. The pointer into ends never overruns, because every end is strictly greater than its own start, so at most (number of starts processed so far) ends can be <= s. After each start, in_use is the number of meetings active at time s, and the answer is the largest value it reaches. Pairing starts with ends is not needed: only the count of meetings that have started and not yet ended matters. Identical intervals contribute separate starts and ends, so each needs its own room, and an empty list never enters the loop and returns 0. Every value is at most 10^9, so 32-bit integers suffice in all languages.

**Time:** O(n log n) · **Space:** O(n)
</details>
