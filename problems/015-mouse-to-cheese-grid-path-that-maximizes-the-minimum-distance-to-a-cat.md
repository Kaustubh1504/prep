# Mouse-to-Cheese Grid Path That Maximizes the Minimum Distance to a Cat
> Google · Onsite · medium · Pattern: Graph BFS / DFS
> Source: https://prachub.com/interview-questions/mouse-to-cheese-grid-path-that-maximizes-the-minimum-distance-to-a-cat

You are given an `N x N` grid that contains a mouse's starting cell `S`, a piece of cheese at `T`, a cat at `C`, water cells and land cells. The mouse moves one step at a time up, down, left or right, and it can never enter a water cell. The cat does not move.

The safety of a path is the smallest Manhattan distance from any cell on the path, including `S` and `T`, to the cat's cell. Return the largest safety over all paths from `S` to `T`, or `-1` if the mouse cannot reach `T` at all.

Each row of the grid is a string over the characters `'S'`, `'T'`, `'C'`, `'.'` (land) and `'W'` (water). Cells are written as `(row, column)`, 0-indexed.

### Function Signature

```python
def max_safety(grid: list[str]) -> int:
```

### Rules

- The Manhattan distance between `(r1, c1)` and `(r2, c2)` is `|r1 - r2| + |c1 - c2|`. It is measured on grid coordinates and ignores any water between the two cells.
- A path is a sequence of cells that starts at `S`, ends at `T`, contains no water cell, and in which consecutive cells share a side. Cells may be revisited.
- `S`, `T` and `C` are land. The mouse may step onto the cat's cell, whose distance to the cat is `0`.
- Return only the largest safety, not the path.

### Constraints

- `2 <= N <= 500`, where `N = len(grid)` and `len(grid[i]) == N` for every row `i`
- The grid contains exactly one `'S'`, exactly one `'T'` and exactly one `'C'`. Every other character is `'.'` or `'W'`.
- Every distance is at most `2 * (N - 1) = 998`.

### Examples

**Example 1**

```text
Input:  grid = [
  "S...T",
  ".....",
  "..C..",
  ".....",
  "....."
]
Output: 2
```

`S` is in column `0` and `T` is in column `4`, so every path visits column `2`, whose cells are at distances `2, 1, 0, 1, 2` from the cat. Walking along the top row keeps every cell at distance at least `2`.

**Example 2**

```text
Input:  grid = [
  "S.W.T",
  ".....",
  "..C..",
  ".....",
  "..W.."
]
Output: 1
```

The water at `(0, 2)` and `(4, 2)` leaves `(1, 2)`, `(2, 2)` and `(3, 2)` as the only ways across column `2`, and the best of them is at distance `1`. The path `S`, `(1, 0)`, `(1, 1)`, `(1, 2)`, `(1, 3)`, `(1, 4)`, `T` achieves it.

**Example 3**

```text
Input:  grid = [
  "SW..",
  "W...",
  "..C.",
  "...T"
]
Output: -1
```

Both neighbors of `S` are water, so the cheese cannot be reached.

<details><summary>Hints (spoiler)</summary>

1. A cell's distance to the cat is pure coordinate arithmetic: water between the cell and the cat does not make it any farther, so every cell's distance can be computed without a search.
2. S and T lie on every path, so the answer can never exceed the smaller of their two distances. If T cannot be reached even when every land cell (the cat's included) is allowed, the answer is -1.
3. If the mouse can keep every cell at distance at least d from the cat, it can also keep every cell at distance at least d - 1. Use that monotonic structure.
</details>

<details><summary>Approach (spoiler)</summary>

Bucketed widest-path search. A cell's distance to the cat is pure coordinate arithmetic, d(r, c) = |r - cr| + |c - cc|, so water never changes it. Let best[v] be the largest safety known for any path from S to v, where a path's safety counts every cell on it, S and v included; start with best[S] = d(S). Every value lies in 0..2(N - 1), so keep one bucket per value and scan the buckets from the highest value down. When a cell is popped from bucket k for the first time, k is final for that cell: every pending value is at most k, and extending a path can only keep or lower its minimum. Relax each non-water neighbor u with min(k, d(u)); if that beats best[u], record it and push u into that bucket, which is at most k and therefore still pending. The first time T is finalized, its bucket value is the answer; if every bucket empties first, T is unreachable and the answer is -1. This is Dijkstra's algorithm with (max, min) in place of (min, +); buckets replace the heap because a relaxed value never exceeds the current one. Revisiting cells never helps, because a walk's minimum is at most that of the simple path it contains. Edge cases: the cat cell is ordinary land at distance 0, so a route forced through it scores 0 rather than -1; S and T always count, so the answer never exceeds min(d(S), d(T)); water between a cell and the cat is ignored; the result is -1 or in 0..998 and fits a 32-bit int.

**Time:** O(N^2) · **Space:** O(N^2)
</details>
