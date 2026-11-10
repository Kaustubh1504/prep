# Find the Time for Grid Signals to Reach Every Target
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Medium · Pattern: Graph BFS / DFS

## Problem
You are given an `m x n` grid of characters:
- `'S'` — a signal source,
- `'T'` — a target,
- `'B'` — a blocker that signals cannot enter,
- `'.'` — empty space.

At time 0 all sources emit simultaneously. Each minute, the signal spreads from every reached cell to its 4-directional neighbours that are not blockers. Targets and sources do not block propagation.

Return the earliest time at which **every** target has been reached. Return `0` if there are no targets, and `-1` if at least one target can never be reached.

## Function signature
```python
from typing import List

def signal_completion_time(grid: List[str]) -> int:
    ...
```

## Constraints
- `1 <= m, n <= 1000`
- All rows have equal length; the grid may contain zero or more sources

## Examples
**Example 1**
Input:
```
grid = ["S..T",
        ".B..",
        "T..S"]
```
Output: `2`
Explanation: Each target is two steps from its nearest source, and both sources spread at the same time.

**Example 2** (unreachable)
Input: `grid = ["S.B.T", "..B.."]`
Output: `-1`
Explanation: Column 2 is a full wall of blockers.

**Example 3** (no targets)
Input: `grid = ["S..", "..."]`
Output: `0`

**Example 4** (a sealed source does not matter)
Input: `grid = ["SBT", "B..", "T.S"]`
Output: `2`
Explanation: The top-left source is boxed in, but the bottom-right source reaches both targets in 2 minutes.

**Example 5** (signal passes through targets)
Input: `grid = ["S.T.T"]` → Output: `4`

<details><summary>Approach (spoiler)</summary>

Multi-source BFS: enqueue every source at distance 0, then expand level by level, never entering blockers or revisiting cells. BFS reaches each cell at its earliest possible time, and targets are discovered in non-decreasing time order, so the moment the last target is discovered gives the answer and the search can stop early. If the queue empties with targets left over, return -1.
**Time:** O(m · n) · **Space:** O(m · n)

```python
from collections import deque
from typing import List

def signal_completion_time(grid: List[str]) -> int:
    m, n = len(grid), len(grid[0]) if grid else 0
    dist = [[-1] * n for _ in range(m)]
    q = deque()
    remaining = 0
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 'S':
                dist[r][c] = 0; q.append((r, c))
            elif grid[r][c] == 'T':
                remaining += 1
    if remaining == 0:
        return 0
    while q:
        r, c = q.popleft()
        for nr, nc in ((r+1, c), (r-1, c), (r, c+1), (r, c-1)):
            if 0 <= nr < m and 0 <= nc < n and dist[nr][nc] == -1 and grid[nr][nc] != 'B':
                dist[nr][nc] = dist[r][c] + 1
                if grid[nr][nc] == 'T':
                    remaining -= 1
                    if remaining == 0:
                        return dist[nr][nc]       # BFS order: this is the latest target
                q.append((nr, nc))
    return -1
```
</details>
