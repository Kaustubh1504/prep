# Min boards to cover roof holes
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Greedy, Dynamic Programming

## Problem
A flat roof is modelled as an `R x C` grid `grid`, where `grid[r][c] == 1` marks a **hole** and `0` marks intact roof.

You patch holes with straight wooden boards. A board is laid either **horizontally** along a single row or **vertically** along a single column, and it can be **as long as needed** (up to the full row or column). A board covers every cell it lies on; covering intact cells is allowed, and boards may cross or overlap.

Return the **minimum number of boards** needed so that every hole is covered. A roof with no holes needs `0` boards.

Note: since a board can always be extended to the full row or column at no cost, the question is equivalent to choosing the fewest rows and columns that together contain every hole.

## Function signature
```python
from typing import List

def min_boards(grid: List[List[int]]) -> int:
    ...
```

## Constraints
- `1 <= R, C <= 300`
- `grid[r][c]` is `0` or `1`

## Examples
**Example 1**
Input: `grid = [[1,0,1],[0,0,0],[1,0,1]]`
Output: `2`
Explanation: Two vertical boards on columns 0 and 2 (or two horizontal boards on rows 0 and 2) cover all four corner holes.

**Example 2** (greedy trap)
Input: `grid = [[1,0,0,1],[0,0,0,0],[1,1,0,0],[0,1,0,1],[0,0,0,1]]`
Output: `3`
Explanation: Vertical boards on columns 0, 1 and 3 cover all seven holes. A greedy "board the line with the most remaining holes" takes column 3 first (3 holes), then faces a tie among row 2, column 0 and column 1 (2 holes each); picking row 2 leaves holes `(0,0)` and `(3,1)` in different rows and columns, so greedy ends with 4 boards.

**Example 3**
Input: `grid = [[1,0,0],[0,1,0],[0,0,1]]`
Output: `3`
Explanation: No row or column contains two holes, so each board covers at most one hole.

**Example 4** (edge cases)
Input: `grid = [[0,0],[0,0]]` → Output: `0`; `grid = [[0,1,0,0,1]]` → Output: `1` (one horizontal board along the only row).

<details><summary>Approach (spoiler)</summary>

Build a bipartite graph with one vertex per row and one per column, and an edge `(r, c)` for each hole. Choosing boards is choosing a set of vertices that touches every edge — a **minimum vertex cover**. By König's theorem, in a bipartite graph the minimum vertex cover equals the **maximum matching**, which Kuhn's augmenting-path algorithm (or Hopcroft–Karp) computes exactly. Greedy "most holes first" and row-by-row DP heuristics can over-count on adversarial grids, which is the key insight interviewers look for; a brute force over subsets of rows (columns then forced) is a good baseline for small `R`.
**Time:** O(R · H) for Kuhn's algorithm, H = number of holes (O(H·sqrt(R+C)) with Hopcroft–Karp) · **Space:** O(R + C + H)

```python
import sys
from typing import List

def min_boards(grid: List[List[int]]) -> int:
    rows = len(grid)
    cols = len(grid[0]) if rows else 0
    adj = [[c for c in range(cols) if grid[r][c] == 1] for r in range(rows)]
    match_col = [-1] * cols        # match_col[c] = row matched to column c

    def augment(r: int, seen: List[bool]) -> bool:
        for c in adj[r]:
            if not seen[c]:
                seen[c] = True
                if match_col[c] == -1 or augment(match_col[c], seen):
                    match_col[c] = r
                    return True
        return False

    sys.setrecursionlimit(max(1000, 2 * rows + 100))
    # König's theorem: min vertex cover (rows/columns) = max matching.
    return sum(augment(r, [False] * cols) for r in range(rows))
```
</details>
