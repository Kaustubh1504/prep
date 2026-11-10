# Generate the First Rows of Pascal Coefficients
> Google · Other · easy · Pattern: Math / Number Theory
> Source: https://prachub.com/interview-questions/generate-the-first-rows-of-pascal-coefficients

### Problem

Return the first `numRows` rows of Pascal's triangle. The first row is `[1]`. Each later row starts and ends with 1, and every interior entry is the sum of the two entries immediately above it. Return rows from top to bottom, with entries in left-to-right order.

```cpp
vector<vector<int>> generate(int numRows);
```

### Examples

```text
Input: numRows = 4
Output: [[1],[1,1],[1,2,1],[1,3,3,1]]
```

```text
Input: numRows = 2
Output: [[1],[1,1]]
```

### Constraints

- `1 <= numRows <= 30`.
