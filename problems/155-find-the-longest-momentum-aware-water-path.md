# Find the Longest Momentum-Aware Water Path
> Google · Onsite · medium · Pattern: Dynamic Programming, Bit Manipulation, Graph BFS / DFS
> Source: https://prachub.com/interview-questions/find-the-longest-momentum-aware-water-path

# Find the Longest Momentum-Aware Water Path

Given an `m × n` integer height grid, find the maximum number of cells in a valid path.

A path may start at any cell, uses only up/down/left/right moves, and may not visit a cell more than once. Let consecutive path heights be `..., a, b, c`, where `b` is the current cell and `c` is the proposed next cell. The move from `b` to `c` is valid when either:

- `c <= b`, so water moves to an equal or lower height; or
- `c > b` and `a >= c`, so the height from two path positions ago supplies enough momentum.

The first move has no height two positions ago and therefore must go to an equal or lower cell. A one-cell path is valid.

Implement:

```python
def solve(heights: list[list[int]]) -> int:
    ...
```

## Constraints

- `1 <= m, n <= 4`
- `m * n <= 15`
- `-10^9 <= heights[r][c] <= 10^9`

## Example

```text
heights = [[5, 1, 4]]
result = 3
```

The path `5 -> 1 -> 4` is valid because the last uphill step can use the earlier height `5`.

<details><summary>Hints (spoiler)</summary>

1. A state needs the visited mask, the current cell, and the preceding cell that supplies possible momentum.
2. Memoize the best suffix length for each state; the 15-cell bound makes bitmasks practical.
</details>

<details><summary>Approach (spoiler)</summary>

Number the cells and encode the no-revisit set as a bitmask. DFS tries every valid neighbor. The immediately preceding cell determines whether an uphill step from the current cell has enough momentum, so (previous, current, visited) completely describes future choices. Memoizing this state avoids recomputing identical suffixes, and trying every cell as the start handles the unrestricted starting point.

**Time:** O(2^v * v^2) states and transitions in the worst case, where v <= 15. · **Space:** O(2^v * v^2) for memoization plus O(v) recursion depth.
</details>
