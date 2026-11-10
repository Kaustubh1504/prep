# Intervals with Exactly X Concurrent Meetings
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Medium · Pattern: Intervals / Sweep Line

## Problem
You are given `n` meetings as two parallel arrays `starts` and `ends`; meeting `i` is active on the half-open interval `[starts[i], ends[i])`, with `starts[i] < ends[i]`. You are also given an integer `x >= 0`.

Consider only the finite observation domain `[min(starts), max(ends))`. Return every **maximal** half-open interval `[a, b)` inside this domain during which exactly `x` meetings are active.

Rules:
- Output intervals are sorted by start, pairwise disjoint, non-empty (`a < b`), and maximal: two output intervals never touch (if the count is `x` on both sides of a time point where meetings end and others start, the pieces are merged into one).
- `x = 0` reports the idle gaps strictly inside the domain; time before the first start or after the last end is never reported.
- If there are no meetings, or `x` is never the active count, return `[]`.

## Function signature
```python
from typing import List

def intervals_with_concurrency(starts: List[int], ends: List[int], x: int) -> List[List[int]]:
    ...
```

## Constraints
- `0 <= n <= 10^5`, `len(starts) == len(ends)`
- `-10^9 <= starts[i] < ends[i] <= 10^9`
- `0 <= x <= n`

## Examples
**Example 1**
Input: `starts = [1,2,6]`, `ends = [4,5,8]`, `x = 1`
Output: `[[1,2],[4,5],[6,8]]`
Explanation: Counts are 1 on `[1,2)`, 2 on `[2,4)`, 1 on `[4,5)`, 0 on `[5,6)`, 1 on `[6,8)`. With `x = 2` the answer is `[[2,4]]`.

**Example 2** (x = 0 finds gaps inside the domain only)
Input: `starts = [1,2,6]`, `ends = [4,5,8]`, `x = 0`
Output: `[[5,6]]`

**Example 3** (merging across a hand-off)
Input: `starts = [1,3]`, `ends = [3,5]`, `x = 1`
Output: `[[1,5]]`
Explanation: At time 3 one meeting ends and another starts, so the count stays 1 and the result is one maximal interval.

**Example 4** (duplicates / empty)
Input: `starts = [1,1]`, `ends = [3,3]`, `x = 2` → `[[1,3]]`; with `x = 1` → `[]`; `starts = ends = []` → `[]`

<details><summary>Approach (spoiler)</summary>

Sweep line: add `+1` at each start and `-1` at each end, aggregating deltas per distinct time. Walk the sorted distinct times; after applying the delta at time `t_i`, the count is constant on `[t_i, t_{i+1})`. Emit that segment when the count equals `x`, extending the previous output interval if it ends exactly at `t_i`. Because the walk only spans from the first to the last event time, the observation domain restriction comes for free. Correctness follows because the count can only change at event times.
**Time:** O(n log n) · **Space:** O(n)

```python
from collections import defaultdict
from typing import List

def intervals_with_concurrency(starts: List[int], ends: List[int], x: int) -> List[List[int]]:
    if not starts:
        return []
    delta = defaultdict(int)
    for s, e in zip(starts, ends):
        delta[s] += 1
        delta[e] -= 1
    times = sorted(delta)
    out: List[List[int]] = []
    active = 0
    for prev, cur in zip(times, times[1:]):
        active += delta[prev]           # count on [prev, cur)
        if active == x:
            if out and out[-1][1] == prev:
                out[-1][1] = cur        # extend: same count continues
            else:
                out.append([prev, cur])
    return out
```
</details>
