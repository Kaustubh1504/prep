# Count Prefix-Matching Simple Paths in a Labeled Graph
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Graph BFS / DFS

## Problem
You are given a small undirected graph with `n` vertices numbered `0..n-1`. Vertex `v` carries a single-character label `labels[v]`. You are also given a query `word`.

A **simple path** is a sequence of distinct vertices `v1, v2, ..., vk` (`k >= 1`) where each consecutive pair is joined by an edge. Its label string is `labels[v1] + labels[v2] + ... + labels[vk]`. Paths are ordered vertex sequences, so `0-1` and `1-0` are different paths; a single vertex is a path of length 1.

Count the number of simple paths whose label string equals **some nonempty prefix** of `word` (i.e. equals `word[:k]` for some `1 <= k <= len(word)`). Paths may start at any vertex. Since a path can never be longer than `n`, prefixes longer than `n` contribute nothing.

## Function signature
```python
from typing import List

def count_prefix_paths(labels: str, edges: List[List[int]], word: str) -> int:
    ...
```

## Constraints
- `1 <= n <= 15` (`len(labels) == n`)
- `0 <= len(edges) <= n·(n-1)/2`, no self-loops or duplicate edges
- `1 <= len(word) <= 100`; labels and word use lowercase letters
- The answer fits in a 64-bit integer

## Examples
**Example 1**
Input: `labels = "aab"`, `edges = [[0,1],[1,2],[0,2]]`, `word = "ab"`
Output: `4`
Explanation: Prefix `"a"`: paths `[0]`, `[1]`. Prefix `"ab"`: `[0,2]`, `[1,2]`.

**Example 2** (both directions count)
Input: `labels = "aba"`, `edges = [[0,1],[1,2]]`, `word = "aba"`
Output: `6`
Explanation: `"a"`: `[0]`, `[2]`; `"ab"`: `[0,1]`, `[2,1]`; `"aba"`: `[0,1,2]`, `[2,1,0]`.

**Example 3** (word longer than any simple path)
Input: `labels = "aaa"`, `edges = [[0,1],[1,2],[0,2]]`, `word = "aaaa"`
Output: `15`
Explanation: 3 paths of length 1, 6 of length 2, 6 of length 3; no simple path has 4 vertices.

**Example 4** (no match)
Input: `labels = "abc"`, `edges = [[0,1]]`, `word = "z"`
Output: `0`

<details><summary>Approach (spoiler)</summary>

Use DP over subsets: `dp[mask][v]` is the number of simple paths that visit exactly the vertices in `mask`, end at `v`, and spell `word[:popcount(mask)]`. Seed every vertex labelled `word[0]`, then extend each state to an unvisited neighbour whose label equals the next character of the word. Every reachable state is one matching path for one prefix, so the answer is the sum of all `dp` values. Plain backtracking DFS with a visited set also works and is often faster in practice because the label constraint prunes heavily.
**Time:** O(2^n · n^2) worst case · **Space:** O(2^n · n)

```python
from typing import List

def count_prefix_paths(labels: str, edges: List[List[int]], word: str) -> int:
    n = len(labels)
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v); adj[v].append(u)
    L = min(len(word), n)
    # dp[mask][v]: simple paths using exactly the vertices in mask, ending at v,
    # whose label string equals word[:popcount(mask)]
    dp = [[0] * n for _ in range(1 << n)]
    for v in range(n):
        if L and labels[v] == word[0]:
            dp[1 << v][v] = 1
    total = 0
    for mask in range(1, 1 << n):
        k = bin(mask).count("1")
        if k > L: continue
        row = dp[mask]
        for v in range(n):
            c = row[v]
            if not c: continue
            total += c
            if k == L: continue
            nxt = word[k]
            for u in adj[v]:
                if not (mask >> u) & 1 and labels[u] == nxt:
                    dp[mask | (1 << u)][u] += c
    return total
```
</details>
