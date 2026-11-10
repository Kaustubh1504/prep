# Determine All Players with Fixed Rankings
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Medium · Pattern: Graph BFS / DFS

## Problem
There are `n` players, numbered `0` to `n-1`, and each has a distinct skill level. A match is always won by the more skilled player. You are given the results of some matches as two parallel arrays: in match `i`, player `winners[i]` beat player `losers[i]`. The results are consistent, meaning there are no cycles. Not every pair of players has played.

Win relations are transitive: if A beat B and B beat C, then A is ranked above C. A player's **rank is fixed** when the results determine their exact position in the overall ordering. That happens exactly when, for every other player, the results tell you which of the two is better, i.e. `(#players known to be worse) + (#players known to be better) == n - 1`.

Return the list of players whose rank is fixed, in increasing order. If `n == 1`, the only player's rank is trivially fixed.

## Function signature
```python
def determined_players(n: int, winners: list[int], losers: list[int]) -> list[int]:
```

## Constraints
- `1 <= n <= 500`
- `0 <= len(winners) == len(losers) <= 4500`
- `winners[i] != losers[i]`; the results form a DAG; a pair can appear more than once

## Examples
**Example 1**
Input: `n = 5`, `winners = [3,3,2,0,1]`, `losers = [2,1,1,1,4]`
Output: `[1, 4]`
Explanation: Players 3, 2 and 0 all beat 1, either directly or through 2, and 1 beat 4. So 1 is known to be 4th and 4 is known to be 5th. The relative order of 0 against 2 and 3 is unknown, so their ranks are not fixed.

**Example 2**
Input: `n = 4`, `winners = [0,0,1,2]`, `losers = [1,2,3,3]`
Output: `[0, 3]`
Explanation: 0 is best and 3 is worst, but 1 and 2 never played each other.

**Example 3** (edge cases)
Input: `n = 1`, `winners = []`, `losers = []`
Output: `[0]`

Input: `n = 3`, `winners = []`, `losers = []`
Output: `[]`

<details><summary>Approach (spoiler)</summary>

Build the directed graph `winner -> loser`. For each player, compute the set of players it beats transitively, i.e. its descendants, as a bitmask. Process players in reverse topological order (post-order DFS), so that `beats[u] = OR over children v of (beats[v] | bit(v))`. Then count, for each player, how many masks contain it; that gives the number of ancestors. A player is fixed when the number of descendants plus the number of ancestors equals `n-1`. Bitsets make the transitive closure O(n·E/w). Floyd–Warshall at O(n³) also works for n = 500 but is slower.

**Time:** O(n·(n + E) / w) with bitsets · **Space:** O(n² / w)

```python
def determined_players(n, winners, losers):
    adj = [[] for _ in range(n)]
    for w, l in zip(winners, losers):
        adj[w].append(l)
    # iterative post-order DFS -> children finish before parents
    order, state = [], [0] * n
    for s in range(n):
        if state[s]:
            continue
        state[s] = 1
        stack = [(s, 0)]
        while stack:
            u, i = stack.pop()
            if i < len(adj[u]):
                stack.append((u, i + 1))
                v = adj[u][i]
                if state[v] == 0:
                    state[v] = 1
                    stack.append((v, 0))
            else:
                state[u] = 2
                order.append(u)
    beats = [0] * n
    for u in order:
        m = 0
        for v in adj[u]:
            m |= beats[v] | (1 << v)
        beats[u] = m
    beaten_by = [0] * n
    for u in range(n):
        m = beats[u]
        while m:
            low = m & -m
            beaten_by[low.bit_length() - 1] += 1
            m ^= low
    return [i for i in range(n) if bin(beats[i]).count('1') + beaten_by[i] == n - 1]
```
</details>
