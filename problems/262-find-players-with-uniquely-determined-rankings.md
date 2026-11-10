# Find Players with Uniquely Determined Rankings
> Google · Onsite · medium · Pattern: Graph BFS / DFS, Topological Sort
> Source: https://prachub.com/interview-questions/find-players-with-uniquely-determined-rankings

# Find Players with Uniquely Determined Rankings

## Problem

There are `n` players numbered `0` through `n - 1`. Each result `(winner, loser)` states that the winner is strictly better ranked than the loser. Smaller rank numbers are better, and all results are consistent with at least one total ordering of the players.

Results imply transitive comparisons: if `a` beat `b` and `b` beat `c`, then `a` must rank above `c` even if they did not play directly.

A player's rank is uniquely determined if that player occupies the same zero-based rank in every total ordering consistent with all results.

Implement:

```python
def determined_rankings(n: int, game_results: list[tuple[int, int]]) -> list[tuple[int, int]]:
    ...
```

Return `(player_id, rank)` pairs for all uniquely determined players, sorted by `player_id` ascending.

## Constraints

- `1 <= n <= 500`
- `0 <= len(game_results) <= n * (n - 1) / 2`
- `winner != loser`
- Duplicate results may appear and should not change the answer.
- The comparison graph is acyclic.

## Example

```python
n = 5
game_results = [(0, 1), (1, 2), (2, 3), (2, 4), (3, 4)]
```

The result is:

```python
[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4)]
```

## Discussion

Explain why direct win and loss counts are insufficient, and state how your algorithm detects exactly when a rank is fixed rather than merely bounded to a range.

<details><summary>Hints (spoiler)</summary>

1. Compute every transitive better-than relationship.
2. A player's rank is fixed exactly when it is comparable with every other player.
</details>

<details><summary>Approach (spoiler)</summary>

Bitset Floyd-Warshall computes transitive reachability. A player comparable to all others has exactly `above` players forced before it and all remaining players forced after it, so its unique rank is `above`.

**Time:** O(n^2) bitset operations plus O(n^2) counting · **Space:** O(n^2) bits
</details>
