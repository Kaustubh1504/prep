# Simulate In-Place Cellular State Updates
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · hard · Pattern: Two Pointers

## Problem
You get an `m x n` grid `board`. Each cell is either live (`1`) or dead (`0`). Advance the board by **exactly one generation**, following Conway's Game of Life rules. Each cell looks at its 8 neighbours (horizontal, vertical and diagonal). Cells outside the grid count as dead.

1. A live cell with fewer than 2 live neighbours dies.
2. A live cell with 2 or 3 live neighbours stays alive.
3. A live cell with more than 3 live neighbours dies.
4. A dead cell with exactly 3 live neighbours becomes live.

All cells update **at the same time**: every cell's next state depends only on the current generation. Change `board` **in place** using O(1) extra space. You may not allocate a copy of the grid. The function returns nothing.

Follow-up for discussion: how would you handle an unbounded (infinite) board, or a board too large to fit in memory?

## Function signature
```python
def game_of_life(board: list[list[int]]) -> None:
```

## Constraints
- `1 <= m, n <= 500`
- `board[i][j]` is `0` or `1`
- Extra space must be O(1). Only one generation is simulated.

## Examples
**Example 1**
Input: `board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]`
Output (board after the call): `[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]`

**Example 2**
Input: `board = [[0,1,0],[0,1,0],[0,1,0]]`
Output: `[[0,0,0],[1,1,1],[0,0,0]]`
Explanation: A vertical "blinker" turns horizontal. The middle cell has 2 neighbours and survives. The two end cells have 1 each and die. The cells to the left and right of the middle have 3 each and are born.

**Example 3** (an edge case)
Input: `board = [[1,1],[1,0]]`
Output: `[[1,1],[1,1]]`
Explanation: The dead corner has exactly 3 live neighbours, so it is born. Each live cell has 2 neighbours and survives. A `1x1` board `[[1]]` becomes `[[0]]`.

<details><summary>Approach (spoiler)</summary>

Store both generations inside each cell using two bits. Bit 0 holds the current state and bit 1 holds the next state. In the first pass, count live neighbours by reading only bit 0 (`cell & 1`), so cells already updated in this pass don't affect the count. Set bit 1 when the cell will be alive next generation. In the second pass, shift every cell right by one bit so the next state becomes the current one. This gives the simultaneous update with O(1) extra memory.
**Time:** O(m·n) · **Space:** O(1)

```python
def game_of_life(board: list[list[int]]) -> None:
    if not board or not board[0]:
        return
    R, C = len(board), len(board[0])
    for r in range(R):
        for c in range(C):
            live = 0
            for dr in (-1, 0, 1):
                for dc in (-1, 0, 1):
                    if dr == dc == 0:
                        continue
                    rr, cc = r + dr, c + dc
                    if 0 <= rr < R and 0 <= cc < C and board[rr][cc] & 1:
                        live += 1
            if board[r][c] & 1:
                if live in (2, 3):
                    board[r][c] |= 2      # survives
            elif live == 3:
                board[r][c] |= 2          # born
    for r in range(R):
        for c in range(C):
            board[r][c] >>= 1
```
</details>
