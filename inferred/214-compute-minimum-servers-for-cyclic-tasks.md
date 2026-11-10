# Compute minimum servers for cyclic tasks
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Intervals / Sweep Line

## Problem
A day has 1440 minutes, numbered `0` to `1439`. Each task is a pair `(start, duration)` and **repeats every day**: it occupies the half-open interval `[start, start + duration)`, taken modulo 1440. A task whose end goes past midnight **wraps around**. For example, `(1380, 60)` occupies `[1380, 1440)` and also `[0, 20)`.

A server can run only one task at a time. Intervals are half-open, so a task that ends at minute `t` and another that starts at minute `t` can share a server. Return the minimum number of servers needed to run every task, which is the maximum number of tasks running at the same moment anywhere in the cyclic day. If there are no tasks, return `0`.

## Function signature
```python
def min_servers(tasks: list[tuple[int, int]]) -> int:
```

## Constraints
- `0 <= len(tasks) <= 10^5`
- `0 <= start < 1440`
- `1 <= duration <= 1440` (a task never overlaps its own next-day occurrence)
- Target: O(n log n)

## Examples
**Example 1**
Input: `tasks = [(1380, 60), (0, 30), (1380, 30)]`
Output: `2`
Explanation: The first task wraps to `[1380,1440) ∪ [0,20)`. It overlaps the third task during `[1380,1410)` and the second task during `[0,20)`, but all three never run at once.

**Example 2** (touching endpoints share a server)
Input: `tasks = [(0, 60), (60, 60), (120, 60)]`
Output: `1`

**Example 3** (a wrap-around overlap and a full-day task, plus empty input)
Input: `tasks = [(1430, 20), (5, 10), (0, 1440)]`
Output: `3`
Explanation: During `[5,10)` the wrapped tail of the first task `[0,10)`, the second task and the full-day task all run.

Input: `tasks = []`
Output: `0`

<details><summary>Approach (spoiler)</summary>

Split each wrapping task into two linear pieces, `[s, 1440)` and `[0, e - 1440)`, so the cyclic day becomes the ordinary line `[0, 1440)`. Then run a sweep line: create a `+1` event at each start and a `-1` event at each end, sort them, and track the running count and its maximum. Sorting `(time, delta)` tuples puts `-1` before `+1` at equal times, which handles the half-open touching case. Splitting is safe because the two pieces of one task never overlap each other, since `duration <= 1440`.

**Time:** O(n log n) · **Space:** O(n)

```python
DAY = 1440

def min_servers(tasks):
    events = []
    for start, dur in tasks:
        s = start % DAY
        e = s + dur
        if e <= DAY:
            events += [(s, 1), (e, -1)]
        else:                                   # wraps past midnight
            events += [(s, 1), (DAY, -1), (0, 1), (e - DAY, -1)]
    events.sort()                               # ends (-1) before starts (+1) at equal times
    cur = best = 0
    for _, d in events:
        cur += d
        best = max(best, cur)
    return best
```
</details>
