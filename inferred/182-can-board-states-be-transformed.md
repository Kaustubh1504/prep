# Can board states be transformed?
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Two Pointers, String Processing

## Problem
A one-dimensional board is a string of `'L'`, `'R'` and `'_'` characters, where `'_'` is an empty cell. You are given a `start` board and a `target` board. Pieces move one cell at a time into an adjacent empty cell. Pieces cannot jump over each other or share a cell.

**Part 1 (main question): directional pieces.** An `'L'` piece can only move **left**, and an `'R'` piece can only move **right**. Return `True` if `start` can be turned into `target` by any number of moves, including zero. (This matches LeetCode 2337, "Move Pieces to Obtain a String".)

**Part 2 (follow-up): free pieces.** Now any piece can slide left **or** right into an adjacent empty cell, but pieces still cannot pass each other. Return whether `start` can be turned into `target`.

If the two boards have different lengths, return `False`.

## Function signature
```python
def can_transform(start: str, target: str) -> bool: ...        # Part 1
def can_transform_free(start: str, target: str) -> bool: ...   # Part 2
```

## Constraints
- `0 <= len(start), len(target) <= 10^5`
- Boards contain only `'L'`, `'R'`, `'_'`
- Target: O(n) time, O(1) extra space

## Examples
**Example 1**
Input: `start = "_L__R__R_"`, `target = "L______RR"`
Output: Part 1 `True`, Part 2 `True`
Explanation: Move the `L` one cell left, the first `R` three cells right and the second `R` one cell right.

**Example 2** (pieces cannot pass each other)
Input: `start = "R_L_"`, `target = "__LR"`
Output: Part 1 `False`, Part 2 `False`
Explanation: The pieces appear in the order `R, L` in `start` but `L, R` in `target`. No move ever changes that order.

**Example 3** (wrong direction)
Input: `start = "_L___"`, `target = "___L_"`
Output: Part 1 `False`, Part 2 `True`
Explanation: Under Part 1 the `L` would have to move right, which isn't allowed. Under Part 2 it can.

Input: `start = "_R"`, `target = "R_"`
Output: Part 1 `False`, Part 2 `True`

<details><summary>Approach (spoiler)</summary>

There are two invariants. First, pieces never pass each other, so the string with all `'_'` removed must be identical in `start` and `target`; that check alone is all of Part 2. Second, for Part 1, pair up the pieces in order with two pointers that skip blanks. The k-th piece must have the same letter on both boards. An `L` may only end up at the same index or further left (`i >= j`), and an `R` at the same index or further right (`i <= j`). Together these conditions are also sufficient: the pieces can be moved one by one, `L`s from the left and `R`s from the right, without blocking each other.

**Time:** O(n) · **Space:** O(1)

```python
def can_transform(start: str, target: str) -> bool:
    if len(start) != len(target):
        return False
    n, i, j = len(start), 0, 0
    while True:
        while i < n and start[i] == '_':
            i += 1
        while j < n and target[j] == '_':
            j += 1
        if i == n or j == n:
            return i == n and j == n
        if start[i] != target[j]:
            return False
        if start[i] == 'L' and i < j:
            return False
        if start[i] == 'R' and i > j:
            return False
        i += 1
        j += 1

def can_transform_free(start: str, target: str) -> bool:
    return len(start) == len(target) and start.replace('_', '') == target.replace('_', '')
```
</details>
