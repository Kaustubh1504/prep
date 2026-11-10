# Answer Immutable Rectangle Sums in Constant Query Time
> Google · Other · medium · Pattern: Prefix Sum, Design / Data Structure
> Source: https://prachub.com/interview-questions/answer-immutable-rectangle-sums-in-constant-query-time

### Problem

Implement NumMatrix(matrix) and sumRegion(row1,col1,row2,col2). Return the sum inside the rectangle including both its upper-left and lower-right corners. The source requires O(1) time per sumRegion call; keep the original stateful methods.

```cpp
class NumMatrix {
public:
    NumMatrix(vector<vector<int>>& matrix);
    int sumRegion(int row1, int col1, int row2, int col2);
};
```

### Examples

```text
NumMatrix([[1,2,3],[4,5,6]]); sumRegion(0,1,1,2) -> 16; sumRegion(1,0,1,1) -> 9
NumMatrix([[-2]]); sumRegion(0,0,0,0) -> -2
```

### Constraints

- Both dimensions are 1 through 200; entries lie in [-10000,10000].
- 0 <= row1 <= row2 < m and 0 <= col1 <= col2 < n.
- At most 10000 sumRegion queries occur.
