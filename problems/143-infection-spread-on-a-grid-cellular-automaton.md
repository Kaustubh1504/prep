# Infection Spread on a Grid (Cellular Automaton)
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Hard · Pattern: Simulation, Graph BFS / DFS; Design / Data Structure

## Problem
A rectangular grid is given as a list of equal-length strings. Each cell is one of:
- `'H'`: healthy (susceptible)
- `'I'`: infected
- `'#'`: barrier. It never changes and infection cannot pass through it.
- `'R'`: recovered and immune. It never changes again. Only used from Part 2 on.

The grid evolves in **synchronous** time steps: the state at time `t+1` is computed entirely from the state at time `t`. Neighbours are the 4 orthogonally adjacent cells.

**Part 1: basic spread.** At each step, every `'H'` cell with at least one `'I'` neighbour becomes `'I'`. Infected cells stay infected forever.

**Part 2: recovery delay.** You are given an integer `recovery >= 1`. A cell that became infected at time `d` (cells infected at the start have `d = 0`) stays `'I'` up to and including time `d + recovery - 1`, and becomes `'R'` at time `d + recovery`. While a cell is `'I'` it infects its healthy neighbours as in Part 1. Recovered cells are never reinfected. `recovery = 0` means "no recovery", which is Part 1.

**Part 3: large inputs and fixed-point detection.** `steps` can be as large as `10^9`, so stepping the whole grid one tick at a time is too slow. Also report `stable_at`, the time of the **last** state change. After that time the grid is at a fixed point and never changes again. If the grid never changes at all, `stable_at = 0`.

Implement one function that returns the grid after `steps` time steps, together with `stable_at`. `stable_at` doesn't depend on `steps`.

## Function signature
```python
def simulate(grid: list[str], steps: int, recovery: int = 0) -> tuple[list[str], int]:
```

## Constraints
- `1 <= rows, cols <= 1000`
- `0 <= steps <= 10^9`
- `0 <= recovery <= 10^9`
- Target: O(rows * cols), independent of `steps`

## Examples
**Example 1** (Part 1)
Input: `grid = ["IHH", "H#H", "HHH"]`, `steps = 2`
Output: `(["III", "I#H", "IHH"], 4)`
Explanation: After 1 step, cells `(0,1)` and `(1,0)` are infected. After 2 steps, `(0,2)` and `(2,0)` are too. The barrier forces the infection around it, and the last healthy cell `(2,2)` is reached at time 4. That is the last change, so `stable_at = 4`.

**Example 2** (Part 2 with recovery)
Input: `grid = ["IHHH", "##HH", "HHHH"]`, `steps = 3`, `recovery = 2`
Output: `(["RRII", "##IH", "HHHH"], 8)`
Explanation: The cells infected at times 0 and 1 have recovered by time 3. The farthest cell `(2,0)` is infected at time 6 and recovers at time 8, which is the last change.

Input: `grid = ["IHHH", "##HH", "HHHH"]`, `steps = 100`, `recovery = 2`
Output: `(["RRRR", "##RR", "RRRR"], 8)`

**Example 3** (edge cases)
Input: `grid = ["H#I"]`, `steps = 5`
Output: `(["H#I"], 0)`
Explanation: The barrier blocks the only path, so nothing ever changes.

Input: `grid = ["HH"]`, `steps = 5`, `recovery = 3`
Output: `(["HH"], 0)`
Explanation: There is no infected cell.

<details><summary>Approach (spoiler)</summary>

Run a multi-source BFS from all initially infected cells, passing through `'H'` cells only. A naive simulation re-scans every cell on every tick, O(steps * R * C). With BFS, each cell's infection time is just its BFS distance `d`. This holds in Part 2 as well: an infected cell is still `'I'` one tick later whenever `recovery >= 1`, so recovery never slows the wavefront. The state at any time `T` is then a closed form: `d > T` means `'H'`, `T - d >= recovery` means `'R'`, and anything else is `'I'`. The last change is the largest infection time `maxd`, or `maxd + recovery` when recovery is enabled and at least one cell is infected. In an interview, first write the frontier-based (incremental) tick simulation, which only touches newly infected cells. Then point out that this collapses into the closed form above.

**Time:** O(R * C) · **Space:** O(R * C)

```python
from collections import deque

def simulate(grid, steps, recovery=0):
    R, C = len(grid), len(grid[0])
    INF = float('inf')
    dist = [[INF] * C for _ in range(R)]
    q = deque()
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 'I':
                dist[r][c] = 0
                q.append((r, c))
    last = 0
    while q:
        r, c = q.popleft()
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 'H' and dist[nr][nc] == INF:
                dist[nr][nc] = dist[r][c] + 1
                last = max(last, dist[nr][nc])
                q.append((nr, nc))
    has_infected = any('I' in row for row in grid)
    stable_at = last + recovery if (has_infected and recovery > 0) else last
    out = []
    for r in range(R):
        row = []
        for c in range(C):
            ch, d = grid[r][c], dist[r][c]
            if ch in 'IH' and d <= steps:
                ch = 'R' if recovery > 0 and steps - d >= recovery else 'I'
            row.append(ch)
        out.append(''.join(row))
    return out, stable_at
```
</details>
