# Implement Multi-Player Tic-Tac-Toe
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Design / Data Structure, Simulation

## Problem
Implement a Tic-Tac-Toe engine for **`k >= 2` players** on a configurable `rows x cols` board.

**Rules**
- Players are numbered `0 .. k-1`. Player `0` moves first, then turns rotate strictly `0, 1, ..., k-1, 0, ...`.
- A move `(player, row, col)` places that player's mark on an empty cell.
- **Win condition:** a player wins as soon as their move creates a line of **at least 3** of their own marks in consecutive cells horizontally, vertically or on either diagonal. Longer runs (4, 5, ...) also count — the move that extends a run to 3 or more wins. The `3` is a fixed default but must be configurable (`win_length`) as an extension.
- **Draw:** if the board becomes full without a win, the game is a draw.

**Status behaviour of `move`** — it returns exactly one of:
- `"INVALID"` — the game is already over (won or drawn), it is not this player's turn, the cell is out of bounds, or the cell is occupied. An invalid move changes **nothing** (board, turn and status stay the same).
- `"WIN"` — the move is valid and wins; the game ends and `winner` is set.
- `"DRAW"` — the move is valid, fills the board and does not win.
- `"OK"` — otherwise; the turn passes to the next player.

**Extensions**
- `undo()` reverts the most recent valid move (including a winning or drawing move, which reopens the game) and gives the turn back to the player who made it. Returns `False` if there is nothing to undo.
- `replay(rows, cols, k, moves)` creates a fresh game, applies a list of moves and returns the list of statuses.
- Boards can be very large (e.g. `10^9 x 10^9`), so storage must be proportional to the number of moves, not the board area, and each move must be checked in time independent of the board size.

Public state: `status` (`"IN_PROGRESS"`, `"WIN"` or `"DRAW"`), `winner` (player or `None`) and `current_player`.

## Function signature
```python
from typing import List, Optional, Tuple

class TicTacToe:
    def __init__(self, rows: int, cols: int, num_players: int, win_length: int = 3): ...
    def move(self, player: int, row: int, col: int) -> str: ...
    def undo(self) -> bool: ...
    @classmethod
    def replay(cls, rows: int, cols: int, num_players: int,
               moves: List[Tuple[int, int, int]], win_length: int = 3) -> List[str]: ...
```

## Constraints
- `1 <= rows, cols <= 10^9`; `2 <= num_players <= 100`; `1 <= win_length <= 100`
- Up to `10^5` calls to `move` / `undo`
- Invalid configuration (non-positive sizes, fewer than 2 players) raises `ValueError`

## Examples
**Example 1** (three players)
Input: `replay(4, 4, 3, [(0,0,0),(1,1,0),(2,2,0),(0,0,1),(1,1,1),(2,2,1),(0,0,2),(1,3,3)])`
Output: `["OK","OK","OK","OK","OK","OK","WIN","INVALID"]`
Explanation: Player 0 completes `(0,0),(0,1),(0,2)` on their third move. Any move after the win is invalid.

**Example 2** (invalid moves change nothing)
Input: `replay(3, 3, 2, [(0,0,0),(0,1,1),(1,1,1),(0,5,5),(0,1,1),(0,0,1),(1,2,2)])`
Output: `["OK","INVALID","OK","INVALID","INVALID","OK","OK"]`
Explanation: Player 0 moving twice in a row is rejected; `(5,5)` is out of bounds; `(1,1)` is occupied. After each rejection it is still the same player's turn.

**Example 3** (longer run, then undo)
Input: on a `5 x 5` board with 2 players: `(0,0,0),(1,4,4),(0,0,1),(1,4,3),(0,0,3),(1,3,0),(0,0,2)`; then `undo()`, then `move(0,2,2)`
Output: `["OK","OK","OK","OK","OK","OK","WIN"]`, winner `0`; `undo()` → `True`, status back to `"IN_PROGRESS"` with `current_player == 0`; `move(0,2,2)` → `"OK"` and the turn passes to player 1
Explanation: The final move fills the gap at `(0,2)`, creating a run of four, which counts as a win.

**Example 4** (draw / edge case)
Input: a `1 x 3` board with 3 players: `move(0,0,0)`, `move(1,0,1)`, `move(2,0,2)`, `move(0,0,0)`
Output: `"OK","OK","DRAW","INVALID"`
Explanation: Nobody can line up three of their own marks; the board fills on the third move, and the game is over afterwards.

<details><summary>Approach (spoiler)</summary>

Store marks in a hash map keyed by `(row, col)` so memory is O(moves) even on gigantic boards, and keep a move history stack for `undo`. Validate a move in a fixed order (game over → turn → bounds → occupied) and return `"INVALID"` before mutating anything. A new mark can only create a line through itself, so after placing it count matching marks outward in both directions along each of the 4 axes, stopping once `win_length` is reached — O(win_length) per move regardless of board size. The draw check compares the number of marks to `rows * cols`. `undo` pops the history, clears the cell, and restores the turn and in-progress status (a valid move before it was necessarily non-terminal).
**Time:** O(win_length) per move, O(1) per undo · **Space:** O(moves)

```python
from typing import Dict, List, Optional, Tuple

class TicTacToe:
    IN_PROGRESS, WIN, DRAW, OK, INVALID = "IN_PROGRESS", "WIN", "DRAW", "OK", "INVALID"
    DIRECTIONS = ((0, 1), (1, 0), (1, 1), (1, -1))

    def __init__(self, rows: int, cols: int, num_players: int, win_length: int = 3):
        if rows < 1 or cols < 1 or num_players < 2 or win_length < 1:
            raise ValueError("invalid configuration")
        self.rows, self.cols = rows, cols
        self.num_players, self.win_length = num_players, win_length
        self.board: Dict[Tuple[int, int], int] = {}      # sparse: fine for huge boards
        self.history: List[Tuple[int, int, int]] = []    # (player, row, col)
        self.current_player = 0
        self.status = self.IN_PROGRESS
        self.winner: Optional[int] = None

    def move(self, player: int, row: int, col: int) -> str:
        if (self.status != self.IN_PROGRESS or player != self.current_player
                or not (0 <= row < self.rows and 0 <= col < self.cols)
                or (row, col) in self.board):
            return self.INVALID
        self.board[(row, col)] = player
        self.history.append((player, row, col))
        if self._wins(player, row, col):
            self.status, self.winner = self.WIN, player
            return self.WIN
        if len(self.board) == self.rows * self.cols:
            self.status = self.DRAW
            return self.DRAW
        self.current_player = (player + 1) % self.num_players
        return self.OK

    def _wins(self, player: int, row: int, col: int) -> bool:
        for dr, dc in self.DIRECTIONS:
            run = 1
            for sign in (1, -1):
                r, c = row + sign * dr, col + sign * dc
                while run < self.win_length and self.board.get((r, c)) == player:
                    run += 1
                    r, c = r + sign * dr, c + sign * dc
            if run >= self.win_length:
                return True
        return False

    def undo(self) -> bool:
        if not self.history:
            return False
        player, row, col = self.history.pop()
        del self.board[(row, col)]
        self.current_player = player
        self.status, self.winner = self.IN_PROGRESS, None
        return True

    @classmethod
    def replay(cls, rows: int, cols: int, num_players: int,
               moves: List[Tuple[int, int, int]], win_length: int = 3) -> List[str]:
        game = cls(rows, cols, num_players, win_length)
        return [game.move(p, r, c) for p, r, c in moves]
```
</details>
