# Find Paths Across a Weighted Binary Grid
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Medium · Pattern: Shortest Path, Graph BFS / DFS

## Problem
You are given an `m x n` integer grid. A cell with value `0` is **blocked**. A cell with a positive value is **open**, and its value is the cost of entering it. In Parts 1 and 2 the grid is usually binary (`1` = open), and only "open vs blocked" matters. Movement is 4-directional (up, down, left, right) between open cells.

A **top-to-bottom path** is a sequence of distinct open cells. It starts at any open cell in row `0`, each consecutive pair of cells is adjacent, and it ends at the **first** cell it reaches in row `m-1`. No earlier cell of the path is in the bottom row. Any open cell of row 0 can be a start (there can be several). Paths are compared lexicographically as lists of `(row, col)` tuples. In a single-row grid (`m == 1`), every open cell is a complete path by itself.

**Part 1: reachability.** Return `True` if at least one top-to-bottom path exists.

**Part 2: enumeration.** Return all top-to-bottom paths, in lexicographic order. The output can be exponential in the grid size; that's expected.

**Part 3: minimum cost.** The cost of a path is the sum of the values of all its cells, including the first and last. Return `(min_cost, path)`. If several paths have the minimum cost, return the lexicographically smallest one. If there is no path, return `(-1, [])`.

## Function signature
```python
def has_top_to_bottom_path(grid: list[list[int]]) -> bool: ...
def all_simple_paths(grid: list[list[int]]) -> list[list[tuple[int, int]]]: ...
def min_cost_path(grid: list[list[int]]) -> tuple[int, list[tuple[int, int]]]: ...
```

## Constraints
- `1 <= m, n <= 200` for Parts 1 and 3. Part 2 is only run on small grids (for example `m * n <= 20`).
- `0 <= grid[r][c] <= 10^4`
- Target: Part 1 in O(mn), Part 3 in O(mn log(mn))

## Examples
**Example 1** (Parts 1 and 2)
Input: `grid = [[1,0,1],[1,1,1],[0,1,0]]`
Output (Part 1): `True`
Output (Part 2): `[[(0,0),(1,0),(1,1),(2,1)], [(0,2),(1,2),(1,1),(2,1)]]`
Explanation: Both open cells in the top row reach the only open bottom cell `(2,1)` through `(1,1)`.

**Example 2** (Part 3, with a lexicographic tie)
Input: `grid = [[1,3,1],[1,5,1],[4,2,1]]`
Output: `(3, [(0,2),(1,2),(2,2)])`
Explanation: Going straight down the right column costs `1+1+1 = 3`, and no other path is that cheap.

Input: `grid = [[2,2],[2,2]]`
Output (Part 3): `(4, [(0,0),(1,0)])`
Output (Part 2): `[[(0,0),(0,1),(1,1)], [(0,0),(1,0)], [(0,1),(0,0),(1,0)], [(0,1),(1,1)]]`
Explanation: `[(0,0),(1,0)]` and `[(0,1),(1,1)]` both cost 4. The first is lexicographically smaller.

**Example 3** (unreachable, and a single row)
Input: `grid = [[1,1],[0,0]]`
Output: `False`, `[]`, `(-1, [])`

Input: `grid = [[3,0,1,1]]`
Output: `True`, `[[(0,0)], [(0,2)], [(0,3)]]`, `(1, [(0,2)])`

<details><summary>Approach (spoiler)</summary>

**Part 1:** multi-source BFS from every open top-row cell, stopping as soon as any bottom-row cell is dequeued.

**Part 2:** backtracking DFS from each top-row start in column order. Try neighbours in increasing `(row, col)` order (up, left, right, down), keep an on-path marker so paths stay simple, and record the path when you reach the bottom row. Since a complete path is never the prefix of another, DFS order already is lexicographic order.

**Part 3:** costs are positive, so run Dijkstra **backwards**: seed every open bottom cell with `D = cost`, and compute `D[r][c]`, the cheapest cost from `(r,c)` to the bottom row. The answer is `min(D[0])`. To get the lexicographically smallest optimal path, start at the leftmost top cell that achieves the minimum, then repeatedly step to the smallest neighbour `nb` with `D[cur] == cost[cur] + D[nb]`. `D` strictly decreases along that walk, so the path is simple and optimal.

**Time:** P1 O(mn) · P2 O(number of paths × path length) · P3 O(mn log mn) · **Space:** O(mn)

```python
import heapq
from collections import deque

DIRS = ((-1, 0), (0, -1), (0, 1), (1, 0))  # neighbours in increasing (row, col) order

def has_top_to_bottom_path(grid):
    m, n = len(grid), len(grid[0])
    seen = [[False] * n for _ in range(m)]
    q = deque()
    for c in range(n):
        if grid[0][c] > 0:
            seen[0][c] = True
            q.append((0, c))
    while q:
        r, c = q.popleft()
        if r == m - 1:
            return True
        for dr, dc in DIRS:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] > 0 and not seen[nr][nc]:
                seen[nr][nc] = True
                q.append((nr, nc))
    return False

def all_simple_paths(grid):
    m, n = len(grid), len(grid[0])
    out, path = [], []
    on_path = [[False] * n for _ in range(m)]
    def dfs(r, c):
        path.append((r, c)); on_path[r][c] = True
        if r == m - 1:
            out.append(path[:])
        else:
            for dr, dc in DIRS:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] > 0 and not on_path[nr][nc]:
                    dfs(nr, nc)
        path.pop(); on_path[r][c] = False
    for c in range(n):
        if grid[0][c] > 0:
            dfs(0, c)
    return out

def min_cost_path(grid):
    m, n = len(grid), len(grid[0])
    INF = float('inf')
    D = [[INF] * n for _ in range(m)]  # min cost from (r,c) to the bottom row, inclusive
    pq = []
    for c in range(n):
        if grid[m - 1][c] > 0:
            D[m - 1][c] = grid[m - 1][c]
            pq.append((D[m - 1][c], m - 1, c))
    heapq.heapify(pq)
    while pq:
        d, r, c = heapq.heappop(pq)
        if d > D[r][c]:
            continue
        for dr, dc in DIRS:
            nr, nc = r + dr, c + dc
            # bottom-row cells are terminals, so never relax into them
            if 0 <= nr < m - 1 and 0 <= nc < n and grid[nr][nc] > 0 and d + grid[nr][nc] < D[nr][nc]:
                D[nr][nc] = d + grid[nr][nc]
                heapq.heappush(pq, (D[nr][nc], nr, nc))
    best = min(D[0])
    if best == INF:
        return -1, []
    r, c = 0, D[0].index(best)
    path = [(r, c)]
    while r != m - 1:
        for dr, dc in DIRS:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] > 0 and D[r][c] == grid[r][c] + D[nr][nc]:
                r, c = nr, nc
                break
        path.append((r, c))
    return best, path
```
</details>
