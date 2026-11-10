# Find cheapest common ancestor in a tree
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Tree Traversal / BST

## Problem
You are given a rooted tree of `n` nodes labelled `0 .. n-1` as a parent array: `parent[i]` is the parent of node `i`, and `parent[root] = -1` for the single root. Each node also has a price, `prices[i]`.

For two nodes `a` and `b`, a **common ancestor** is any node that lies on the path from `a` to the root **and** on the path from `b` to the root. A node counts as its own ancestor, so if `a` is an ancestor of `b`, then `a` itself is a common ancestor (and `a == b` is allowed).

Return the common ancestor of `a` and `b` with the **minimum price**. If several common ancestors share the minimum price, return the **deepest** one (the one closest to `a` and `b`).

Note that all common ancestors form exactly the chain from the lowest common ancestor (LCA) up to the root.

## Function signature
```python
from typing import List

def cheapest_common_ancestor(parent: List[int], prices: List[int], a: int, b: int) -> int:
    ...
```

## Constraints
- `1 <= n <= 10^5`
- `parent` describes a valid rooted tree with exactly one `-1`
- `-10^9 <= prices[i] <= 10^9`
- `0 <= a, b < n`
- Follow-up: many queries on the same tree

## Examples
**Example 1**
Input: `parent = [-1, 0, 0, 1, 1, 2]`, `prices = [3, 1, 5, 4, 2, 6]`, `a = 3, b = 4`
Output: `1`
Explanation: The tree is `0 → {1, 2}`, `1 → {3, 4}`, `2 → {5}`. Common ancestors of 3 and 4 are `{1, 0}` with prices 1 and 3, so node 1. For `a = 3, b = 5` the only common ancestor is the root, so the answer is `0`. For `a = 4, b = 1` node 1 is itself a common ancestor, giving `1`.

**Example 2** (tie / same node)
Input: `parent = [-1, 0, 1, 2]`, `prices = [2, 7, 2, 9]`, `a = 3, b = 3`
Output: `2`
Explanation: A chain `0 – 1 – 2 – 3`. Common ancestors of 3 with itself are `{3, 2, 1, 0}`; nodes 2 and 0 both cost 2, and the deeper node 2 wins.

<details><summary>Approach (spoiler)</summary>

Find the LCA by computing both depths, lifting the deeper node until depths match, then lifting both together until they meet. Every common ancestor lies on the chain from the LCA to the root, so walk that chain and keep the strictly cheapest node seen first — walking upward from the LCA means ties keep the deeper node. For many queries, precompute with one top-down pass `best_up[v]` = cheapest node on the path from `v` to the root (deepest on ties) and use binary lifting for LCA, giving O(log n) per query with the answer `best_up[lca]`.
**Time:** O(h) per query (h = tree height) · **Space:** O(1) extra

```python
from typing import List

def cheapest_common_ancestor(parent: List[int], prices: List[int], a: int, b: int) -> int:
    def depth(x: int) -> int:
        d = 0
        while parent[x] != -1:
            x = parent[x]
            d += 1
        return d

    da, db = depth(a), depth(b)
    while da > db:
        a, da = parent[a], da - 1
    while db > da:
        b, db = parent[b], db - 1
    while a != b:
        a, b = parent[a], parent[b]

    best = node = a  # the LCA
    while node != -1:
        if prices[node] < prices[best]:  # strict: deeper node wins ties
            best = node
        node = parent[node]
    return best
```
</details>
