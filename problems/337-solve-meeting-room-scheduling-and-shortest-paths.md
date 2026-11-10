# Solve meeting-room scheduling and shortest paths
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Intervals / Sweep Line

## Problem
This round consisted of two independent coding problems.

### Part 1 — Minimum meeting rooms
You are given a list of meetings `intervals`, where `intervals[i] = [start_i, end_i]` is the half-open time range `[start_i, end_i)`. A room freed at time `t` can host a meeting starting at time `t`. Return the **minimum number of rooms** required so that every meeting can be held with no two overlapping meetings in the same room. An empty list needs `0` rooms.

### Part 2 — Single-source shortest paths
You are given a weighted **directed** graph with `n` nodes labelled `0 .. n-1` and a list of edges `(u, v, w)` meaning an edge from `u` to `v` with non-negative weight `w` (multiple edges between the same pair may exist). Given a source node `src`, return a list `dist` of length `n` where `dist[v]` is the minimum total weight of a path from `src` to `v`, `dist[src] = 0`, and `dist[v] = -1` if `v` is unreachable from `src`.

## Function signature
```python
from typing import List, Tuple

def min_meeting_rooms(intervals: List[List[int]]) -> int:
    ...

def shortest_paths(n: int, edges: List[Tuple[int, int, int]], src: int) -> List[int]:
    ...
```

## Constraints
- Part 1: `0 <= len(intervals) <= 10^5`, `0 <= start_i < end_i <= 10^9`
- Part 2: `1 <= n <= 10^5`, `0 <= len(edges) <= 2 * 10^5`, `0 <= w <= 10^6`, `0 <= src < n`

## Examples
**Example 1** (Part 1)
Input: `intervals = [[0,30],[5,10],[15,20]]`
Output: `2`
Explanation: `[0,30)` overlaps both others, but `[5,10)` and `[15,20)` can share a room.

**Example 2** (Part 1, edge case)
Input: `intervals = [[1,5],[5,8],[8,9]]`
Output: `1`
Explanation: Back-to-back meetings touching at an endpoint do not overlap. (`intervals = []` gives `0`.)

**Example 3** (Part 2)
Input: `n = 5, edges = [(0,1,4),(0,2,1),(2,1,2),(1,3,1),(2,3,5)], src = 0`
Output: `[0, 3, 1, 4, -1]`
Explanation: `0→2→1` costs 3 (cheaper than the direct edge of 4), `0→2→1→3` costs 4, and node 4 has no incoming edges.

**Example 4** (Part 2, edge case)
Input: `n = 3, edges = [(1,0,2)], src = 0`
Output: `[0, -1, -1]`
Explanation: Edges are directed; the edge `1→0` cannot be used to reach node 1 from node 0.

<details><summary>Approach (spoiler)</summary>

**Part 1:** Sort meetings by start time and keep a min-heap of end times of rooms in use. If the earliest-ending room is free by the current start (`end <= start`), reuse it (replace its end time); otherwise open a new room. The heap size at the end is the peak concurrency, which is a lower bound and is achieved.

**Part 2:** Dijkstra's algorithm with a binary heap: repeatedly pop the closest unsettled node and relax its outgoing edges, skipping stale heap entries. Non-negative weights guarantee a popped node's distance is final.
**Time:** Part 1 O(m log m); Part 2 O((n + E) log n) · **Space:** Part 1 O(m); Part 2 O(n + E)

```python
import heapq
from typing import List, Tuple

def min_meeting_rooms(intervals: List[List[int]]) -> int:
    ends = []  # end times of rooms in use
    for start, end in sorted(intervals):
        if ends and ends[0] <= start:
            heapq.heapreplace(ends, end)
        else:
            heapq.heappush(ends, end)
    return len(ends)


def shortest_paths(n: int, edges: List[Tuple[int, int, int]], src: int) -> List[int]:
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))
    INF = float("inf")
    dist = [INF] * n
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue  # stale entry
        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))
    return [d if d != INF else -1 for d in dist]
```
</details>
