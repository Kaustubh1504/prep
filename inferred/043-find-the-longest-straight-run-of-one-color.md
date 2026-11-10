# Find the Longest Straight Run of One Color
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Hard · Pattern: Dynamic Programming

## Problem
You are given a rectangular `m x n` grid where each cell holds a color (a string or character). A **straight run** is a sequence of consecutive cells, all the same color, lying along one line in one of four directions:
- horizontal (left to right),
- vertical (top to bottom),
- diagonal (top-left to bottom-right),
- anti-diagonal (top-right to bottom-left).

Return the length of the longest straight run in the grid. A single cell is a run of length 1. Return `0` for an empty grid.

## Function signature
```python
from typing import List

def longest_color_run(grid: List[List[str]]) -> int:
    ...
```

## Constraints
- `0 <= m, n <= 1000`, `m * n <= 10^6`
- All rows have the same length
- Colors are compared for exact equality

## Examples
**Example 1**
Input:
```
grid = [["R","G","B","R"],
        ["G","R","R","B"],
        ["B","G","R","G"]]
```
Output: `3`
Explanation: The diagonal `(0,0), (1,1), (2,2)` is all `R`.

**Example 2**
Input: `grid = [["R","R","G"],["B","B","B"],["R","G","B"]]`
Output: `3`
Explanation: The middle row is three `B`s.

**Example 3** (anti-diagonal)
Input: `grid = [["A","B","C","D"],["E","F","D","H"],["I","D","K","L"],["D","N","O","P"]]`
Output: `4`
Explanation: `(0,3), (1,2), (2,1), (3,0)` are all `D`.

**Example 4** (edge cases)
Input: `grid = [["X"]]` → Output: `1`; Input: `grid = []` → Output: `0`

<details><summary>Approach (spoiler)</summary>

Keep, for each cell, four counters: the length of the same-color run ending at that cell in each direction. Scanning row by row, left to right, the predecessor in each direction (left, up, up-left, up-right) has already been computed, so `dp[i][j][d] = dp[prev][d] + 1` if the predecessor has the same color, else 1. The answer is the maximum over all counters. Only the previous row is needed, so memory is O(n).
**Time:** O(m·n) · **Space:** O(n)

```python
from typing import List

def longest_color_run(grid: List[List[str]]) -> int:
    if not grid or not grid[0]: return 0
    R, C = len(grid), len(grid[0])
    dirs = [(0, -1), (-1, 0), (-1, -1), (-1, 1)]  # horizontal, vertical, diagonal, anti-diagonal
    prev = [[0]*4 for _ in range(C)]
    best = 0
    for i in range(R):
        cur = [[1]*4 for _ in range(C)]
        for j in range(C):
            for k, (di, dj) in enumerate(dirs):
                pi, pj = i + di, j + dj
                if 0 <= pi and 0 <= pj < C and grid[pi][pj] == grid[i][j]:
                    cur[j][k] = (cur[pj][k] if di == 0 else prev[pj][k]) + 1
                best = max(best, cur[j][k])
        prev = cur
    return best
```
</details>
