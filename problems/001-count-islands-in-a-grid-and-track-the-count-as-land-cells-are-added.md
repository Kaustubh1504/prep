# Count Islands in a Grid and Track the Count as Land Cells Are Added
> Google · Technical Screen · medium · Pattern: Union-Find, Graph BFS / DFS
> Source: https://prachub.com/interview-questions/count-islands-in-a-grid-and-track-the-count-as-land-cells-are-added

A map is a grid with `m` rows and `n` columns in which every cell is land (`1`) or water (`0`). An island is a maximal group of land cells connected horizontally or vertically. Cells that touch only at a corner are not connected.

You are given the initial map and a sequence of additions, each of which turns one cell into land. Report the number of islands before any addition, and again after each addition.

### Function Signature

```python
def island_counts(grid: list[list[int]], additions: list[tuple[int, int]]) -> list[int]:
```

### Rules

- `grid[r][c]` is `1` for land and `0` for water, where `r` is the row index and `c` is the column index.
- An addition `(r, c)` turns cell `(r, c)` into land. If that cell is already land, either initially or because of an earlier addition, the map does not change.
- Additions are applied in the given order. Land never turns back into water.
- Return a list of length `len(additions) + 1`. Element `0` is the number of islands in the initial grid. For `i >= 1`, element `i` is the number of islands after the first `i` additions have been applied.

### Constraints

- `1 <= m <= 1000`, `1 <= n <= 1000` and `m * n <= 200000`
- Every row of `grid` has exactly `n` entries, each `0` or `1`.
- `0 <= len(additions) <= 200000`
- Every addition `(r, c)` satisfies `0 <= r < m` and `0 <= c < n`. The same cell may appear more than once.
- Every count is at most `m * n`, so all values fit in a 32-bit signed integer.

### Examples

**Example 1**

```text
Input:  grid = [[1, 1, 0, 0], [0, 0, 0, 1], [1, 0, 0, 1]], additions = []
Output: [3]
```

The islands are {(0, 0), (0, 1)}, {(1, 3), (2, 3)} and {(2, 0)}. With no additions, the only element is the initial count.

**Example 2**

```text
Input:  grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], additions = [(0, 0), (0, 1), (1, 2), (2, 1), (1, 1), (1, 1)]
Output: [0, 1, 1, 2, 3, 1, 1]
```

The grid starts with no land. (0, 0) creates an island and (0, 1) joins it. (1, 2) and (2, 1) each touch no land, so each creates a new island. (1, 1) touches all three islands and merges them into one. The second (1, 1) is already land, so nothing changes.

**Example 3**

```text
Input:  grid = [[1, 1, 0, 0], [0, 0, 0, 1], [1, 0, 0, 1]], additions = [(0, 2), (0, 3), (1, 0)]
Output: [3, 3, 2, 1]
```

(0, 2) joins the top-left island. It touches (1, 3) only at a corner, so the count stays 3. (0, 3) connects the top-left island to the island at (1, 3) and (2, 3), giving 2. (1, 0) connects the merged island to (2, 0), giving 1.

<details><summary>Hints (spoiler)</summary>

1. Land never turns back into water, so adding one cell can only change the island count in a limited way; consider what the new cell can connect to.
2. If the new cell touches the same island from more than one side, that island must only be counted as merged once, so you need a fast way to tell whether two land cells already belong to the same island.
3. Recounting all islands from scratch after every addition is too slow with up to 200000 cells and 200000 additions.
</details>

<details><summary>Approach (spoiler)</summary>

Treat every cell as a node of a disjoint-set (union-find) structure indexed by r * n + c, with path compression and union by size, and keep a running island count. Activating a cell that is already land does nothing. Activating a water cell marks it as land and increments the count (it starts as its own island); then, for each of its up to four in-bounds orthogonal neighbours that is land, the roots of the two cells are found and, if they differ, the two sets are merged and the count is decremented. The initial grid is built by activating its land cells in row-major order and the count is recorded; each addition is then activated in order and the count recorded again.

Invariant: the count always equals the number of disjoint sets among land cells, and two land cells share a set exactly when a horizontal/vertical path of land joins them. A new land cell can only connect itself to the islands of its orthogonal neighbours, so merging it with each distinct neighbouring set and decrementing once per successful merge preserves the invariant. Comparing roots before merging is what makes a cell that touches the same island from two or more sides decrement the count only once. Diagonal cells are never examined, so corner contact never connects islands, and neighbour indices are derived from (r, c) with explicit bounds checks against m and n, so the last cell of one row is never treated as adjacent to the first cell of the next.

Edge cases: empty additions returns only the initial count; repeated additions and additions on initial land repeat the previous count; an all-water grid starts at 0 and an all-land grid stays at 1. Every count is at most m * n <= 200000, so 32-bit integers suffice in every language.

**Time:** O((m*n + k) * alpha(m*n)), where k = len(additions) · **Space:** O(m*n + k)
</details>
