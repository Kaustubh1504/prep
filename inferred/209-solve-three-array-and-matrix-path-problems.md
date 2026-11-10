# Solve Three Array and Matrix Path Problems
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Medium · Pattern: Intervals / Sweep Line, Dynamic Programming; Design / Data Structure

## Problem
This is a set of three independent problems. Part 1 follows the community answers closely. Parts 2 and 3 are standard interpretations of "interval coverage" and "subarray optimization".

**Part 1: longest relaxed-descent path in a matrix.** You are given an `R x C` integer grid. A path is a sequence of cells `v1, v2, ..., vk` where each pair of consecutive cells is 4-directionally adjacent. **Cells may be revisited.** The first move, from `v1` to `v2`, is unrestricted. Every later cell must be strictly smaller than at least one of the two cells just before it: `v_i < v_{i-1}` **or** `v_i < v_{i-2}`, for `i >= 3`. Return the maximum number of cells in such a path, counting repeated visits. A `1 x 1` grid returns 1, and an empty grid returns 0. Revisits are allowed, but the rule means a path can never loop forever.

**Part 2: minimum intervals to cover a range.** You are given closed intervals `[a, b]` and a target range `[left, right]`. Return the minimum number of intervals whose union covers `[left, right]` completely, or `-1` if that's impossible. Intervals that touch at a point count as continuous coverage (`[0,2]` and `[2,5]` cover `[0,5]`). If `left == right`, the answer is `0`.

**Part 3: maximum subarray sum.** Given a non-empty integer array, return the largest sum of a non-empty contiguous subarray. If every element is negative, the answer is the largest single element.

## Function signature
```python
def longest_relaxed_descent(grid: list[list[int]]) -> int: ...                                # Part 1
def min_intervals_to_cover(intervals: list[list[int]], left: int, right: int) -> int: ...     # Part 2
def max_subarray(nums: list[int]) -> int: ...                                                  # Part 3
```

## Constraints
- Part 1: `0 <= R, C <= 50`, `-10^9 <= grid[r][c] <= 10^9`
- Part 2: `0 <= len(intervals) <= 10^5`, `-10^9 <= a <= b <= 10^9`, `left <= right`
- Part 3: `1 <= len(nums) <= 10^5`, `-10^4 <= nums[i] <= 10^4`

## Examples
**Example 1** (Part 1)
Input: `grid = [[3,1,2]]`
Output: `5`
Explanation: Take the path `1 -> 3 -> 1 -> 2 -> 1`, which visits cells `(0,1),(0,0),(0,1),(0,2),(0,1)`. The first move is free. Then `1 < 3`, then `2 < max(3,1)`, then `1 < 2`. Every possible sixth cell fails the rule.

Input: `grid = [[9,4],[1,8]]`
Output: `5`
Explanation: For example `4 -> 9 -> 4 -> 8 -> 4`.

**Example 2** (Part 1 edge cases)
Input: `grid = [[2,2],[2,2]]` gives `2`. The first move is free, but no third cell can be strictly smaller.
Input: `grid = [[5]]` gives `1`.

**Example 3** (Part 2)
Input: `intervals = [[0,2],[4,6],[8,10],[1,9],[1,5],[5,9]]`, `left = 0`, `right = 10`
Output: `3`
Explanation: `[0,2]`, `[1,9]` and `[8,10]` together cover `[0,10]`.

Input: `intervals = [[0,1],[1,2]]`, `left = 0`, `right = 5` gives `-1`.
Input: `intervals = []`, `left = 3`, `right = 3` gives `0`.

**Example 4** (Part 3)
Input: `nums = [-2,1,-3,4,-1,2,1,-5,4]` gives `6`, from the subarray `[4,-1,2,1]`.
Input: `nums = [-3,-1,-2]` gives `-1`.

<details><summary>Approach (spoiler)</summary>

**Part 1:** whether the next move is valid depends on the current cell and the previous cell, so the state is `(cell, previous cell)`, with at most 4 previous cells per cell. From the state `(cur, prev)`, you can step to a neighbour `nxt` when `nxt < max(cur, prev)`. Along any path, the larger of each consecutive pair of values strictly decreases at least every two steps, so the state graph is a DAG. That makes memoized DFS valid: `extra(cur, prev) = max(1 + extra(nxt, cur))` over valid `nxt`. The answer is the maximum of `2 + extra(v2, v1)` over every first move, or 1 when there is no move.

**Part 2:** greedy (jump-game style). Sort by start. Repeatedly take, among the intervals that start at or before the current covered point, the one that reaches furthest. If none extends the coverage, return `-1`.

**Part 3:** Kadane's algorithm. `cur = max(x, cur + x)`, and `best` tracks the largest `cur` seen.

**Time:** P1 O(RC), P2 O(n log n), P3 O(n) · **Space:** P1 O(RC), P2 O(1) beyond the sort, P3 O(1)

```python
import sys
from functools import lru_cache

DIRS = ((-1, 0), (0, 1), (1, 0), (0, -1))

def longest_relaxed_descent(grid):
    if not grid or not grid[0]:
        return 0
    R, C = len(grid), len(grid[0])
    sys.setrecursionlimit(max(10000, 4 * R * C + 100))

    @lru_cache(maxsize=None)
    def extra(r, c, pr, pc):            # cells that can still follow after arriving at (r,c) from (pr,pc)
        lim = max(grid[r][c], grid[pr][pc])
        best = 0
        for dr, dc in DIRS:
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] < lim:
                best = max(best, 1 + extra(nr, nc, r, c))
        return best

    ans = 1
    for r in range(R):
        for c in range(C):
            for dr, dc in DIRS:
                nr, nc = r + dr, c + dc
                if 0 <= nr < R and 0 <= nc < C:
                    ans = max(ans, 2 + extra(nr, nc, r, c))
    return ans

def min_intervals_to_cover(intervals, left, right):
    ivs = sorted(intervals)
    count, covered, i, n = 0, left, 0, len(ivs)
    while covered < right:
        best = covered
        while i < n and ivs[i][0] <= covered:
            best = max(best, ivs[i][1])
            i += 1
        if best == covered:
            return -1
        covered, count = best, count + 1
    return count

def max_subarray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best
```
</details>
