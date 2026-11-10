# Count same-color squares in a character grid
> Google · Technical Screen · hard · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/count-same-color-squares-in-a-character-grid

You are given a 2D grid (matrix) of characters. Each character represents a color: cells with the same character are considered the same color.

Formally:

- The grid has `m` rows and `n` columns.
- `grid[i][j]` is an alphabetic character (e.g., `'a'`–`'z'` or `'A'`–`'Z'`).

A **square** in this grid is defined as a contiguous `k × k` submatrix aligned with the grid axes, for some integer `k ≥ 1`.

A square is **monochromatic** if **all** of its cells contain the **same** character (i.e., the same color).

Task:

- Count and return the total number of monochromatic squares in the grid.
- Count all sizes of squares (1×1, 2×2, ..., up to the largest possible that fits in the grid).

Example (just for clarity, not necessarily exhaustive):

If the grid is:

```
a a b
a a b
b b b
```

Then some monochromatic squares include:

- All 1×1 cells (each single cell is a monochromatic square).
- The 2×2 square in the top-left corner formed by `'a'`.

Your function should return the total count of such monochromatic squares for a given input grid.

<details><summary>Hints (spoiler)</summary>

1. Try defining dp[i][j] as the side length of the largest monochromatic square whose bottom-right corner is cell (i, j).
2. A square larger than 1 can end at (i, j) only if the current cell matches its top, left, and top-left neighboring cells.
</details>
