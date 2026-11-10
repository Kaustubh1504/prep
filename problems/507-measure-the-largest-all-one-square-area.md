# Measure the Largest All-One Square Area
> Google · Other · medium · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/measure-the-largest-all-one-square-area

### Problem

Find the largest square whose cells are all character `'1'` in a rectangular binary matrix, and return its area. Cells containing character `'0'` cannot belong to the square. Return 0 when there is no all-one square.

```cpp
int maximalSquare(vector<vector<char>>& matrix);
```

Quoted rows abbreviate character rows; this is not an integer-cell matrix API.

### Examples

```text
Input rows: ["1110","1110","1111"]
Output: 9
```

```text
Input rows: ["01","10"]
Output: 1
```

### Constraints

- Both dimensions are between 1 and 300.
- Every cell is character `'0'` or `'1'`.
