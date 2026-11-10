# Grid Reachability From Start to Target With Impassable Water Cells
> Google · Onsite · medium · Pattern: Graph BFS / DFS
> Source: https://prachub.com/interview-questions/grid-reachability-from-start-to-target-with-impassable-water-cells

You are given an `N x N` grid. One cell is the start `S`, one cell is the target `T`, some cells are water, and every other cell is land. Water cells cannot be entered. From a cell you may move one step up, down, left or right to a neighboring cell inside the grid, as long as that neighbor is not water.

Return whether there is a path from `S` to `T`.

Each row of the grid is a string over the characters `'S'`, `'T'`, `'.'` (land) and `'W'` (water). Cells are written as `(row, column)`, 0-indexed.

### Function Signature

```python
def can_reach(grid: list[str]) -> bool:
```

### Rules

- `S` and `T` are not water. A path may pass through any cell that is not water, and it may revisit cells.
- Diagonal moves are not allowed, and the grid does not wrap around at its edges.
- Return `True` if some sequence of moves leads from `S` to `T`, and `False` otherwise.

### Constraints

- `2 <= N <= 1000`, where `N = len(grid)` and `len(grid[i]) == N` for every row `i`
- The grid contains exactly one `'S'` and exactly one `'T'`. Every other character is `'.'` or `'W'`.
- The grid has at most 1,000,000 cells.

### Examples

**Example 1**

```text
Input:  grid = [
  "S...",
  "WWW.",
  "....",
  "TWWW"
]
Output: True
```

The path runs along the top row, down the last column to row `2`, left along row `2` to column `0`, and down to `T` at `(3, 0)`.

**Example 2**

```text
Input:  grid = [
  "S.W.",
  "WW..",
  "....",
  "...T"
]
Output: False
```

The only land cell next to `S` is `(0, 1)`, and the water cells `(0, 2)`, `(1, 0)` and `(1, 1)` wall both of these cells in.

<details><summary>Hints (spoiler)</summary>

1. Every cell that is not water, including S and T, can be stepped on any number of times, so the only question is which cells can be reached from S at all.
2. A neighbor must stay inside the grid: a cell in the first or last row or column has fewer than four neighbors, and two cells that touch only at a corner are not neighbors.
3. The grid can hold up to 1,000,000 cells and one winding route can pass through a large share of them, so keep the work proportional to the number of cells.
</details>

<details><summary>Approach (spoiler)</summary>

Treat every non-water cell as a node and join two nodes when their cells share a side; the answer is True exactly when T lies in the connected component of S. The reference joins the rows into one string of N*N characters, so cell (r, c) has index r*N + c, and runs an iterative flood fill from S with an explicit stack. A cell is marked as seen when it is pushed, so each cell enters the stack at most once. When a cell is popped it is compared with T. Otherwise its upper and lower neighbors are tried only when the index stays inside [0, N*N), its left neighbor only when its column is greater than 0, and its right neighbor only when its column is less than N - 1, so no move wraps from the end of one row to the start of the next or across the top and bottom edges. A neighbor is pushed only if it is unseen and not water. Invariant: every pushed cell is a non-water cell that S reaches by legal moves. Correctness: if a legal route S = c0, c1, ..., ck = T exists, each ci is eventually marked, because when c(i-1) is popped, ci is a legal neighbor that is either already marked or pushed then; so T is popped and True is returned. Conversely, only reachable cells are ever pushed, so True is never returned wrongly, and when the stack empties the whole component of S has been explored without meeting T, so the answer is False. Edge cases: S next to T is found after one expansion; S boxed in or T sealed off by water empties the stack; cells that touch only at a corner are never neighbors; and a long winding corridor needs no recursion, so no call-stack limit applies.

**Time:** O(N^2) · **Space:** O(N^2)
</details>
