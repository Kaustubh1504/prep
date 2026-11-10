# Minimize maximum height along a grid path
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Hard · Pattern: Shortest Path, Binary Search

## Problem
You are given an `m x n` grid of non-negative integer heights. Start at the top-left cell `(0,0)` and travel to the bottom-right cell `(m-1,n-1)`, moving one cell up, down, left or right at a time. Cells may be revisited, although revisiting never helps.

The cost of a route is the **maximum height of any cell on it**, including the start and end cells. Return the minimum possible cost over all routes. In a `1 x 1` grid the answer is that cell's height. (This is the same problem as LeetCode 778, "Swim in Rising Water", with arbitrary heights.)

## Function signature
```python
def min_max_height(grid: list[list[int]]) -> int:
```

## Constraints
- `1 <= m, n <= 1000`
- `0 <= grid[r][c] <= 10^9`
- Target: O(mn log(mn))

## Examples
**Example 1**
Input: `grid = [[1,3,2],[4,9,2],[7,8,1]]`
Output: `3`
Explanation: The route `1 -> 3 -> 2 -> 2 -> 1` goes along the top row and then down the right column. Its highest cell is 3. Going down the left side would hit 7.

**Example 2** (a detour beats the direct route)
Input: `grid = [[1,9,1,1,1],[1,9,1,9,1],[1,1,1,9,1]]`
Output: `1`
Explanation: The route snakes down the first column, along the bottom to column 2, up column 2, across the top to column 4, and down to the corner. Every cell on it has height 1.

**Example 3** (endpoints count)
Input: `grid = [[5,1],[1,2]]`
Output: `5`
Explanation: Every route includes the start cell, which has height 5.

Input: `grid = [[4]]`
Output: `4`

<details><summary>Approach (spoiler)</summary>

Treat the grid as a graph where a path costs the largest value on it, and run Dijkstra with `max` as the combine step. Pop the cell with the smallest "worst height so far" from the heap, and push each neighbour with `max(current, neighbour_height)`. The bottleneck value never decreases along a path, so the first time a cell is popped its value is optimal, and you can return as soon as the target is popped. There are two common alternatives. One is to binary search on the answer `T` and run a BFS over the cells with height `<= T`. The other is to add cells in increasing height order to a union-find structure until the two corners are connected.

**Time:** O(mn log(mn)) · **Space:** O(mn)

```python
import heapq

def min_max_height(grid):
    m, n = len(grid), len(grid[0])
    seen = [[False] * n for _ in range(m)]
    pq = [(grid[0][0], 0, 0)]
    while pq:
        h, r, c = heapq.heappop(pq)
        if seen[r][c]:
            continue
        if (r, c) == (m - 1, n - 1):
            return h
        seen[r][c] = True
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < m and 0 <= nc < n and not seen[nr][nc]:
                heapq.heappush(pq, (max(h, grid[nr][nc]), nr, nc))
```
</details>
