# Determine Whether a Word Exists in a Graph
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Graph BFS / DFS, Backtracking

## Problem
You are given a graph of `n` nodes, indexed `0 .. n-1`. Node `i` is described by `nodes[i] = (ch, neighbors)`, where `ch` is a single lowercase letter stored at the node and `neighbors` is the list of node indices reachable from `i` by one edge. Edges are followed exactly as listed (if the graph is undirected, each edge appears in both nodes' lists). Several nodes may hold the same letter, and the graph may contain cycles.

Given a string `target`, return `True` if there is a **path** `v0 → v1 → ... → v(L-1)` (each consecutive pair joined by an edge, `L = len(target)`) such that the letter at `v_j` equals `target[j]` for every `j`, and **no node is used more than once** in the path. Otherwise return `False`.

The path may start at any node. An empty `target` is always found (`True`).

## Function signature
```python
from typing import List, Tuple

def word_exists(nodes: List[Tuple[str, List[int]]], target: str) -> bool:
    ...
```

## Constraints
- `1 <= n <= 2000`, total number of edges `<= 10^4`
- `0 <= len(target) <= 15`
- Letters are lowercase English; neighbor indices are valid and contain no self-loops

## Examples
**Example 1**
Input: `nodes = [("c",[1]), ("a",[0,2]), ("t",[1,3]), ("a",[2])]` (the undirected chain `c - a - t - a`), `target = "cata"`
Output: `True`
Explanation: Path `0 → 1 → 2 → 3` spells `c a t a`. On the same graph, `"tac"` is also `True` (`2 → 1 → 0`), but `"aca"` is `False`: after `a(1) → c(0)` the only neighbour of `c` is node 1, already used.

**Example 2** (no node reuse)
Input: `nodes = [("a",[1]), ("b",[0])]`, `target = "aba"`
Output: `False`
Explanation: Spelling `aba` would require visiting node 0 twice. `target = ""` returns `True`, and `"ba"` returns `True`.

**Example 3** (directed edges)
Input: `nodes = [("a",[1]), ("b",[2]), ("a",[])]`, `target = "aba"`
Output: `True`
Explanation: `0 → 1 → 2`; the two `a`s are different nodes, so nothing is reused.

<details><summary>Approach (spoiler)</summary>

Backtracking DFS, as in word search on a grid but over an adjacency list. Start from every node whose letter equals `target[0]`; from node `u` matching `target[i]`, recurse into each unused neighbour whose letter equals `target[i+1]`, marking `u` as used on the way down and unmarking on the way back (so other start points/branches can reuse it). Success when the last character is matched. A cheap pre-check — the graph must contain at least as many copies of each letter as the target needs — rejects many impossible queries immediately.
**Time:** O(n · d^(L-1)) worst case (d = max out-degree), far less in practice due to letter filtering · **Space:** O(n + L)

```python
from collections import Counter
from typing import List, Tuple

def word_exists(nodes: List[Tuple[str, List[int]]], target: str) -> bool:
    if not target:
        return True
    have = Counter(ch for ch, _ in nodes)
    if any(have[c] < k for c, k in Counter(target).items()):
        return False
    used = [False] * len(nodes)

    def dfs(u: int, i: int) -> bool:
        # nodes[u] already matches target[i]
        if i == len(target) - 1:
            return True
        used[u] = True
        for v in nodes[u][1]:
            if not used[v] and nodes[v][0] == target[i + 1] and dfs(v, i + 1):
                used[u] = False
                return True
        used[u] = False
        return False

    return any(ch == target[0] and dfs(u, 0) for u, (ch, _) in enumerate(nodes))
```
</details>
