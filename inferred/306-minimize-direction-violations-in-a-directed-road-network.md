# Minimize Direction Violations in a Directed Road Network
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Shortest Path, Graph BFS / DFS

## Problem
A city has `n` intersections, labelled `0` to `n - 1`, connected by one-way roads. Each road `edges[i] = [u, v]` points from `u` to `v`. You want to drive from `start` to `end`, and you are allowed to drive a road the wrong way, from `v` to `u`, at the cost of one **direction violation** per wrong-way road. Driving a road the correct way costs nothing.

Return the minimum number of violations needed to get from `start` to `end`. If `start == end`, return `0`. If `end` can't be reached even when every road is driven in both directions (it is in a different connected component), return `-1`.

Parallel roads, including roads in opposite directions between the same two intersections, are allowed. Each road is a separate option. Intersections with no roads may exist. The graph can have hundreds of thousands of nodes and edges, so the solution must run in linear time.

## Function signature
```python
def minimum_direction_violations(n: int, edges: list[list[int]], start: int, end: int) -> int:
```

## Constraints
- `1 <= n <= 3 * 10^5`, `0 <= len(edges) <= 3 * 10^5`
- `0 <= u, v, start, end < n`

## Examples
**Example 1**
Input: `n = 4, edges = [[0,1],[2,1],[2,3]], start = 0, end = 3`
Output: `1`
Explanation: Drive 0 → 1 the correct way, then 1 → 2 against the road 2 → 1 (one violation), then 2 → 3 the correct way.

**Example 2**
Input: `n = 5, edges = [[0,1],[1,2],[3,0],[3,4],[4,2]], start = 0, end = 4`
Output: `1`
Explanation: One option is 0 → 1 → 2 and then 2 → 4 against the road 4 → 2. Another is 0 → 3 against the road 3 → 0, then 3 → 4. Both cost 1.

**Example 3** (an edge case: parallel roads all pointing the wrong way)
Input: `n = 3, edges = [[1,0],[1,0],[2,1]], start = 0, end = 2`
Output: `2`

**Example 4** (an edge case: unreachable)
Input: `n = 4, edges = [[0,1]], start = 0, end = 3`
Output: `-1`

**Example 5** (an edge case)
Input: `n = 2, edges = [], start = 1, end = 1`
Output: `0`

<details><summary>Approach (spoiler)</summary>

Model each road `u → v` as two arcs: `u → v` with weight 0 and `v → u` with weight 1. The answer is then the shortest path in a graph whose weights are all 0 or 1, which **0-1 BFS** solves in linear time. Use a deque. When relaxing along a weight-0 arc, push the node to the front. Along a weight-1 arc, push it to the back. The deque stays sorted by distance, like Dijkstra's priority queue but without the log factor. Stop as soon as `end` is popped. Each parallel road adds its own arcs, so it needs no special handling.
**Time:** O(n + E) · **Space:** O(n + E)

```python
from collections import deque

def minimum_direction_violations(n: int, edges: list[list[int]], start: int, end: int) -> int:
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append((v, 0))     # along the road: free
        adj[v].append((u, 1))     # against the road: one violation
    INF = float("inf")
    dist = [INF] * n
    dist[start] = 0
    dq = deque([start])
    while dq:
        u = dq.popleft()
        if u == end:
            return dist[u]
        for v, w in adj[u]:
            nd = dist[u] + w
            if nd < dist[v]:
                dist[v] = nd
                if w == 0:
                    dq.appendleft(v)
                else:
                    dq.append(v)
    return -1
```
</details>
