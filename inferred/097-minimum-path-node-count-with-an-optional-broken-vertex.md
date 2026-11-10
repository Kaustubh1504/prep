# Minimum Path Node Count with an Optional Broken Vertex
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Medium · Pattern: Shortest Path, Graph BFS / DFS

## Problem
An undirected, unweighted network of `n` vertices is given as an adjacency list `connections`, where `connections[u]` lists the neighbours of vertex `u`. One vertex, `broken`, is faulty.

Return the **number of vertices** (not edges) on a shortest path from `start` to `destination`, counting both endpoints. Return `-1` if no valid path exists.

**Part 1 — avoid the broken vertex.** The path may not pass through `broken`. If `broken` is `start` or `destination`, no valid path exists, so return `-1`. If `start == destination` (and it is not broken), the answer is `1`.

**Part 2 — follow-up: the broken vertex is allowed.** Same question, but `broken` may be used like any other vertex (so this is a plain shortest path). Compare how the answer changes: it can only stay the same or decrease.

A single function with a flag `allow_broken` covers both parts.

## Function signature
```python
from typing import List

def min_path_nodes(connections: List[List[int]], start: int, destination: int,
                   broken: int, allow_broken: bool = False) -> int:
    ...
```

## Constraints
- `1 <= n <= 10^5`, total adjacency entries `<= 2·10^5` (use BFS over the adjacency list, not a matrix)
- `0 <= start, destination < n`; `broken` is a vertex id in `[0, n)` or `-1` for "none"
- No self-loops; the graph may be disconnected

## Examples
**Example 1**
Input: `connections = [[1,2],[0,5],[0,3],[2,4],[3,5],[1,4]]`, `start = 0`, `destination = 5`, `broken = 1`
Output: Part 1 → `5`; Part 2 (`allow_broken = True`) → `3`
Explanation: Avoiding vertex 1 forces `0-2-3-4-5` (5 vertices). Allowing it gives `0-1-5` (3 vertices).

**Example 2** (broken vertex is a cut vertex)
Input: `connections = [[1],[0,2],[1,3],[2]]`, `start = 0`, `destination = 3`, `broken = 2`
Output: Part 1 → `-1`; Part 2 → `4`

**Example 3** (same start and destination)
Input: `connections = [[1],[0,2],[1,3],[2]]`, `start = destination = 2`
Output: `broken = 0` → `1`; `broken = 2` → Part 1 `-1`, Part 2 `1`

**Example 4** (disconnected)
Input: `connections = [[],[]]`, `start = 0`, `destination = 1`, `broken = -1` → Output: `-1`

<details><summary>Approach (spoiler)</summary>

BFS from `start` over the adjacency list, skipping `broken` in Part 1. Store the vertex count instead of the edge count (`dist[start] = 1`, each step adds 1), which avoids the classic off-by-one between nodes and edges. Handle the endpoint rules before the search: a broken endpoint is invalid in Part 1, and `start == destination` returns 1. Return as soon as `destination` is discovered; BFS guarantees it is the shortest.
**Time:** O(V + E) · **Space:** O(V)

```python
from collections import deque
from typing import List

def min_path_nodes(connections: List[List[int]], start: int, destination: int,
                   broken: int, allow_broken: bool = False) -> int:
    n = len(connections)
    if not allow_broken and broken in (start, destination):
        return -1
    if start == destination:
        return 1
    dist = [0] * n            # number of vertices on the shortest path found so far; 0 = unvisited
    dist[start] = 1
    q = deque([start])
    while q:
        u = q.popleft()
        for v in connections[u]:
            if dist[v] or (not allow_broken and v == broken):
                continue
            dist[v] = dist[u] + 1
            if v == destination:
                return dist[v]
            q.append(v)
    return -1
```
</details>
