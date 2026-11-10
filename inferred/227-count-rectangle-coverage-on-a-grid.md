# Count Rectangle Coverage on a Grid
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Easy · Pattern: Prefix Sum

## Problem
You are given an `n x n` grid that starts with every cell at 0, and a list of rectangles. Each rectangle is `[r1, c1, r2, c2]` with `0 <= r1 <= r2 < n` and `0 <= c1 <= c2 < n`. It adds 1 to every cell `(r, c)` with `r1 <= r <= r2` and `c1 <= c <= c2`, so both corners are **inclusive**. Return the final `n x n` grid of coverage counts.

Requirements:
- The same rectangle can appear several times, and each copy counts.
- Rectangles can touch the grid edges (`r2 = n-1` or `c2 = n-1`).
- With an empty `rectangles` list, return an all-zero grid. With `n = 0`, return `[]`.
- Don't modify the input list.
- Painting each rectangle cell by cell costs O(q·n²). Aim for O(n² + q).

*Follow-up discussion:* if coordinates were huge (say up to `10^9`) but only a few cells were queried, how would you adapt? Possible answers: coordinate-compress the rectangle edges and build the difference array on the compressed grid, or answer each point query by counting the rectangles that contain it, with a sweep plus a Fenwick tree.

## Function signature
```python
def range_add_counts(n: int, rectangles: list[list[int]]) -> list[list[int]]:
```

## Constraints
- `0 <= n <= 1000`
- `0 <= len(rectangles) <= 10^5`
- Coordinates are valid and inclusive as described

## Examples
**Example 1**
Input: `n = 3`, `rectangles = [[0,0,1,1],[1,1,2,2]]`
Output: `[[1,1,0],[1,2,1],[0,1,1]]`
Explanation: Only the centre cell `(1,1)` is inside both rectangles.

**Example 2** (duplicate updates and edge coordinates)
Input: `n = 2`, `rectangles = [[0,0,1,1],[0,0,1,1],[1,1,1,1]]`
Output: `[[2,2],[2,3]]`

**Example 3** (empty input)
Input: `n = 3`, `rectangles = []`
Output: `[[0,0,0],[0,0,0],[0,0,0]]`

Input: `n = 0`, `rectangles = []`
Output: `[]`

<details><summary>Approach (spoiler)</summary>

Use a 2D difference array of size `(n+1) x (n+1)`, where the extra row and column absorb the updates at `r2+1` and `c2+1` for rectangles that touch the edge. Record each rectangle with four O(1) updates: `+1` at `(r1,c1)`, `-1` at `(r1,c2+1)`, `-1` at `(r2+1,c1)` and `+1` at `(r2+1,c2+1)`. Then take the 2D prefix sum, `out[r][c] = diff[r][c] + out[r-1][c] + out[r][c-1] - out[r-1][c-1]`, to get each cell's count. The input list is only read, never changed.

**Time:** O(n² + q) · **Space:** O(n²)

```python
def range_add_counts(n, rectangles):
    diff = [[0] * (n + 1) for _ in range(n + 1)]
    for r1, c1, r2, c2 in rectangles:
        diff[r1][c1] += 1
        diff[r1][c2 + 1] -= 1
        diff[r2 + 1][c1] -= 1
        diff[r2 + 1][c2 + 1] += 1
    out = [[0] * n for _ in range(n)]
    for r in range(n):
        for c in range(n):
            v = diff[r][c]
            if r:
                v += out[r - 1][c]
            if c:
                v += out[r][c - 1]
            if r and c:
                v -= out[r - 1][c - 1]
            out[r][c] = v
    return out
```
</details>
