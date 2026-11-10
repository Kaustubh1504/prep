# Complete a Uniquely Solvable Sudoku Board in Place
> Google · Other · hard · Pattern: Backtracking, Two Pointers
> Source: https://prachub.com/interview-questions/complete-a-uniquely-solvable-sudoku-board-in-place

### Problem

Complete the empty cells of a 9-by-9 Sudoku board. Each row, each column, and each of the nine 3-by-3 boxes must contain every digit from 1 through 9 exactly once. A period `'.'` marks an unfilled cell; existing digits must remain in place. The given board has exactly one solution.

Change the supplied character matrix through this original interface; the function returns nothing:

```cpp
void solveSudoku(vector<vector<char>>& board);
```

In the examples, each quoted row is shorthand for nine character cells of the matrix.

### Examples

```text
Input rows:
.23456789
4.6789123
78.123456
234.67891
5678.1234
89123.567
345678.12
6789123.5
91234567.
Rows after the call:
123456789
456789123
789123456
234567891
567891234
891234567
345678912
678912345
912345678
```

Every row of this input has only its diagonal cell missing, so its missing digit is forced.

```text
Input rows:
123456789
456789123
789123456
234567891
567891234
891234567
345678912
678912345
912345678
Rows after the call: unchanged
```

### Constraints

- The board has exactly 9 rows, each containing 9 cells.
- Every cell is a digit character or `'.'`.
- The input has exactly one valid completion.
