# Solve array-sum and city-community problems
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Graph BFS / DFS

## Problem
Two independent parts.

### Part 1 — Count subarrays with a target sum
Given an integer array `nums` (values may be negative or zero) and an integer `k`, return the number of contiguous, non-empty subarrays whose sum equals `k`. Subarrays at different positions are counted separately even if their values are equal.

Follow-up (streaming): numbers arrive one at a time. Implement `SubarraySumCounter(k)` whose `add(x)` appends `x` and returns the total number of qualifying subarrays seen so far, in O(1) average time per call.

### Part 2 — Count building communities
A city is an `m x n` grid where `1` is a building and `0` is empty land. Buildings that are 4-directionally adjacent (up, down, left, right; not diagonal) belong to the same community, transitively. Return the number of communities.

## Function signature
```python
from typing import List

def count_subarrays_with_sum(nums: List[int], k: int) -> int: ...

class SubarraySumCounter:
    def __init__(self, k: int): ...
    def add(self, x: int) -> int: ...

def count_communities(grid: List[List[int]]) -> int: ...
```

## Constraints
- Part 1: `0 <= len(nums) <= 2·10^4`, `-1000 <= nums[i] <= 1000`, `-10^7 <= k <= 10^7`
- Part 2: `0 <= m, n <= 300`

## Examples
**Example 1** (Part 1)
Input: `nums = [1,1,1]`, `k = 2` → Output: `2`
Input: `nums = [1,2,3]`, `k = 3` → Output: `2` (`[1,2]` and `[3]`)

**Example 2** (Part 1, zeros and negatives)
Input: `nums = [1,-1,0]`, `k = 0`
Output: `3`
Explanation: `[1,-1]`, `[0]` and `[1,-1,0]`.

**Example 3** (Part 1 streaming)
Input: `c = SubarraySumCounter(3)`, then `add` 1, 2, 3, -3, 3
Output: `0, 1, 2, 3, 5`
Explanation: After the last add the qualifying subarrays are `[1,2]`, `[3]`, `[1,2,3,-3]`, `[3,-3,3]`, `[3]` (the final one), so `count_subarrays_with_sum([1,2,3,-3,3], 3)` is also `5`.

**Example 4** (Part 2)
Input:
```
grid = [[1,1,0,0],
        [0,1,0,1],
        [1,0,0,1],
        [1,0,1,1]]
```
Output: `3`
Explanation: Diagonal contact does not connect, so `[[1,0],[0,1]]` has `2` communities. An all-empty grid or `[]` has `0`.

<details><summary>Approach (spoiler)</summary>

Part 1: with prefix sums `P`, a subarray `(i, j]` sums to `k` iff `P[j] - P[i] = k`. Scan once, keeping a hash map of how many times each prefix sum has occurred (seeded with `0 → 1`), and add `count[P - k]` at every step. The same state supports the streaming version because each new element only needs earlier prefixes. A sliding window does not work here because of negative numbers.
Part 2: flood fill (iterative DFS/BFS or union-find) from each unvisited building, counting the number of fills.
**Time:** Part 1 O(n); Part 2 O(m·n) · **Space:** O(n) / O(m·n)

```python
from collections import defaultdict
from typing import List

# Part 1
def count_subarrays_with_sum(nums: List[int], k: int) -> int:
    seen = defaultdict(int)
    seen[0] = 1
    prefix = total = 0
    for x in nums:
        prefix += x
        total += seen[prefix - k]
        seen[prefix] += 1
    return total

class SubarraySumCounter:
    """Online version: numbers arrive one at a time."""
    def __init__(self, k: int):
        self.k, self.prefix, self.total = k, 0, 0
        self.seen = defaultdict(int); self.seen[0] = 1
    def add(self, x: int) -> int:
        self.prefix += x
        self.total += self.seen[self.prefix - self.k]
        self.seen[self.prefix] += 1
        return self.total

# Part 2
def count_communities(grid: List[List[int]]) -> int:
    if not grid: return 0
    m, n = len(grid), len(grid[0])
    seen = [[False] * n for _ in range(m)]
    count = 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1 and not seen[i][j]:
                count += 1
                seen[i][j] = True
                stack = [(i, j)]
                while stack:
                    r, c = stack.pop()
                    for nr, nc in ((r+1, c), (r-1, c), (r, c+1), (r, c-1)):
                        if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1 and not seen[nr][nc]:
                            seen[nr][nc] = True
                            stack.append((nr, nc))
    return count
```
</details>
