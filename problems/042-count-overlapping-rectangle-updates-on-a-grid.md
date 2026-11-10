# Count Overlapping Rectangle Updates on a Grid
> Google · Technical Screen · hard · Pattern: Prefix Sum, Intervals / Sweep Line
> Source: https://prachub.com/interview-questions/count-overlapping-rectangle-updates-on-a-grid

# Count Overlapping Rectangle Updates on a Grid

Implement `range_add_counts(n, rectangles)`.

Start with an `n x n` matrix of zeroes. Each rectangle is represented as `[row1, col1, row2, col2]` with inclusive, zero-based coordinates. For every rectangle, add one to each matrix cell inside that rectangle. Return the final matrix, where each cell therefore contains the number of input rectangles covering it.

## Example

For `n = 3` and `rectangles = [[0, 0, 1, 1], [1, 1, 2, 2]]`, return:

```text
[
  [1, 1, 0],
  [1, 2, 1],
  [0, 1, 1]
]
```

## Constraints

- `1 <= n <= 500`
- `0 <= len(rectangles) <= 100_000`
- `0 <= row1 <= row2 < n`
- `0 <= col1 <= col2 < n`

<details><summary>Hints (spoiler)</summary>

1. Mark four corners in an (n + 1) by (n + 1) two-dimensional difference array.
2. Recover cell counts with a two-dimensional prefix sum.
</details>

<details><summary>Approach (spoiler)</summary>

A rectangle update is represented by adding at its top-left corner, subtracting immediately below and right of its extent, and restoring the overlap at the diagonal corner. After all O(1) updates, a two-dimensional prefix sum turns the difference grid into the exact coverage count for every cell.

**Time:** O(n^2 + r), where r is the number of rectangles. · **Space:** O(n^2) for the difference and result matrices.
</details>
