# Solve Shortest Paths and Rental Allocation
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Intervals / Sweep Line

## Problem
This onsite has two independent parts. The overview mentions shortest paths in weighted graphs, both directed and undirected, including paths that must pass through an intermediate node. It also mentions minimising and assigning concurrent rental requests.

### Part 1 — Shortest path through a required node
A graph has `n` nodes and weighted edges `[u, v, w]` with `w >= 0`. Edges are undirected by default, or one-way `u → v` when `directed=True`. Return the length of the shortest walk from `src` to `dst` that **visits `via`** at some point. The walk may repeat nodes and edges. If no such walk exists, return `-1`. If `src == via == dst`, the answer is `0`.

### Part 2 — Minimum cars and assignment for rental requests
Each rental request `[start, end)` is half-open, so a car returned at `t` can be rented again at `t`. Find the **minimum number of cars** that can serve every request, and an assignment of a car ID (`0`, `1`, ...) to each request so that no car is double-booked. To make the assignment unique, process requests by `(start, end, input index)`. Give each request the free car with the **smallest ID**, and open a new car, using the next unused ID, only when no car is free. Return `(num_cars, assignment)`, where `assignment[i]` is the car for `requests[i]` in input order.

## Function signature
```python
# Part 1
def shortest_via(n: int, edges: list[list[int]], src: int, via: int, dst: int,
                 directed: bool = False) -> int: ...

# Part 2
def allocate_rentals(requests: list[list[int]]) -> tuple[int, list[int]]: ...
```

## Constraints
- Part 1: `1 <= n <= 10^5`, `0 <= len(edges) <= 2 * 10^5`, `0 <= w <= 10^6`
- Part 2: `0 <= len(requests) <= 10^5`, `0 <= start < end <= 10^9`

## Examples
**Part 1, Example 1**
Input: `n = 4, edges = [[0,1,4],[0,2,1],[2,1,1],[1,3,5],[2,3,8]], src = 0, via = 1, dst = 3`
Output: `7`
Explanation: The shortest route from 0 to 1 is 0 → 2 → 1, with length 2. The shortest from 1 to 3 is the direct edge, with length 5. The total is 7. With `via = 2`, the answer is also `7` (1 + 6).

**Part 1, Example 2** (edge cases: direction matters)
Input: `n = 4, edges = [[0,1,1],[1,2,1],[2,3,1]], directed = True`
`shortest_via(..., src=0, via=1, dst=3)` returns `3`, but `shortest_via(..., src=3, via=1, dst=0)` returns `-1`.

**Part 1, Example 3** (edge cases)
On the graph from Example 1, `shortest_via(4, E, 0, 0, 0)` returns `0`. Calling `shortest_via(5, E, 0, 4, 3)` returns `-1`, because node 4 is isolated.

**Part 2, Example 1**
Input: `requests = [[1,4],[2,5],[4,6],[7,8],[3,7]]`
Output: `(3, [0, 1, 0, 0, 2])`
Explanation: In start order, [1,4) gets car 0, [2,5) car 1 and [3,7) car 2. [4,6) reuses car 0, which was returned at 4. At time 7 every car is free, so [7,8) takes the smallest ID, car 0.

**Part 2, Example 2** (an edge case: back-to-back rentals)
Input: `requests = [[0,2],[2,4],[4,6]]`
Output: `(1, [0, 0, 0])`

**Part 2, Example 3** (an edge case: unsorted input)
Input: `requests = [[5,9],[1,3],[0,10]]`
Output: `(2, [1, 1, 0])`. For `requests = []`, the output is `(0, [])`.

<details><summary>Approach (spoiler)</summary>

**Part 1:** A walk through `via` splits into two independent shortest paths, `src → via` and `via → dst`. Run Dijkstra from `src` and from `via` and add `dist_src[via] + dist_via[dst]`. If either one is infinite, the answer is -1. For directed graphs, the second leg could also come from one Dijkstra on the reversed graph starting at `dst`, which helps when many sources share the same `via` and `dst`. **Time** O((n + E) log n).

**Part 2:** The minimum number of cars equals the maximum number of overlapping requests (interval partitioning), and greedy assignment reaches it. Sort the requests by start. Keep a min-heap of `(return_time, car)` for cars that are out and a min-heap of free car IDs. Before each request, release every car whose return time is at or before the request's start. Reuse the smallest free ID, or open a new car. A new car is only opened when every existing car is busy at that moment, so the number of cars equals the peak overlap. **Time** O(m log m).

```python
import heapq

# Part 1
def shortest_via(n: int, edges: list[list[int]], src: int, via: int, dst: int,
                 directed: bool = False) -> int:
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))
        if not directed:
            adj[v].append((u, w))

    def dijkstra(s: int) -> list:
        dist = [float("inf")] * n
        dist[s] = 0
        pq = [(0, s)]
        while pq:
            d, u = heapq.heappop(pq)
            if d > dist[u]:
                continue
            for v, w in adj[u]:
                if d + w < dist[v]:
                    dist[v] = d + w
                    heapq.heappush(pq, (d + w, v))
        return dist

    total = dijkstra(src)[via] + dijkstra(via)[dst]
    return -1 if total == float("inf") else total

# Part 2
def allocate_rentals(requests: list[list[int]]) -> tuple[int, list[int]]:
    order = sorted(range(len(requests)), key=lambda i: (requests[i][0], requests[i][1], i))
    free = []                      # min-heap of idle car ids
    busy = []                      # min-heap of (return_time, car_id)
    assign = [-1] * len(requests)
    cars = 0
    for i in order:
        start, end = requests[i]
        while busy and busy[0][0] <= start:
            _, car = heapq.heappop(busy)
            heapq.heappush(free, car)
        if free:
            car = heapq.heappop(free)
        else:
            car = cars
            cars += 1
        assign[i] = car
        heapq.heappush(busy, (end, car))
    return cars, assign
```
</details>
