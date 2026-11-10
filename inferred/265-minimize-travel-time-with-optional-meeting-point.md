# Minimize travel time with optional meeting point
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · hard · Pattern: Shortest Path, Graph BFS / DFS

## Problem
A road network has `n` intersections, labelled `0` to `n - 1`, and weighted roads `edges[i] = [u, v, w]` with `w > 0`. Roads are two-way unless `directed=True`, in which case each road only goes from `u` to `v`. Person A starts at `start_a` and person B starts at `start_b`, and both need to reach `dest`.

They may **meet** at any intersection `m` and ride the rest of the way together in one car. Then each person drives a shortest path to `m`, and from `m` one shared trip goes to `dest`. The cost of a plan is the total driving time:

`cost(m) = dist(start_a → m) + dist(start_b → m) + dist(m → dest)`

Meeting is optional. Choosing `m = dest` means they drive separately the whole way. `m` may also be one of the start points, for example when B drives to A and they leave together.

Return a tuple `(min_cost, meeting_point)`. If several meeting points give the same minimum cost, return the smallest index. If no `m` is reachable by both people and can also reach `dest`, return `(-1, -1)`.

## Function signature
```python
def best_meeting_plan(n: int, edges: list[list[int]], start_a: int, start_b: int,
                      dest: int, directed: bool = False) -> tuple[int, int]:
```

## Constraints
- `1 <= n <= 10^5`, `0 <= len(edges) <= 2 * 10^5`
- `1 <= w <= 10^5`. Parallel edges and self-loops may appear.
- `start_a`, `start_b` and `dest` are valid nodes, and they need not be distinct.

## Examples
**Example 1**
Input: `n = 5, edges = [[0,2,2],[1,2,2],[2,3,3],[3,4,3],[0,4,9],[1,4,9]], start_a = 0, start_b = 1, dest = 4`
Output: `(10, 2)`
Explanation: Both people drive 2 to reach node 2, and then they share 2 → 3 → 4, which costs 6. The total is 2 + 2 + 6 = 10, compared with 9 + 9 = 18 for driving separately.

**Example 2**
Input: `n = 5, edges = [[0,2,1],[2,1,1],[0,3,4],[3,4,1],[1,4,10]], start_a = 0, start_b = 1, dest = 4`
Output: `(7, 0)`
Explanation: B drives 1 → 2 → 0 (cost 2), A waits at home (cost 0), and they drive 0 → 3 → 4 together (cost 5).

**Example 3** (an edge case: unreachable)
Input: `n = 4, edges = [[0,1,1],[2,3,1]], start_a = 0, start_b = 1, dest = 3`
Output: `(-1, -1)`

**Example 4** (an edge case: directed roads, same start)
Input: `n = 3, edges = [[0,1,1],[1,2,1],[2,0,1]], start_a = 1, start_b = 0, dest = 2, directed = True`
Output: `(2, 1)`

<details><summary>Approach (spoiler)</summary>

The three legs of the cost are independent shortest-path distances, so run Dijkstra three times. Run it from `start_a` and from `start_b` on the forward graph. Run it from `dest` on the **reversed** graph, which gives `dist(m → dest)` for every `m`. For undirected graphs the reversed graph is the same as the forward one. Then try every `m` and take the minimum of `da[m] + db[m] + dd[m]`, scanning in increasing `m` so that ties go to the smallest index. The option of not meeting is the case `m = dest`, because `dd[dest] = 0`.
**Time:** O((n + E) log n) · **Space:** O(n + E)

```python
import heapq

def best_meeting_plan(n: int, edges: list[list[int]], start_a: int, start_b: int,
                      dest: int, directed: bool = False) -> tuple[int, int]:
    INF = float("inf")
    fwd = [[] for _ in range(n)]
    rev = [[] for _ in range(n)]
    for u, v, w in edges:
        fwd[u].append((v, w))
        rev[v].append((u, w))
        if not directed:
            fwd[v].append((u, w))
            rev[u].append((v, w))

    def dijkstra(src: int, adj) -> list:
        dist = [INF] * n
        dist[src] = 0
        pq = [(0, src)]
        while pq:
            d, u = heapq.heappop(pq)
            if d > dist[u]:
                continue
            for v, w in adj[u]:
                if d + w < dist[v]:
                    dist[v] = d + w
                    heapq.heappush(pq, (d + w, v))
        return dist

    da = dijkstra(start_a, fwd)
    db = dijkstra(start_b, fwd)
    dd = dijkstra(dest, rev)          # dd[m] = shortest distance m -> dest
    best, meet = INF, -1
    for m in range(n):                # ascending m, strict '<' keeps the smallest id on ties
        total = da[m] + db[m] + dd[m]
        if total < best:
            best, meet = total, m
    return (best, meet) if meet != -1 else (-1, -1)
```
</details>
