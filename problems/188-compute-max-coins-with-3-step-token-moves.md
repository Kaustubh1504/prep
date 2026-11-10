# Compute max coins with 3-step token moves
> Google · Online Assessment · easy · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/compute-max-coins-with-3-step-token-moves

You are given a one-dimensional board with **n** positions represented by a string `s` of length `n`:

- `.` = empty cell
- `T` = token
- `C` = coin

You may move tokens any number of times under these rules:

1. A move selects one token and moves it **exactly 3 positions to the right** (from index `i` to `i+3`).
2. A token **cannot** move if `i+3` is outside the board.
3. A token **cannot** land on a cell currently occupied by another token (`T`).
4. If a token lands on a coin (`C`), that coin is collected (removed) and cannot be collected again.

Your task is to compute the **maximum number of coins** that can be collected by choosing an optimal sequence of moves.

**Input:** `s` (string of length `n`, consisting only of `.`, `T`, `C`)

**Output:** An integer = maximum coins collectible.

**Notes / clarifications:**
- Tokens can be moved in any order.
- A token may move multiple times.
- Coins are only collected when a token *lands* on them (not when jumping over them).

<details><summary>Hints (spoiler)</summary>

1. Every move changes a token's index by exactly +3, so a token can only ever reach cells with the same value of (index mod 3). Coins are therefore reachable only by tokens in the same residue class — split the board into three independent sub-problems.
2. Within one residue class, a token sweeping right lands on every cell it passes, so moving it further right can only collect more coins. The only limit is that a token cannot land on another token, so tokens keep their relative order.
3. Process the tokens of a residue class from rightmost to leftmost: the rightmost may sweep to the last cell of its residue, and each subsequent (more-left) token may sweep up to just before where the token on its right stopped. Count the distinct coins covered.
</details>
