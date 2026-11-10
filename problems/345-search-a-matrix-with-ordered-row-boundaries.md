# Search a Matrix with Ordered Row Boundaries
> Google · Other · medium · Pattern: Binary Search
> Source: https://prachub.com/interview-questions/search-a-matrix-with-ordered-row-boundaries

### Problem

The rectangular integer matrix `table` has these ordering properties:

- Each row is non-decreasing from left to right.
- The first entry of every row after the first is strictly larger than the final entry of the preceding row.

Given an integer `key`, return `true` if it occurs anywhere in `table`, and return `false` otherwise.

Your solution must run in `O(log(rows * columns))` time, where `rows` and `columns` are the matrix dimensions.

### Examples

**Example 1**

```text
Input: table = [[-5,-5,1],[4,6,8]], key = -5
Output: true
```

The key appears in the first row. Repeated values within one row are permitted.

**Example 2**

```text
Input: table = [[0,2],[5,9]], key = 4
Output: false
```

None of the matrix entries equals the key.

### Constraints

- The number of rows and the number of columns are each between `1` and `100`, inclusive.
- Every row has equal length and obeys the stated ordering rules.
- Every entry of `table`, and `key`, lies between `-10^4` and `10^4`, inclusive.
