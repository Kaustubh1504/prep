# Compute minimax grid path and network delay
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Hard · Pattern: Shortest Path, Graph BFS / DFS

## Problem
This is a two-part question. Both parts use shortest-path ideas, but with different path costs.

**Part 1: minimax grid path.** You are given an `m x n` grid of non-negative integers. Move 4-directionally from the top-left cell `(0,0)` to the bottom-right cell `(m-1,n-1)`. The cost of a path is the **maximum** cell value on it, including the start and end cells; it is not the sum. Return the minimum possible cost over all paths. A `1 x 1` grid returns its only value. (This is LeetCode 778, "Swim in Rising Water", and is equivalent to the minimum `T` such that the cells with value `<= T` connect the two corners.)

**Part 2: network delay.** There are `n` nodes labelled `1..n` and a list of directed weighted edges `times[i] = [u, v, w]`: a signal takes `w` time units to travel from `u` to `v`. A signal is sent from node `k`. Return the time at which the last node receives it, which is the largest shortest-path distance from `k`. If some node can never receive the signal, return `-1`. Weights can be very large (up to `10^12`) and zero-weight edges are allowed, so use exact integer arithmetic. Don't use a sentinel such as `10^9` for infinity. (This matches LeetCode 743.)

## Function signature
```python
def minimax_path(grid: list[list[int]]) -> int: ...                       # Part 1
def network_delay(times: list[list[int]], n: int, k: int) -> int: ...      # Part 2
```

## Constraints
- Part 1: `1 <= m, n <= 500`, `0 <= grid[r][c] <= 10^9`
- Part 2: `1 <= n <= 10^4`, `0 <= len(times) <= 10^5`, `1 <= u, v, k <= n`, `0 <= w <= 10^12`; self-loops and parallel edges may appear

## Examples
**Example 1** (Part 1)
Input: `grid = [[0,2],[1,3]]`
Output: `3`
Explanation: Every path ends at the cell with value 3, so the cost is at least 3, and the path `0 -> 1 -> 3` achieves it.

Input: `grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]`
Output: `16`
Explanation: The best route runs along the top row to `4`, down through `5` to `16`, back left along the third row (`15..12`), down the left column (`11, 10`), and along the bottom row to `6`. Its largest value is 16, and every other route passes through something larger.

**Example 2** (Part 2)
Input: `times = [[2,1,1],[2,3,1],[3,4,1]]`, `n = 4`, `k = 2`
Output: `2`

Input: `times = [[1,2,10**12],[2,3,10**12],[1,3,3*10**12]]`, `n = 3`, `k = 1`
Output: `2000000000000`
Explanation: The weights are huge, and the two-hop route is cheaper than the direct edge.

**Example 3** (edge cases)
Input: `grid = [[7]]` gives `7`.
Input: `times = [[1,2,1]]`, `n = 2`, `k = 2` gives `-1`, because node 1 is unreachable.
Input: `times = []`, `n = 1`, `k = 1` gives `0`.

<details><summary>Approach (spoiler)</summary>

**Part 1:** run Dijkstra with the max-cost combine function. The cost of reaching a neighbour is `max(cost so far, neighbour's value)`. Dijkstra is still correct because `max` never decreases along a path. Return the cost when the target cell is popped. As an alternative, binary search on `T` over the sorted distinct values and use BFS to check whether the cells with value `<= T` connect the corners: O(mn log mn). Union-find over cells added in increasing order also works.

**Part 2:** run standard Dijkstra from `k` with a binary heap. Python integers handle large weights exactly. Mark a node final the first time it is popped. If any node is never finalised, return `-1`; otherwise return the largest distance.

**Time:** Part 1 O(mn log mn), Part 2 O((n + E) log E) · **Space:** O(mn) and O(n + E)

```python
import heapq

def minimax_path(grid):
    m, n = len(grid), len(grid[0])
    best = [[None] * n for _ in range(m)]
    best[0][0] = grid[0][0]
    pq = [(grid[0][0], 0, 0)]
    while pq:
        cost, r, c = heapq.heappop(pq)
        if (r, c) == (m - 1, n - 1):
            return cost
        if cost > best[r][c]:
            continue
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < m and 0 <= nc < n:
                cand = max(cost, grid[nr][nc])
                if best[nr][nc] is None or cand < best[nr][nc]:
                    best[nr][nc] = cand
                    heapq.heappush(pq, (cand, nr, nc))

def network_delay(times, n, k):
    adj = [[] for _ in range(n + 1)]
    for u, v, w in times:
        adj[u].append((v, w))
    dist = [None] * (n + 1)
    pq = [(0, k)]
    while pq:
        d, u = heapq.heappop(pq)
        if dist[u] is not None:
            continue
        dist[u] = d
        for v, w in adj[u]:
            if dist[v] is None:
                heapq.heappush(pq, (d + w, v))
    if any(dist[i] is None for i in range(1, n + 1)):
        return -1
    return max(dist[1:])
```
</details>
