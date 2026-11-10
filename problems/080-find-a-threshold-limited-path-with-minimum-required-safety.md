# Find A Threshold-Limited Path With Minimum Required Safety
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Shortest Path, Binary Search

## Problem
You are given an undirected graph with `n` nodes labelled `0..n-1` and a list of edges `[u, v, cost]`, where `cost` is the safety level a traveller needs to cross that edge. Only edges with `cost <= threshold` may be used at all.

The **required safety** of a path is the maximum edge cost on it. Among all paths from `start` to `end` that use only permitted edges, return the minimum possible required safety.

- Return `0` if `start == end` (an empty path needs no safety).
- Return `-1` if `end` cannot be reached from `start` using permitted edges (including when the graph is disconnected).
- Parallel edges between the same pair of nodes may exist.

## Function signature
```python
from typing import List

def min_required_safety(n: int, edges: List[List[int]], start: int, end: int, threshold: int) -> int:
    ...
```

## Constraints
- `1 <= n <= 10^5`, `0 <= len(edges) <= 2·10^5`
- `0 <= u, v, start, end < n`
- `0 <= cost, threshold <= 10^9`

## Examples
**Example 1**
Input: `n = 4`, `edges = [[0,1,4],[1,3,6],[0,2,8],[2,3,2],[0,3,10]]`, `start = 0`, `end = 3`, `threshold = 10`
Output: `6`
Explanation: Paths `0-3` (max 10), `0-2-3` (max 8) and `0-1-3` (max 6); the best is 6. With `threshold = 7` the answer is still `6`.

**Example 2** (threshold disconnects the graph)
Input: same graph, `threshold = 5`
Output: `-1`
Explanation: Only edges `0-1` (4) and `2-3` (2) survive, so node 3 is unreachable from 0.

**Example 3** (trivial / unreachable)
Input: `n = 3`, `edges = [[0,1,1]]`, `start = 2`, `end = 2`, `threshold = 0` → Output: `0`
Input: `n = 3`, `edges = [[0,1,1]]`, `start = 0`, `end = 2`, `threshold = 5` → Output: `-1`

<details><summary>Approach (spoiler)</summary>

Drop edges above the threshold, then run a minimax variant of Dijkstra: the "distance" of a node is the smallest maximum edge cost needed to reach it, and relaxing edge `(u, v, c)` offers `max(best[u], c)`. Since `max` is monotone along a path, the first time `end` is popped its value is optimal. Alternatives: binary search on the answer with a BFS connectivity check (O((V+E) log C)), or Kruskal-style union-find adding edges in increasing cost until `start` and `end` connect.
**Time:** O((V + E) log V) · **Space:** O(V + E)

```python
import heapq
from typing import List

def min_required_safety(n: int, edges: List[List[int]], start: int, end: int, threshold: int) -> int:
    if start == end:
        return 0
    adj = [[] for _ in range(n)]
    for u, v, c in edges:
        if c <= threshold:
            adj[u].append((v, c)); adj[v].append((u, c))
    best = [float("inf")] * n
    best[start] = 0
    heap = [(0, start)]
    while heap:
        need, u = heapq.heappop(heap)
        if need > best[u]:
            continue
        if u == end:
            return need
        for v, c in adj[u]:
            cand = max(need, c)
            if cand < best[v]:
                best[v] = cand
                heapq.heappush(heap, (cand, v))
    return -1
```
</details>
