# Count Up-Right/Right/Down-Right Grid Paths Through Ordered Checkpoints
> Google · Onsite · medium · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/count-up-right-right-down-right-grid-paths-through-ordered-checkpoints

You are given an `n x m` grid. Rows are numbered `0` to `n - 1` from top to bottom, and columns `0` to `m - 1` from left to right. A path starts at the bottom-left cell `(n - 1, 0)` and ends at the bottom-right cell `(n - 1, m - 1)`. From cell `(r, c)`, one move goes to one of:

- `(r - 1, c + 1)` (up-right),
- `(r, c + 1)` (right),
- `(r + 1, c + 1)` (down-right),

and the move must stay inside the grid.

You are also given a list of checkpoint cells. Count the paths that visit every checkpoint, in the order in which the checkpoints are listed, and return the count modulo `1_000_000_007`.

The interviewer built this up in three steps: first count all paths with no checkpoints; then count the paths that pass through every checkpoint; then require the checkpoints to be visited in a given order and optimize the space complexity. This function is the final step, and an empty checkpoint list gives the first step. Aim for extra memory that does not grow with `m`.

### Function Signature

```python
def count_paths(n: int, m: int, checkpoints: list[list[int]]) -> int:
```

### Rules

- `checkpoints[i] = [r_i, c_i]` is a cell of the grid. A path visits a checkpoint when the checkpoint is one of the cells on the path, including the start and end cells.
- Every move advances exactly one column, so a path contains exactly one cell of each column.
- The path must visit checkpoint `i` before checkpoint `i + 1` for every `i`. Return `0` if no path does.
- When `m = 1`, the start and end are the same cell, and the only path makes no moves.

### Constraints

- `1 <= n <= 1000` and `1 <= m <= 1000`
- `0 <= len(checkpoints) <= 1000`
- `0 <= r_i < n` and `0 <= c_i < m`, and the checkpoint cells are distinct.
- The exact number of paths can have hundreds of digits, which is why the answer is taken modulo `1_000_000_007`. Each residue fits in a 32-bit signed integer, but a sum of three residues can exceed `2^31 - 1`.

### Examples

**Example 1**

```text
Input:  n = 3, m = 4, checkpoints = []
Output: 4
```

Writing a path as the row it occupies in each column, the paths are `2, 1, 1, 2`, `2, 1, 2, 2`, `2, 2, 1, 2` and `2, 2, 2, 2`.

**Example 2**

```text
Input:  n = 3, m = 4, checkpoints = [[1, 1], [2, 2]]
Output: 1
```

Only `2, 1, 2, 2` passes through `(1, 1)` and then `(2, 2)`.

**Example 3**

```text
Input:  n = 3, m = 4, checkpoints = [[2, 2], [1, 1]]
Output: 0
```

`(2, 2)` lies in a later column than `(1, 1)`, so no path can visit it first.

<details><summary>Hints (spoiler)</summary>

1. A path contains exactly one cell of each column. What does that say about the listed order of the checkpoints compared with their columns, or about two checkpoints in the same column?
2. Follow the interviewer's progression: solve the version with no checkpoints first, then ask how a checkpoint in a column limits which cells of that column a path may occupy.
3. Reduce modulo 1_000_000_007 as you go, and remember that adding three residues can exceed the 32-bit signed range.
</details>

<details><summary>Approach (spoiler)</summary>

Ordering check: every move advances exactly one column, so a path is a sequence of rows with one cell per column and can meet at most one cell of any column. The checkpoints can therefore be visited in the listed order only if their columns strictly increase; if some c_(i+1) <= c_i (which includes two distinct checkpoints sharing a column), no path qualifies and the answer is 0. When the columns do strictly increase, any path that passes through every checkpoint meets them in the listed order automatically, so the requirement becomes: in column c_i the path is in row r_i.

Column sweep: keep ways[r] = number of partial paths (modulo 1_000_000_007) that start at (n - 1, 0), stay in the grid, end at (r, c), and pass through every checkpoint whose column is <= c. For column 0, ways is 1 at row n - 1 and 0 elsewhere. A cell (r, c + 1) is entered from (r + 1, c) by an up-right move, from (r, c) by a right move, or from (r - 1, c) by a down-right move, skipping neighbours outside the grid, so new[r] = ways[r - 1] + ways[r] + ways[r + 1]. If the current column holds the next checkpoint (r_i, c_i), every row except r_i is reset to 0. The answer is ways[n - 1] after column m - 1.

Correctness: by induction on c, the three predecessor cells partition the in-grid paths into (r, c + 1) by their previous cell, so the sum counts exactly the extensions of valid partial paths, and the reset removes exactly the partial paths that miss the checkpoint of that column. Modular reduction commutes with these sums, so the final residue is the exact count modulo 1_000_000_007. Only two arrays of length n are kept, so extra memory does not grow with m.

Numeric range: each stored residue is below 1_000_000_007 and the returned value fits in a 32-bit int, but a sum of three residues can reach about 3 * 10^9 > 2^31 - 1, so Java and C++ accumulate in 64-bit types and reduce before storing.

Edge cases: m = 1 (no moves; the answer is 1 unless a checkpoint lies off (n - 1, 0)); n = 1 (only right moves); checkpoints on the start or end cell (always visited); an empty list (the plain path count); a checkpoint the start cannot reach, or from which the end cannot be reached, leaves every entry 0.

**Time:** O(n * m + k), where k = len(checkpoints) · **Space:** O(n)
</details>
