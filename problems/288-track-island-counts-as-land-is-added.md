# Track Island Counts as Land Is Added
> Google · Onsite · medium · Pattern: Union-Find, Graph BFS / DFS
> Source: https://prachub.com/interview-questions/track-island-counts-as-land-is-added

## Track Island Counts as Land Is Added

### Problem

Implement `trackIslandCounts(grid, additions) -> counts`.

`grid` is a rectangular array containing `0` for water and `1` for land. Two land cells belong to the same island when they are connected through up, down, left, or right neighbors.

First count the islands in the initial grid and append that count to `counts`. Then process each addition `[row, col]` in order. An addition changes that cell to land if it is water; adding an existing land cell has no effect. Append the current island count after every addition.

Return an array of length `additions.length + 1`. Do not mutate `grid` or `additions`.

### Constraints

- `1 <= grid.length`, `1 <= grid[0].length`.
- Every row has the same length, and the grid contains at most 200,000 cells.
- `0 <= additions.length <= 200,000`.
- Every addition is a two-element integer array naming a valid grid cell.
- Target `O(R*C + A*alpha(R*C))` time and `O(R*C)` auxiliary space, where `A` is the number of additions.

```hint Count effects locally
When one water cell becomes land, enumerate the distinct neighboring islands it touches and compare that set with the count change.
```

### Examples

```text
grid = [
  [1, 0, 0],
  [0, 0, 1]
]
additions = [[0, 1], [1, 1], [1, 1]]
counts = [2, 2, 1, 1]
```

```text
grid = [[0, 0]]
additions = [[0, 0], [0, 1]]
counts = [0, 1, 1]
```

### Discussion Requirements

- Explain a BFS or DFS computation for the initial island count.
- Explain why recomputing the whole grid after every addition is unnecessarily expensive.
- Describe how disjoint-set union merges newly adjacent land components and handles duplicate additions.

<details><summary>Hints (spoiler)</summary>

1. Counting the whole grid again after every addition repeats work that did not change. Only the cells around the new land can affect the answer.
2. Count effects locally: when one water cell becomes land, enumerate the distinct neighboring islands it touches and compare that set with the count change.
3. Two of the four neighbors may already belong to the same island. Merge by component, not by neighbor cell, and let the disjoint-set union tell you whether a merge actually happened.
</details>

<details><summary>Approach (spoiler)</summary>

The reference keeps a disjoint-set union (DSU) over the R*C cell indices plus a boolean `land` array, and maintains a running island count instead of recomputing it.

Initialization: mark every land cell of the input grid, adding 1 to the count for each. Then sweep the grid once and, for each land cell, union it with its right and down land neighbors. Each union that actually joins two different roots reduces the number of components by exactly one, so subtracting 1 per successful union turns the cell count into the island count. Scanning only right and down visits every adjacent pair once. That initial count is the first element of the result.

Each addition: if the cell is already land the state is unchanged and the current count is appended again, which is what makes duplicate additions a no-op. Otherwise the cell becomes land and the count goes up by 1 (a brand-new island of one cell), then the four orthogonal neighbors are examined. For each neighbor that is land, a union is attempted, and the count is decremented only when the union actually merged two distinct roots. This is the crux: a new cell can have two, three, or four land neighbors that already belong to the same island, and those cost nothing. Letting the DSU report whether a merge happened counts distinct components rather than adjacent cells.

Neither argument is written to: the grid is read once into the private `land` array and the addition pairs are only read.

With path compression and union by rank each operation is effectively constant (inverse Ackermann), so the initial sweep costs O(R*C) and each addition O(alpha(R*C)). The naive alternative of re-running a BFS flood fill after every addition is O(A*R*C), which at the stated bounds is far too slow.

**Time:** O(R*C + A*alpha(R*C)) · **Space:** O(R*C)
</details>
