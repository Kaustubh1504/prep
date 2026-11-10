# Read a Matrix Along Its Inward Spiral
> Google · Other · medium · Pattern: Simulation
> Source: https://prachub.com/interview-questions/read-a-matrix-along-its-inward-spiral

### Problem

Return the entries of a rectangular matrix in clockwise spiral order: begin at its top-left cell, move across the top toward the right, then down the right edge, across the bottom toward the left, and up the left edge, continuing inward. Include each cell exactly once.

```cpp
vector<int> spiralOrder(vector<vector<int>>& matrix);
```

### Examples

```text
Input: matrix = [[2,4,6],[8,10,12]]
Output: [2,4,6,12,10,8]
```

```text
Input: matrix = [[-1],[0],[3]]
Output: [-1,0,3]
```

### Constraints

- The matrix has `m` rows and `n` columns, with every row the same length.
- `1 <= m,n <= 10`.
- Each entry is between -100 and 100, inclusive.
- Return a flat sequence in the specified traversal order.
