# Maximize coins collected by 3-step pieces
> Google · Onsite · medium · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/maximize-coins-collected-by-3-step-pieces

You are given a 1D board of length **N**. Each cell is in one of three states:

- **Empty**
- **Piece** (a movable token)
- **Coin** (collectible)

In one move, you may choose **any one piece** and move it **exactly 3 cells to the right** (from index `i` to `i+3`). The move rules are:

1. If the destination cell is **empty**, the piece moves there.
2. If the destination cell contains a **coin**, the piece moves there and you **collect** that coin (the coin is removed).
3. Pieces **cannot overlap**: a move is **not allowed** if the destination cell already contains another piece.
4. The piece may “jump over” intervening cells; only the destination cell matters.
5. A move is not allowed if `i+3` is outside the board.

You may perform moves in any order, for as many turns as you like, until **no piece can legally move**.

Return the **maximum number of coins** you can collect.

### Input
- A representation of the board (e.g., a string/array of length `N`) containing exactly one of `{empty, piece, coin}` per cell.

### Output
- An integer: the maximum number of coins collectible.

### Notes / Clarifications
- Multiple pieces may exist.
- Coins are collected at most once (they disappear after collection).
- The result depends on the order in which you choose moves.

<details><summary>Hints (spoiler)</summary>

1. A move always changes an index by +3, so a piece can only ever visit cells sharing its index's value mod 3. The three residue classes never interact - solve each independently and sum the results.
2. Compress one residue class into consecutive slots; a move becomes a single step to the right. Pieces preserve their order because they only move right and cannot overlap.
3. In a compressed line of length m with k pieces, the j-th piece (0-indexed from the left) can be pushed as far as slot m-1-(k-1-j) once the pieces to its right vacate the end. A coin is collectible iff some piece's start <= coin <= that piece's max reach.
</details>
