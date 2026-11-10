# Deterministic Task Execution Order
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · easy · Pattern: Topological Sort

## Problem
There are `n` tasks labelled `0 .. n-1` and a single worker who executes one task at a time. You are given a list of dependencies `edges`, where `(u, v)` means task `u` must finish before task `v` can start.

Produce the execution order the worker follows under this deterministic rule: at every step, among all tasks whose prerequisites are all completed (the "ready" tasks) and that have not run yet, the worker runs the one with the **smallest label**.

Return the full order as a list of `n` labels. If the dependencies contain a **cycle**, so that not all tasks can ever be run, return an empty list `[]`. Duplicate edges may appear and should be handled consistently (each copy counts as one prerequisite and is satisfied when `u` finishes).

## Function signature
```python
from typing import List, Tuple

def valid_single_worker_schedule(n: int, edges: List[Tuple[int, int]]) -> List[int]:
    ...
```

## Constraints
- `1 <= n <= 10^5`
- `0 <= len(edges) <= 2 * 10^5`
- `0 <= u, v < n`; `u != v`

## Examples
**Example 1**
Input: `n = 6, edges = [(5,2),(5,0),(4,0),(4,1),(2,3),(3,1)]`
Output: `[4, 5, 0, 2, 3, 1]`
Explanation: Initially only 4 and 5 are ready; 4 is smaller. After 4, ready = {5}. After 5, ready = {0, 2}; run 0, then 2, which unlocks 3, which unlocks 1.

**Example 2** (cycle)
Input: `n = 3, edges = [(0,1),(1,2),(2,1)]`
Output: `[]`
Explanation: Tasks 1 and 2 depend on each other, so they can never run.

**Example 3** (an edge case)
Input: `n = 3, edges = []`
Output: `[0, 1, 2]`
Explanation: With no dependencies every task is ready immediately and they run in label order.

<details><summary>Approach (spoiler)</summary>

Kahn's algorithm with a min-heap instead of a FIFO queue. Compute in-degrees, push all zero-in-degree tasks into the heap, and repeatedly pop the smallest ready task, append it, and decrement its successors' in-degrees (pushing any that reach zero). The heap enforces the smallest-label rule exactly. If fewer than `n` tasks were output, the remaining ones lie on or behind a cycle, so return `[]`.
**Time:** O((n + E) log n) · **Space:** O(n + E)

```python
import heapq
from typing import List, Tuple

def valid_single_worker_schedule(n: int, edges: List[Tuple[int, int]]) -> List[int]:
    graph = [[] for _ in range(n)]
    indeg = [0] * n
    for u, v in edges:
        graph[u].append(v)
        indeg[v] += 1

    heap = [t for t in range(n) if indeg[t] == 0]
    heapq.heapify(heap)
    order = []
    while heap:
        u = heapq.heappop(heap)
        order.append(u)
        for v in graph[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                heapq.heappush(heap, v)
    return order if len(order) == n else []
```
</details>
