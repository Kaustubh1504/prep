# List All Nonattacking Queen Boards
> Google · Other · hard · Pattern: Backtracking
> Source: https://prachub.com/interview-questions/list-all-nonattacking-queen-boards

### Problem

Place `n` queens on an `n` by `n` chessboard so that no pair shares a row, column, or diagonal. Return every distinct valid board, without repeated configurations. The boards may appear in any order.

Represent each board as `n` strings of length `n`: `Q` marks a queen and `.` marks an empty square. Row and column positions within a board retain their spatial meaning.

```cpp
vector<vector<string>> solveNQueens(int n);
```

### Examples

```text
Input: n = 2
Output: []
```

Every way to put one queen in each row of a 2 by 2 board creates a column or diagonal attack.

```text
Input: n = 3
Output: []
```

There is also no valid placement of three queens on a 3 by 3 board.

### Constraints & Assumptions

- `1 <= n <= 9`.
- Return complete boards, not just a count or a single witness.
- Distinct reflected or rotated configurations count separately when their queen positions differ.
- Only the order of the returned boards is free; a board's strings describe its rows from top to bottom.

### Clarifying Questions to Ask

- What is returned when no arrangement exists? An empty collection.
- Are symmetric arrangements merged? No; different board configurations are distinct solutions.

```hint Check the output contract
All valid placements are required. A placement cannot be omitted merely because another is its reflection.
```

### What a Strong Answer Covers

- Row, column, and both diagonal attack conditions.
- Completeness and absence of duplicate boards.
- Board construction and an output-sensitive space/time account.

### Follow-up Questions

- How do the row and column coordinates determine whether two queens share a diagonal?
- How can the returned collection be checked without fixing the order of its boards?
