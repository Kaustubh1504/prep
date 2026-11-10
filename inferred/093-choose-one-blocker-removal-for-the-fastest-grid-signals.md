# Choose One Blocker Removal for the Fastest Grid Signals
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Medium · Pattern: Graph BFS / DFS

## Problem
You are given an `m x n` grid of characters:
- `'S'` — a signal source,
- `'T'` — a target that must receive the signal,
- `'B'` — a blocker the signal cannot enter,
- `'.'` — empty space.

At time 0 every source emits a signal. Each minute the signal spreads from every reached cell to its 4-directional neighbours (up, down, left, right) that are not blockers. Sources and targets do not block the signal. The **completion time** is the time at which the last target is first reached (0 if there are no targets); it is infinite if some target is never reached.

Before the signals start you may remove **at most one** blocker anywhere in the grid (it becomes `'.'`), or remove nothing. Choose the option that minimises the completion time, with deterministic tie-breaking:
1. If removing nothing is as good as any removal, remove nothing.
2. Otherwise, among removals achieving the minimum, choose the blocker with the smallest row, then the smallest column.

Return `[time, row, col]`, where `(row, col) = (-1, -1)` means no removal. If every target cannot be reached under any option, return `[-1, -1, -1]`.

## Function signature
```python
from typing import List

def best_blocker_removal(grid: List[str]) -> List[int]:
    ...
```

## Constraints
- `1 <= m, n <= 50`
- At least one `'S'`; any number of `'T'` and `'B'`

## Examples
**Example 1**
Input:
```
grid = ["S.B.T",
        "..B..",
        "..B.."]
```
Output: `[4, 0, 2]`
Explanation: The wall in column 2 cuts the target off. Removing `(0,2)` gives a straight path of length 4; removing `(1,2)` or `(2,2)` gives longer detours.

**Example 2** (tie between removals)
Input: `grid = ["S.B", ".BT"]`
Output: `[3, 0, 2]`
Explanation: Removing `(0,2)` or `(1,1)` both give time 3; `(0,2)` has the smaller row.

**Example 3** (removal does not help)
Input: `grid = ["SBB", "..T"]`
Output: `[3, -1, -1]`
Explanation: The target is already reached at time 3 via the bottom row and no removal beats that, so nothing is removed.

**Example 4** (impossible)
Input: `grid = ["SBT", "BBB", "TBB"]`
Output: `[-1, -1, -1]`
Explanation: Each target is sealed off by different blockers, and one removal can free at most one of them.

<details><summary>Approach (spoiler)</summary>

Run a multi-source BFS from all sources for the "no removal" option, then once more for each blocker treated as empty, and take the minimum of the worst target distance. Scanning blockers in row-major order and only replacing on a strictly better time applies the tie-breaking automatically. An optimisation: only blockers adjacent to a cell reached in the base BFS can improve the time, which prunes many candidates. A faster O(mn) approach uses BFS distances from sources and from each target, but with many targets the per-blocker BFS is the clear interview baseline.
**Time:** O(B · m · n) for B blockers · **Space:** O(m · n)

```python
from collections import deque
from typing import List

def best_blocker_removal(grid: List[str]) -> List[int]:
    m, n = len(grid), len(grid[0])
    sources = [(r, c) for r in range(m) for c in range(n) if grid[r][c] == 'S']
    targets = [(r, c) for r in range(m) for c in range(n) if grid[r][c] == 'T']
    blockers = [(r, c) for r in range(m) for c in range(n) if grid[r][c] == 'B']
    INF = float("inf")

    def spread_time(removed) -> float:
        dist = [[-1] * n for _ in range(m)]
        q = deque()
        for r, c in sources:
            dist[r][c] = 0; q.append((r, c))
        while q:
            r, c = q.popleft()
            for nr, nc in ((r-1, c), (r+1, c), (r, c-1), (r, c+1)):
                if 0 <= nr < m and 0 <= nc < n and dist[nr][nc] == -1 \
                        and (grid[nr][nc] != 'B' or (nr, nc) == removed):
                    dist[nr][nc] = dist[r][c] + 1
                    q.append((nr, nc))
        worst = 0
        for r, c in targets:
            if dist[r][c] == -1:
                return INF
            worst = max(worst, dist[r][c])
        return worst

    best_t, best_cell = spread_time(None), (-1, -1)
    for cell in blockers:               # row-major order => smallest (row, col) wins ties
        t = spread_time(cell)
        if t < best_t:
            best_t, best_cell = t, cell
    if best_t == INF:
        return [-1, -1, -1]
    return [int(best_t), best_cell[0], best_cell[1]]
```
</details>
