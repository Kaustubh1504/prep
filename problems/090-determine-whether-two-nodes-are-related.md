# Determine whether two nodes are related
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Graph BFS / DFS

## Problem
You are given a list of relations `[parent, child]` describing a family/ancestry graph over integer node ids, and two node ids `a` and `b`. Two nodes are **related** if they belong to the same connected component when every relation is treated as an undirected link (they are connected through any chain of parent/child links, e.g. siblings, cousins, in-laws via a shared child).

Return `True` if `a` and `b` are related, `False` otherwise. Rules:
- A node is always related to itself (`a == b` returns `True`, even if the node never appears in `relations`).
- A node that appears in no relation is unrelated to every other node.
- The data may be messy: it can contain several disconnected families, duplicate relations, and cycles; none of these should cause errors or infinite loops.

## Function signature
```python
from typing import List

def are_related(relations: List[List[int]], a: int, b: int) -> bool:
    ...
```

## Constraints
- `0 <= len(relations) <= 10^5`
- Node ids are integers in `[-10^9, 10^9]` (not necessarily contiguous)

## Examples
**Example 1**
Input: `relations = [[1,2],[1,3],[4,3],[5,6]]`, `a = 2`, `b = 4`
Output: `True`
Explanation: `2 - 1 - 3 - 4`: 2 and 3 share parent 1, and 4 is another parent of 3.

**Example 2** (different families)
Input: `relations = [[1,2],[1,3],[4,3],[5,6]]`, `a = 2`, `b = 6`
Output: `False`

**Example 3** (cycle)
Input: `relations = [[1,2],[2,3],[3,1]]`, `a = 3`, `b = 2`
Output: `True`

**Example 4** (missing nodes)
Input: `relations = [[1,2],[1,3],[4,3],[5,6]]`, `a = 7`, `b = 7` → `True`; `a = 1`, `b = 9` → `False`

<details><summary>Approach (spoiler)</summary>

Union-find over node ids stored in a hash map: union the two endpoints of every relation, then compare roots of `a` and `b`. Cycles and duplicates are harmless because a union of already-connected nodes does nothing. A BFS/DFS from `a` over an undirected adjacency list with a visited set is equally valid for a single query; union-find is better when many queries share the same relations.
**Time:** O(R · α(R)) · **Space:** O(R)

```python
from typing import Dict, List

def are_related(relations: List[List[int]], a: int, b: int) -> bool:
    if a == b:
        return True
    parent: Dict[int, int] = {}

    def find(x: int) -> int:
        root = x
        while parent[root] != root:
            root = parent[root]
        while parent[x] != root:
            parent[x], x = root, parent[x]
        return root

    for u, v in relations:
        parent.setdefault(u, u); parent.setdefault(v, v)
        ru, rv = find(u), find(v)
        if ru != rv:
            parent[ru] = rv
    if a not in parent or b not in parent:
        return False
    return find(a) == find(b)
```
</details>
