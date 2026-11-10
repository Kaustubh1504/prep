# Reshape a Matrix while Preserving Row Order
> Google · Other · easy · Pattern: Design / Data Structure
> Source: https://prachub.com/interview-questions/reshape-a-matrix-while-preserving-row-order

### Problem

Return mat reshaped to r rows and c columns, retaining its original row-by-row sequence. If the new dimensions do not contain exactly the same number of elements, return the original matrix unchanged.

```cpp
class Solution {
public:
    vector<vector<int>> matrixReshape(vector<vector<int>>& mat, int r, int c);
};
```

### Examples

**Example 1:**

```text
mat = [[5,6,7],[8,9,10]], r = 3, c = 2
Output: [[5,6],[7,8],[9,10]]
Explanation: The row-major sequence is preserved.
```

**Example 2:**

```text
mat = [[2,4,6]], r = 2, c = 2
Output: [[2,4,6]]
Explanation: Three values cannot fill four positions.
```

### Constraints

- Source matrix: m rows of n entries, with both dimensions in 1..100. Values are in -1000..1000. Requested r and c are each in 1..300.

### Clarifying Questions

Preserve traversal order and return the original matrix on a count mismatch.

```hint Read the boundary condition
How can one flattened position be converted into either shape's row and column?
```

### Contract considerations

Preserve traversal order and return the original matrix on a count mismatch.
