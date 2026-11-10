# Solve graph and linked list tasks
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Graph BFS / DFS

## Problem
This round consisted of three independent tasks.

### Part 1 — Transitive dependencies
You are given a list `deps` of pairs `(task, prerequisite)`, meaning `task` directly depends on `prerequisite`. Given a `task`, return **every** task it depends on directly or transitively, sorted lexicographically. The task itself is never included, even if the dependency graph contains a **cycle** back to it; cycles must not cause infinite loops. A task with no dependencies (or one not mentioned in `deps`) returns `[]`.

### Part 2 — Cheapest route in a weighted directed graph
Given `n` nodes `0 .. n-1`, directed edges `(u, v, w)` with non-negative weights, a source `src` and a destination `dst`, return `(cost, path)`: the minimum total weight from `src` to `dst` and one path achieving it as a list of nodes from `src` to `dst`. If `dst` is unreachable return `(-1, [])`. When `src == dst` the answer is `(0, [src])`.

### Part 3 — Find where a linked list loops, in O(1) space
Given the `head` of a singly linked list, return the node where a cycle **begins**, or `None` if the list has no cycle. You must not modify the list and must use **O(1) extra space** (no visited set).

## Function signature
```python
from typing import List, Optional, Tuple

def all_dependencies(deps: List[Tuple[str, str]], task: str) -> List[str]:
    ...

def shortest_path(n: int, edges: List[Tuple[int, int, int]], src: int, dst: int) -> Tuple[int, List[int]]:
    ...

class ListNode:
    def __init__(self, val: int, next: "Optional[ListNode]" = None): ...

def cycle_start(head: Optional[ListNode]) -> Optional[ListNode]:
    ...
```

## Constraints
- Part 1: up to `10^5` dependency pairs; task names are non-empty strings
- Part 2: `1 <= n <= 10^5`, up to `2 * 10^5` edges, `0 <= w <= 10^6`
- Part 3: up to `10^5` nodes

## Examples
**Example 1** (Part 1)
Input: `deps = [("app","lib"),("lib","utils"),("app","config"),("utils","base"),("test","app")]`, `task = "app"`
Output: `["base", "config", "lib", "utils"]`
Explanation: `app → lib → utils → base` and `app → config`. `test` depends on `app`, not the other way round. For `task = "base"` the answer is `[]`.

**Example 2** (Part 1, cycle)
Input: `deps = [("a","b"),("b","c"),("c","a")]`, `task = "a"`
Output: `["b", "c"]`

**Example 3** (Part 2)
Input: `n = 4, edges = [(0,1,1),(1,2,2),(0,2,5),(2,3,1),(1,3,7)], src = 0, dst = 3`
Output: `(4, [0, 1, 2, 3])`
Explanation: `0→1→2→3` costs `1+2+1 = 4`, cheaper than `0→2→3` (6) or `0→1→3` (8). With `n = 3, edges = [(0,1,1)], src = 0, dst = 2` the answer is `(-1, [])`; with `src == dst == 1` it is `(0, [1])`.

**Example 4** (Part 3)
Input: list `3 → 2 → 0 → -4`, with `-4` pointing back to the node `2`
Output: the node with value `2`
Explanation: A list `1 → 2 → 3` with no cycle returns `None`; a single node pointing to itself returns that node.

<details><summary>Approach (spoiler)</summary>

**Part 1:** Build an adjacency list `task → prerequisites` and run an iterative DFS from `task`; the visited set both deduplicates and stops cycles. Remove `task` itself before sorting.

**Part 2:** Dijkstra with a binary heap and a `prev` array; stop early when `dst` is popped (its distance is final), then walk `prev` back to rebuild the path.

**Part 3:** Floyd's tortoise and hare. If fast (2 steps) meets slow (1 step), there is a cycle. Let `a` be the distance from head to the cycle entry; at the meeting point slow has moved `a + b` and fast `2(a + b)`, so `a + b` is a multiple of the cycle length, which means walking `a` more steps from the meeting point lands on the entry. Restart one pointer at the head and advance both one step at a time; they meet at the entry.
**Time:** Part 1 O(V + E + k log k); Part 2 O((n + E) log n); Part 3 O(n) · **Space:** Part 1 O(V + E); Part 2 O(n + E); Part 3 O(1)

```python
import heapq
from collections import defaultdict
from typing import Dict, List, Optional, Tuple

# Part 1
def all_dependencies(deps: List[Tuple[str, str]], task: str) -> List[str]:
    graph: Dict[str, List[str]] = defaultdict(list)
    for t, pre in deps:              # t depends on pre
        graph[t].append(pre)
    seen = set()
    stack = [task]
    while stack:                     # iterative DFS; `seen` also guards against cycles
        u = stack.pop()
        for v in graph[u]:
            if v not in seen:
                seen.add(v)
                stack.append(v)
    seen.discard(task)               # a task is not its own dependency, even on a cycle
    return sorted(seen)

# Part 2
def shortest_path(n: int, edges: List[Tuple[int, int, int]], src: int, dst: int) -> Tuple[int, List[int]]:
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))
    INF = float("inf")
    dist = [INF] * n
    prev = [-1] * n
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        if u == dst:
            break
        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v], prev[v] = d + w, u
                heapq.heappush(pq, (dist[v], v))
    if dist[dst] == INF:
        return -1, []
    path = [dst]
    while path[-1] != src:
        path.append(prev[path[-1]])
    return dist[dst], path[::-1]

# Part 3
class ListNode:
    def __init__(self, val: int, next: "Optional[ListNode]" = None):
        self.val = val
        self.next = next

def cycle_start(head: Optional[ListNode]) -> Optional[ListNode]:
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:             # inside the cycle; now find its entry
            slow = head
            while slow is not fast:
                slow, fast = slow.next, fast.next
            return slow
    return None
```
</details>
