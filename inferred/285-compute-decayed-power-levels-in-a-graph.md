# Compute decayed power levels in a graph
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · easy · Pattern: Graph BFS / DFS

## Problem
An undirected graph has `n` nodes, labelled `0` to `n - 1`. Each edge `[u, v, d]` has a non-negative **decay** `d`. Some nodes hold power sources, given as `sources[i] = [node, power]`. Power spreads outward from each source, and crossing an edge with decay `d` lowers it by `d`. Power never drops below zero. Once it reaches 0, it stops spreading.

A node's **power level** is the strongest signal reaching it from any source:

`level[v] = max(0, max over sources (power_s - dist(s, v)))`

Here `dist` is the minimum total decay along a path. Signals from different sources do not add up; only the maximum counts. A node reached by no source, or only by signals that have decayed to 0 or less, has level `0`. Several sources can sit on the same node. Return the list of levels for all nodes.

## Function signature
```python
def power_levels(n: int, edges: list[list[int]], sources: list[list[int]]) -> list[int]:
```

## Constraints
- `1 <= n <= 10^5`, `0 <= len(edges) <= 2 * 10^5`
- `0 <= d <= 10^4`. Parallel edges and self-loops may appear.
- `0 <= len(sources) <= n`, `1 <= power <= 10^9`

## Examples
**Example 1**
Input: `n = 5, edges = [[0,1,1],[1,2,1],[2,3,1],[3,4,1]], sources = [[0,3],[4,2]]`
Output: `[3, 2, 1, 1, 2]`
Explanation: On the path, the source at node 0 gives 3, 2, 1, 0, 0, and the source at node 4 gives 0, 0, 0, 1, 2. Each node takes the larger value.

**Example 2**
Input: `n = 4, edges = [[0,1,2],[1,2,2],[0,2,5],[2,3,1]], sources = [[0,10]]`
Output: `[10, 8, 6, 5]`
Explanation: Node 2 is reached through 0 → 1 → 2 with total decay 4, which is cheaper than the direct edge with decay 5.

**Example 3** (an edge case: stacked sources, isolated node)
Input: `n = 3, edges = [[0,1,1]], sources = [[0,1],[0,4]]`
Output: `[4, 3, 0]`

**Example 4** (an edge case: no sources)
Input: `n = 3, edges = [], sources = []`
Output: `[0, 0, 0]`

<details><summary>Approach (spoiler)</summary>

Run a multi-source Dijkstra on a **max-heap** of remaining power. Seed it with every source's power, keeping only the strongest source per node. Pop the node with the highest current power and relax each neighbour to `power - d`, pushing the neighbour only if that value is greater than its best known level (which starts at 0). Since every relaxation lowers power by a non-negative amount, the first time a node is finalised its power is the maximum, just as with shortest distances. Signals that hit 0 never spread. With unit decays this reduces to a bucketed BFS.
**Time:** O((n + E) log n) · **Space:** O(n + E)

```python
import heapq

def power_levels(n: int, edges: list[list[int]], sources: list[list[int]]) -> list[int]:
    adj = [[] for _ in range(n)]
    for u, v, d in edges:
        adj[u].append((v, d))
        adj[v].append((u, d))
    best = [0] * n
    pq = []                                   # max-heap via (-power, node)
    for node, p in sources:
        if p > best[node]:
            best[node] = p
            heapq.heappush(pq, (-p, node))
    while pq:
        negp, u = heapq.heappop(pq)
        p = -negp
        if p < best[u]:
            continue                          # stale entry
        for v, d in adj[u]:
            q = p - d
            if q > best[v]:                   # only positive power propagates
                best[v] = q
                heapq.heappush(pq, (-q, v))
    return best
```
</details>
