# Maximize 1D deliveries within distance and minimize total distance
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Sorting, Dynamic Programming; Graph BFS / DFS

## Problem
Couriers and packages sit at integer positions on a number line: `couriers[i]` and `packages[j]`. A courier can deliver a package only if their distance `|couriers[i] - packages[j]|` is at most `d`. Each courier delivers at most one package and each package is delivered by at most one courier.

Choose a set of courier–package pairs that optimises, in strict priority order:
1. **maximise** the number of deliveries, then
2. among all assignments with that maximum, **minimise** the total distance travelled (sum of `|courier - package|` over chosen pairs).

Return `[max_deliveries, min_total_distance]`. Positions may repeat (several couriers or packages at the same spot), and either list may be empty, in which case the answer is `[0, 0]`.

## Function signature
```python
from typing import List

def max_deliveries(couriers: List[int], packages: List[int], d: int) -> List[int]:
    ...
```

## Constraints
- `0 <= len(couriers), len(packages) <= 2000`
- `-10^9 <= positions <= 10^9`, `0 <= d <= 2·10^9`

## Examples
**Example 1**
Input: `couriers = [1,5,9]`, `packages = [2,6,20]`, `d = 3`
Output: `[2, 2]`
Explanation: `1→2` and `5→6`; package 20 is out of everyone's range.

**Example 2** (count first, then distance)
Input: `couriers = [1,2,3]`, `packages = [2,4]`, `d = 1`
Output: `[2, 1]`
Explanation: Two deliveries is the maximum. `2→2` (0) plus `3→4` (1) beats `1→2` plus `3→4` (total 2).

**Example 3**
Input: `couriers = [0,4]`, `packages = [2,3]`, `d = 2`
Output: `[2, 3]`
Explanation: `0→2` (2) and `4→3` (1). The only alternative, `0→3`, is out of range.

**Example 4** (duplicates, d = 0, empty)
Input: `couriers = [5,5]`, `packages = [5,5,5]`, `d = 0` → `[2, 0]`
Input: `couriers = []`, `packages = [1,2]`, `d = 5` → `[0, 0]`

<details><summary>Approach (spoiler)</summary>

Sort both lists. On a line, any two crossing pairs can be uncrossed without increasing either the larger of the two distances or their sum, so some optimal assignment is non-crossing (order-preserving). That enables an LCS-style DP: `dp[i][j]` = best `(count, -distance)` using the first `i` couriers and first `j` packages, taking the max of skipping a courier, skipping a package, or matching courier `i` with package `j` when they are within `d`. Comparing tuples encodes the lexicographic objective. A greedy two-pointer maximises the count alone but can miss the minimum distance; the general alternative is min-cost max-flow.
**Time:** O(n log n + m log m + n·m) · **Space:** O(m) with rolling rows

```python
from typing import List

def max_deliveries(couriers: List[int], packages: List[int], d: int) -> List[int]:
    a, b = sorted(couriers), sorted(packages)
    n, m = len(a), len(b)
    # dp[i][j] = best (count, -distance) using the first i couriers and first j packages
    NEG = (0, 0)
    prev = [NEG] * (m + 1)
    for i in range(1, n + 1):
        cur = [NEG] * (m + 1)
        for j in range(1, m + 1):
            best = max(prev[j], cur[j - 1])
            gap = abs(a[i - 1] - b[j - 1])
            if gap <= d:
                c, negdist = prev[j - 1]
                best = max(best, (c + 1, negdist - gap))
            cur[j] = best
        prev = cur
    count, negdist = prev[m]
    return [count, -negdist]
```
</details>
