# Find shortest relationship path using BFS
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Graph BFS / DFS

## Problem
You are given a list of relationships between people. Each relationship is a pair `[u, v]` of names meaning `u` and `v` know each other, and relationships are **undirected**. Given a `start` person and a `target` person, return the minimum number of relationship hops needed to get from `start` to `target`.

- If `start == target`, return `0`, even if that person appears in no relationship.
- If `target` can't be reached from `start`, or either person doesn't appear in the data, return `-1`.
- The same pair may be listed more than once, in either orientation.

## Function signature
```python
def shortest_relationship_path(relationships: list[list[str]], start: str, target: str) -> int:
```

## Constraints
- `0 <= len(relationships) <= 10^5`
- Names are non-empty strings of at most 20 characters
- Up to `2 * 10^5` distinct people

## Examples
**Example 1**
Input: `relationships = [["alice","bob"],["bob","carol"],["carol","dave"],["alice","erin"],["erin","dave"],["frank","gina"]]`, `start = "alice"`, `target = "dave"`
Output: `2`
Explanation: `alice -> erin -> dave` takes 2 hops, which beats `alice -> bob -> carol -> dave`.

**Example 2** (unreachable)
Input: same relationships, `start = "alice"`, `target = "frank"`
Output: `-1`

**Example 3** (start equals target, and unknown people)
Input: same relationships, `start = "zed"`, `target = "zed"`
Output: `0`

Input: same relationships, `start = "zed"`, `target = "alice"`
Output: `-1`

<details><summary>Approach (spoiler)</summary>

Build an undirected adjacency list, then run BFS from `start`. BFS visits nodes in order of their hop distance, so the first time you see `target` you have its shortest distance. Mark nodes as visited when you **enqueue** them, not when you dequeue them; otherwise a node can be enqueued many times. Return `-1` if the queue empties without reaching `target`.

**Time:** O(V + E) · **Space:** O(V + E)

```python
from collections import defaultdict, deque

def shortest_relationship_path(relationships, start, target):
    if start == target:
        return 0
    g = defaultdict(list)
    for u, v in relationships:
        g[u].append(v)
        g[v].append(u)
    seen = {start}
    q = deque([(start, 0)])
    while q:
        node, d = q.popleft()
        for nb in g[node]:
            if nb == target:
                return d + 1
            if nb not in seen:
                seen.add(nb)
                q.append((nb, d + 1))
    return -1
```
</details>
