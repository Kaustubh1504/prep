# Find Earliest Fully Connected Time
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Union-Find, Sorting

## Problem
There are `n` people (nodes) labelled `0 .. n-1`. You are given a log of connectivity events `events`, each a tuple `(time, op, u, v)`:
- `op == "add"`: an undirected edge between `u` and `v` is created at `time`;
- `op == "remove"`: the existing edge between `u` and `v` is deleted at `time`.

The log is guaranteed to be consistent: an `"add"` is only issued for an edge that is currently absent and a `"remove"` only for an edge that is currently present. Events may share a timestamp; events with the same time are applied in the order they appear in the list (the list may be given unsorted by time, in which case sort it stably by time).

The graph's state **at time `t`** is the result of applying every event with `time <= t`. Return the **earliest event timestamp** `t` at which the graph is **fully connected** (every node can reach every other node). Only event timestamps are candidate answers; states in the middle of a batch of same-time events are not observed. If the graph is never fully connected, return `-1` (including when there are no events).

Because edges can disappear, simply union-ing edges in time order (as in the insert-only version of this problem) is not enough.

## Function signature
```python
from typing import List, Tuple

def earliest_fully_connected(n: int, events: List[Tuple[int, str, int, int]]) -> int:
    ...
```

## Constraints
- `2 <= n <= 10^5`
- `0 <= len(events) <= 10^5`
- `0 <= time <= 10^9`, `0 <= u, v < n`, `u != v`

## Examples
**Example 1**
Input: `n = 4`, `events = [(1,"add",0,1), (2,"add",1,2), (3,"remove",0,1), (4,"add",2,3), (5,"add",0,3)]`
Output: `5`
Explanation: Edge sets per time: t1 `{0-1}`, t2 `{0-1, 1-2}`, t3 `{1-2}`, t4 `{1-2, 2-3}`, t5 `{1-2, 2-3, 0-3}`. Only at t5 are all four nodes connected (`0-3-2-1`).

**Example 2** (same-time batch)
Input: `n = 3`, `events = [(1,"add",0,1), (2,"add",1,2), (2,"remove",0,1), (3,"add",0,2)]`
Output: `3`
Explanation: At time 2 both events apply together, leaving only `{1-2}`; the momentary state `{0-1, 1-2}` inside the batch does not count. At time 3 the edges `{1-2, 0-2}` connect everyone.

**Example 3** (an edge case)
Input: `n = 4`, `events = [(1,"add",0,1), (1,"remove",0,1), (2,"add",2,3)]`
Output: `-1`
Explanation: The graph is never connected. An empty event list also returns `-1`.

<details><summary>Approach (spoiler)</summary>

Solve it **offline**. Compress the distinct timestamps to indices `0..T-1`; every edge is alive on a contiguous index range `[added, removed)` (an edge added and removed in the same batch is never observed). Insert each range into a segment tree over time indices, storing the edge in the O(log T) canonical nodes covering it. DFS the segment tree, union-ing a node's edges when entering and **rolling them back** when leaving, using a DSU with union by size and no path compression so each union is undone in O(1). At a node, if the DSU has a single component, every time in its range is connected, so the leftmost time of the range is the earliest candidate there; searching the left child before the right yields the global earliest. (A simpler O(E·(n+E)) solution rebuilds connectivity after each timestamp; mention it as the baseline.)
**Time:** O(E log T log n) · **Space:** O(n + E log T)

```python
from typing import List, Tuple

def earliest_fully_connected(n: int, events: List[Tuple[int, str, int, int]]) -> int:
    if not events:
        return -1
    events = sorted(events, key=lambda e: e[0])          # stable: same-time order kept
    times = sorted({t for t, _, _, _ in events})
    idx = {t: k for k, t in enumerate(times)}
    T = len(times)

    # Each edge is alive on a contiguous range of time indices [start, end).
    seg = [[] for _ in range(4 * T)]

    def insert(node, lo, hi, l, r, edge):
        if r <= lo or hi <= l:
            return
        if l <= lo and hi <= r:
            seg[node].append(edge)
            return
        mid = (lo + hi) // 2
        insert(2 * node, lo, mid, l, r, edge)
        insert(2 * node + 1, mid, hi, l, r, edge)

    open_since = {}
    for t, op, u, v in events:
        key = (min(u, v), max(u, v))
        if op == "add":
            open_since[key] = idx[t]
        else:
            s = open_since.pop(key)
            if s < idx[t]:                 # added and removed at the same time -> never observed
                insert(1, 0, T, s, idx[t], key)
    for key, s in open_since.items():
        insert(1, 0, T, s, T, key)

    parent = list(range(n))
    size = [1] * n
    comps = [n]
    history = []

    def find(x):
        while parent[x] != x:           # no path compression, so unions can be rolled back
            x = parent[x]
        return x

    def union(a, b):
        a, b = find(a), find(b)
        if a == b:
            return
        if size[a] < size[b]:
            a, b = b, a
        parent[b] = a
        size[a] += size[b]
        comps[0] -= 1
        history.append(b)

    def rollback(mark):
        while len(history) > mark:
            b = history.pop()
            a = parent[b]
            size[a] -= size[b]
            parent[b] = b
            comps[0] += 1

    def dfs(node, lo, hi):
        mark = len(history)
        for u, v in seg[node]:
            union(u, v)
        ans = -1
        if comps[0] == 1:
            ans = times[lo]                 # connected for every time in [lo, hi): earliest is lo
        elif hi - lo > 1:
            mid = (lo + hi) // 2
            ans = dfs(2 * node, lo, mid)
            if ans == -1:
                ans = dfs(2 * node + 1, mid, hi)
        rollback(mark)
        return ans

    return dfs(1, 0, T)
```
</details>
