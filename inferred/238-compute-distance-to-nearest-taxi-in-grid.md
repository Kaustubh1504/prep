# Compute distance to nearest taxi in grid
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Graph BFS / DFS

## Problem
A city map is an `m x n` grid of characters:
- `'T'` is a cell with a taxi,
- `'.'` is an open road cell,
- `'#'` is a blocked cell (a building) that nobody can enter.

A taxi moves one step at a time, up, down, left or right, and only through non-blocked cells. For every cell, compute the fewest steps from that cell to its **nearest** taxi. Return an `m x n` integer matrix `dist` where:
- `dist[r][c] = 0` for a taxi cell,
- `dist[r][c] = -1` for a blocked cell, or for an open cell that no taxi can reach (including every cell when there are no taxis).

The grid can be large, so running one BFS per taxi (O(k·m·n)) is too slow. The intended solution takes O(m·n) total.

## Function signature
```python
def nearest_taxi_distance(grid: list[str]) -> list[list[int]]:
```

## Constraints
- `1 <= m, n <= 1000`
- `grid[r][c]` is one of `'T'`, `'.'`, `'#'`
- There can be any number of taxis, from 0 up to `m·n`

## Examples
**Example 1**
Input: `grid = ["T..", "...", "..T"]`
Output: `[[0,1,2],[1,2,1],[2,1,0]]`
Explanation: Each cell takes the distance to whichever taxi is closer.

**Example 2**
Input: `grid = [".#T", ".#.", "..."]`
Output: `[[6,-1,0],[5,-1,1],[4,3,2]]`
Explanation: To reach the left column, the path has to go around the wall. Wall cells get -1.

**Example 3** (an edge case)
Input: `grid = ["T.#.", "..#."]`
Output: `[[0,1,-1,-1],[1,2,-1,-1]]`
Explanation: The right column is cut off by the wall, so it is unreachable and gets -1.

**Example 4** (an edge case)
Input: `grid = ["...", ".#.", "..."]`
Output: `[[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]]`
Explanation: There are no taxis.

<details><summary>Approach (spoiler)</summary>

Run a multi-source BFS. Put every taxi in the queue at distance 0, then expand level by level. The first time BFS reaches a cell is through its nearest taxi, because all sources start at the same level and every edge has weight 1. Each cell enters the queue at most once. Cells never reached keep -1.
**Time:** O(m·n) · **Space:** O(m·n)

```python
from collections import deque
def nearest_taxi_distance(grid):
    R = len(grid); C = len(grid[0]) if R else 0
    dist = [[-1]*C for _ in range(R)]
    q = deque()
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 'T':
                dist[r][c] = 0; q.append((r, c))
    while q:
        r, c = q.popleft()
        for nr, nc in ((r+1,c),(r-1,c),(r,c+1),(r,c-1)):
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] != '#' and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1; q.append((nr, nc))
    return dist
```
</details>
