# Design Tic-Tac-Toe With K Players
> Google · Technical Screen · medium · Pattern: Design / Data Structure
> Source: https://prachub.com/interview-questions/design-tic-tac-toe-with-k-players

Design and implement a Tic-Tac-Toe game engine.

You are given:
- `k` players, each with a unique player ID or mark.
- An `n x n` board, initially empty.
- Players take turns placing their own mark on an empty cell.

Unlike classic Tic-Tac-Toe, a player wins as soon as they form **3 consecutive marks** in a straight line, regardless of how large `n` is. A straight line may be horizontal, vertical, diagonal down-right, or diagonal down-left.

Implement a class or set of functions that supports making moves and returns the game status after each move, such as:
- `"Game Over"` if a move is attempted after the game has ended.
- `"<player> won"` when the latest move causes that player to have 3 consecutive marks.
- A non-terminal status such as `"Continue"` if the game should keep going.

Your implementation should handle invalid moves, such as placing a mark outside the board or on an occupied cell. Discuss the time and space complexity of your approach, especially for large `n`.

<details><summary>Hints (spoiler)</summary>

1. Only the latest valid move can create a new 3-in-a-row, so you never need to rescan the entire board.
2. For large boards, store only occupied cells in a hash map keyed by (row, col), then check the 4 line directions around the new move.
</details>
