# Maximize coins collected by tokens jumping +3
> Google · Online Assessment · medium · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/maximize-coins-collected-by-tokens-jumping-plus3

You are given a single-player board game represented by a string `board` of length `N` (1 ≤ N ≤ 100). Each character is one of:
- `'.'`: empty cell
- `'T'`: a player token (there may be multiple tokens)
- `'C'`: a coin

A move consists of selecting one token and moving it **exactly 3 positions to the right** (from index `i` to `i+3`). The token does not interact with intermediate cells.

Rules:
- A move is only allowed if `i+3 < N`.
- A move is **not** allowed if the destination cell currently contains another token (`'T'`).
- If a token lands on a cell containing a coin (`'C'`), that coin is collected and removed (each coin can be collected at most once).
- Tokens can be moved multiple times.

Task: Return the **maximum number of coins** that can be collected.

Function signature:
```python
def solution(board: str) -> int:
    ...
```

Examples:
- `board = "TT.T.CCCCC"` → `3`
- `board = "T...CCCC"` → `1`
- `board = "C..TT.CT.C"` → `2`

<details><summary>Hints (spoiler)</summary>

1. A token that starts at index `i` can only ever visit positions with the same value of `index % 3`.
2. For each modulo-3 lane, think about which coins are impossible to reach and which ones will definitely be visited once there is at least one token before them.
</details>
