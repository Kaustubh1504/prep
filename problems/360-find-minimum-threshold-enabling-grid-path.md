# Find minimum threshold enabling grid path
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · hard · Pattern: Shortest Path, Binary Search

## Problem
You are given an `m x n` grid of non-negative integers. For a threshold `T`, a cell is **open** if its value is `<= T`. You may move between cells that share an edge (up, down, left, right), and only through open cells.

Return the **minimum threshold `T`** such that there is a path of open cells from the top-left cell `(0, 0)` to the bottom-right cell `(m-1, n-1)`. Both endpoints must be open, so the answer is at least `max(grid[0][0], grid[m-1][n-1])`. Equivalently, the answer is the minimum, over all paths, of the maximum cell value on the path.

For a `1 x 1` grid the answer is the single cell's value. Since all values are finite, some threshold always works; the function only returns `-1` if no path exists, which cannot happen for well-formed input.

## Function signature
```python
from typing import List

def min_threshold(grid: List[List[int]]) -> int:
    ...
```

## Constraints
- `1 <= m, n <= 500`
- `0 <= grid[i][j] <= 10^9`

## Examples
**Example 1**
Input: `grid = [[0,2],[1,3]]`
Output: `3`
Explanation: The destination itself has value 3, so `T` must be at least 3, and with `T = 3` every cell is open.

**Example 2**
Input: `grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]`
Output: `16`
Explanation: The cheapest route follows the outer ring `0,1,2,3,4,5,16,20,6`; its largest value is 16, and any route avoiding 16 must pass through a value of at least 17.

**Example 3** (an edge case)
Input: `grid = [[1,9,1],[1,9,1],[1,1,1]]`
Output: `1`
Explanation: Going down the left column and along the bottom row avoids the 9s. (A `1 x 1` grid `[[7]]` gives `7`.)

<details><summary>Approach (spoiler)</summary>

This is a bottleneck (minimax) shortest path. Run Dijkstra where the "distance" of a path is the maximum cell value on it: pop the cell with the smallest bottleneck so far and relax neighbours with `max(current, grid[neighbour])`. Because `max` is monotone, the first time the destination is popped its value is optimal. Alternatively, binary search `T` over the sorted distinct cell values and check reachability with BFS/DFS restricted to cells `<= T` — feasibility is monotone in `T` — for O(mn log(mn)) as well; union-find adding cells in increasing value order also works.
**Time:** O(mn log(mn)) · **Space:** O(mn)

```python
import heapq
from collections import deque
from typing import List

def min_threshold(grid: List[List[int]]) -> int:
    m, n = len(grid), len(grid[0])
    best = [[float("inf")] * n for _ in range(m)]
    best[0][0] = grid[0][0]
    pq = [(grid[0][0], 0, 0)]
    while pq:
        t, r, c = heapq.heappop(pq)
        if (r, c) == (m - 1, n - 1):
            return t
        if t > best[r][c]:
            continue  # stale entry
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < m and 0 <= nc < n:
                nt = max(t, grid[nr][nc])
                if nt < best[nr][nc]:
                    best[nr][nc] = nt
                    heapq.heappush(pq, (nt, nr, nc))
    return -1


# Alternative: binary search on the answer + BFS feasibility check.
def min_threshold_bs(grid: List[List[int]]) -> int:
    m, n = len(grid), len(grid[0])
    vals = sorted({v for row in grid for v in row})

    def reachable(T: int) -> bool:
        if grid[0][0] > T:
            return False
        seen = {(0, 0)}
        dq = deque([(0, 0)])
        while dq:
            r, c = dq.popleft()
            if (r, c) == (m - 1, n - 1):
                return True
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in seen and grid[nr][nc] <= T:
                    seen.add((nr, nc))
                    dq.append((nr, nc))
        return False

    lo, hi = 0, len(vals) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if reachable(vals[mid]):
            hi = mid
        else:
            lo = mid + 1
    return vals[lo]
```
</details>
