# Determine winner in stack-merging game
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · hard · Pattern: Simulation

## Problem
The game starts with `n` stacks, each holding one block. Block `i` has colour `colors[i]`. Two players take turns, and the first player moves first. On a turn, a player chooses two different stacks `A` and `B` that satisfy **at least one** of these conditions:
- the top blocks of `A` and `B` have the **same colour**, or
- `A` and `B` have the **same height** (number of blocks).

The player then puts one of the two stacks on top of the other, choosing which one goes on top. This creates a single stack whose height is `height(A) + height(B)` and whose top colour is the top colour of the stack placed on top.

A player who cannot make a legal move **loses**. Both players play optimally. Return `True` if the first player wins, and `False` otherwise.

Only each stack's (top colour, height) matters for future moves, and the order of the stacks doesn't matter. So the game state can be stored as a sorted multiset of `(colour, height)` pairs. The game always ends, because every move reduces the number of stacks by one.

## Function signature
```python
def first_player_wins(colors: list[str]) -> bool:
```

## Constraints
- `0 <= len(colors) <= 10`
- Each colour is a short string (for example `"R"`)

## Examples
**Example 1**
Input: `colors = ["R", "G", "B"]`
Output: `True`
Explanation: All stacks have height 1, so the first player may merge R and G, giving a stack of height 2 with top R or G. The opponent is left with a height-2 stack and the height-1 stack B. They differ in colour and in height, so the opponent has no move and loses.

**Example 2**
Input: `colors = ["R", "G", "B", "Y", "P", "O"]`
Output: `False`

**Example 3**
Input: `colors = ["R", "R", "R", "G", "G", "B"]`
Output: `False`

**Example 4** (an edge case)
Input: `colors = ["R"]`
Output: `False`
Explanation: With one stack (or none), the first player has no move. With exactly two stacks, for example `["R", "G"]`, the first player always wins, since both stacks have height 1.

<details><summary>Approach (spoiler)</summary>

This is a finite impartial game, so do a minimax search with memoisation over canonical states. Store a state as a sorted tuple of `(top_colour, height)`, so that equivalent positions share one cache entry. A position is winning if some legal move (a pair of stacks plus a choice of which goes on top) leads to a losing position for the opponent. It is losing if no move exists or if every move leads to a winning position. Canonicalising the state and using the cache collapse the n!-sized move tree to the number of distinct multisets, which is small for n ≤ 10.
**Time:** O(S · n²) where S is the number of distinct reachable states · **Space:** O(S)

```python
from functools import lru_cache
def first_player_wins(colors):
    @lru_cache(maxsize=None)
    def win(state):
        n = len(state)
        for i in range(n):
            c1, h1 = state[i]
            for j in range(i + 1, n):
                c2, h2 = state[j]
                if c1 != c2 and h1 != h2:
                    continue
                rest = state[:i] + state[i+1:j] + state[j+1:]
                for top in {c1, c2}:
                    nxt = tuple(sorted(rest + ((top, h1 + h2),)))
                    if not win(nxt):
                        return True
        return False
    return win(tuple(sorted((c, 1) for c in colors)))
```
</details>
