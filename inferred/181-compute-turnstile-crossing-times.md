# Compute Turnstile Crossing Times
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Hard · Pattern: Simulation, Intervals / Sweep Line; Stack / Parsing

## Problem
`n` people, numbered `0` to `n-1`, arrive at a single turnstile. Person `i` arrives at second `time[i]` and wants to go in direction `direction[i]`: `0` means enter, `1` means exit. `time` is sorted in non-decreasing order. Each second, at most one person can use the turnstile, and passing through takes exactly one second. A person who arrives at second `t` can pass at `t` at the earliest. Otherwise they wait in line.

When people are waiting at second `t`, decide who goes as follows:
1. If the turnstile was **not used** in second `t-1`, someone who wants to **exit** goes first.
2. If it was used in second `t-1` by someone **exiting**, someone exiting goes first.
3. If it was used in second `t-1` by someone **entering**, someone entering goes first.
4. If nobody is waiting in the preferred direction, the other direction goes.
5. Within one direction, the person with the smaller index (who arrived earlier) goes first.

Return `answer`, where `answer[i]` is the second at which person `i` passes through the turnstile. (This matches LeetCode 2534, "Time Taken to Cross the Door".) The solution should run in linear time, and it should jump over idle gaps instead of stepping through every second.

## Function signature
```python
def turnstile_times(time: list[int], direction: list[int]) -> list[int]:
```

## Constraints
- `1 <= n <= 10^5`
- `0 <= time[i] <= 10^9`, non-decreasing
- `direction[i]` is `0` or `1`

## Examples
**Example 1**
Input: `time = [0,0,1,5]`, `direction = [0,1,1,0]`
Output: `[2,0,1,5]`
Explanation: At second 0 the turnstile was idle before, so exiter 1 goes. At second 1 the previous use was an exit, so exiter 2 goes. At second 2 person 0 enters. The turnstile is then idle until person 3 arrives and enters at second 5.

**Example 2**
Input: `time = [0,1,1,2,4]`, `direction = [0,1,0,0,1]`
Output: `[0,3,1,2,4]`
Explanation: Person 0 enters at 0. At second 1 the last use was an entry, so enterer 2 goes ahead of exiter 1. Enterer 3 goes at 2 for the same reason, and exiter 1 finally goes at 3.

**Example 3** (all same direction; idle gap resets priority)
Input: `time = [0,0,0]`, `direction = [0,0,0]`
Output: `[0,1,2]`

Input: `time = [3,3,4,4]`, `direction = [0,1,0,1]`
Output: `[5,3,6,4]`
Explanation: Before second 3 the turnstile was idle, so exiter 1 goes at 3. Exiter 3 keeps exit priority at 4. Then the enterers go at 5 and 6.

<details><summary>Approach (spoiler)</summary>

Keep two FIFO queues, one for enterers and one for exiters, plus the current second `t`, the direction used last, and the second at which it was last used. In each iteration, if both queues are empty, jump `t` straight to the next arrival. Then add everyone with `time[i] <= t` to their queue. The preferred direction is exit if the turnstile wasn't used at `t-1`, and the last-used direction otherwise. Serve the front of the preferred queue, or the other queue if the preferred one is empty, record `t`, and advance. Every person is added and removed once, so the whole simulation is linear.

**Time:** O(n) · **Space:** O(n)

```python
from collections import deque

def turnstile_times(time, direction):
    n = len(time)
    ans = [0] * n
    queues = (deque(), deque())          # 0 = enter, 1 = exit
    t = i = 0
    last_dir, last_used = 1, -2
    while i < n or queues[0] or queues[1]:
        if not queues[0] and not queues[1] and time[i] > t:
            t = time[i]                  # skip idle gap
        while i < n and time[i] <= t:
            queues[direction[i]].append(i)
            i += 1
        pref = last_dir if last_used == t - 1 else 1
        d = pref if queues[pref] else 1 - pref
        ans[queues[d].popleft()] = t
        last_dir, last_used = d, t
        t += 1
    return ans
```
</details>
