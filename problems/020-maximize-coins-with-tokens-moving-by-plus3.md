# Maximize coins with tokens moving by +3
> Google · Online Assessment · easy · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/maximize-coins-with-tokens-moving-by-plus3

You are given a 1D board represented by a string `s` of length `n`. Each character is one of:

- `'.'` — an empty cell
- `'C'` — a cell containing exactly one coin
- `'T'` — a cell containing one of the player's tokens (there may be several tokens)

The player controls all tokens. Movement and scoring work as follows:

- A token may be moved any number of times, in any order.
- A single move sends a token **exactly 3 cells to the right**: from index `i` to index `i + 3`. No other distance is allowed, and tokens may never move left.
- A move is **invalid** if the destination cell is currently occupied by another token. A move that would land past the end of the board is also invalid (tokens never leave the board).
- When a token **lands** on a cell containing an as-yet-uncollected coin, that coin is collected and then disappears. Each coin is collected at most once.
- Only the **landing** cell counts. Coins on cells a token passes "over" mid-flight are **not** collected — but note a single move advances 3 cells at once, so a token does not actually visit the two cells in between.

**Task:** Return the **maximum number of coins** the player can collect over any optimal sequence of moves.

```hint Where to start
A token at index $i$ can only ever sit on indices $i, i+3, i+6, \dots$ — every reachable cell has the **same index modulo 3**. What does that imply about which tokens and coins can possibly interact?
```

```hint Decompose
Partition the board by index $\bmod\ 3$ into three independent sub-boards. Solve each one in isolation and sum the results, because a token can never change its residue class or reach a cell in another class.
```

```hint Within one residue class
Collapse a residue class into a chain (its cells in left-to-right order). In the chain, "advance by one step" right-only. Because tokens move right-only and can't share a cell, they can never cross — their left-to-right order is fixed. What is the largest set of coins they can collectively land on?
```

### Constraints & Assumptions

- $1 \le n \le 100$.
- Each cell is exactly one of `'.'`, `'C'`, `'T'`; a coin and a token never start on the same cell, so no coin is "pre-collected."
- Tokens are interchangeable except for the rule that two tokens cannot occupy the same cell at the same time.
- The board is static apart from token moves; no new coins or tokens appear.

### Clarifying Questions to Ask

- Can two tokens occupy the same cell, even momentarily? (No — that makes the move invalid.)
- Is the order of moves across tokens free, or must each token finish before the next starts? (Moves may be freely interleaved.)
- Are coins consumed permanently once landed on, or can they regenerate? (Collected once, then gone.)
- Does a coin sitting under the cell a token *jumps over* get collected? (No — only the landing cell.)
- Can a token start on a coin? (No — input format guarantees one symbol per cell.)

### What a Strong Answer Covers

- **The mod-3 insight:** recognizing that a token's reachable cells share a residue class, so the board splits into three fully independent sub-problems whose answers sum.
- **Reduction within a class:** mapping each residue class to a left-to-right chain and arguing that right-only, non-crossing motion lets tokens collect every coin at or to the right of the **leftmost** token in that chain.
- **A correctness argument** that the collision constraint never blocks a reachable coin (e.g. a right-to-left serialization, or "the leftmost token alone could sweep the whole chain"), and that coins strictly left of every token are unreachable.
- **An $O(n)$ time, $O(1)$ space** implementation, plus edge cases: no tokens, no coins, multiple tokens per class, coins on both sides of a token, and small $n$.
- Awareness that naive framings (one global sweep ignoring mod 3, or a heavyweight matching/DP) are either wrong or unnecessary.

### Follow-up Questions

- How does the answer change if a move advanced by $k$ cells instead of 3? (The board splits into $k$ classes; everything else generalizes.)
- Suppose coins had **values** and you wanted to maximize total value rather than count — does the same greedy still hold?
- What if tokens could also move **left** by 3? How does reachability and the non-crossing argument change?
- If you additionally had to report *one* concrete optimal move sequence (not just the count), how would you construct it, and what is its length bound?

<details><summary>Hints (spoiler)</summary>

1. A token moving by +3 always stays in the same index modulo 3 class.
2. Within one modulo class, only coins to the right of the leftmost token in that class can be collected.
</details>
