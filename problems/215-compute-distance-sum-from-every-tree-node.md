# Compute distance-sum from every tree node
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Hard · Pattern: Tree Traversal / BST

## Problem
You are given an undirected, connected tree with `n` nodes labelled `0` to `n-1`, as a list of `n-1` edges. For every node `i`, compute the sum of the distances, measured in edges, from `i` to every other node. Return an array `answer` with `answer[i]` equal to that sum.

Running a BFS from every node takes O(n²) and is too slow. The target is O(n). A single node with no edges returns `[0]`. (This matches LeetCode 834, "Sum of Distances in Tree".)

## Function signature
```python
def sum_of_distances(n: int, edges: list[list[int]]) -> list[int]:
```

## Constraints
- `1 <= n <= 3 * 10^4`
- `edges.length == n - 1`; the edges form a tree
- Deep trees (for example a path of length `n`) must not overflow the recursion stack

## Examples
**Example 1**
Input: `n = 6`, `edges = [[0,1],[0,2],[2,3],[2,4],[2,5]]`
Output: `[8,12,6,10,10,10]`
Explanation: From node 0, the distances to nodes 1 through 5 are `1,1,2,2,2`, which sum to 8.

**Example 2** (a path)
Input: `n = 4`, `edges = [[0,1],[1,2],[2,3]]`
Output: `[6,4,4,6]`

**Example 3** (tiny trees)
Input: `n = 1`, `edges = []`
Output: `[0]`

Input: `n = 2`, `edges = [[1,0]]`
Output: `[1,1]`

<details><summary>Approach (spoiler)</summary>

This is a two-pass "rerooting" DP. Root the tree at 0. In a post-order pass, compute `size[u]`, the number of nodes in `u`'s subtree, and `down[u]`, the sum of distances from `u` to the nodes in its subtree: `down[p] += down[c] + size[c]`. Then `answer[0] = down[0]`. In a pre-order pass, move the root from a parent `p` to its child `c`. The `size[c]` nodes in `c`'s subtree each get 1 closer and the other `n - size[c]` nodes each get 1 farther, so `answer[c] = answer[p] - size[c] + (n - size[c])`. Use an iterative DFS order to avoid recursion limits.

**Time:** O(n) · **Space:** O(n)

```python
def sum_of_distances(n, edges):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    parent, order = [-1] * n, []
    seen = [False] * n
    stack, seen[0] = [0], True
    while stack:                                # iterative pre-order
        u = stack.pop()
        order.append(u)
        for v in adj[u]:
            if not seen[v]:
                seen[v] = True
                parent[v] = u
                stack.append(v)
    size, down = [1] * n, [0] * n
    for u in reversed(order):                   # post-order accumulation
        p = parent[u]
        if p >= 0:
            size[p] += size[u]
            down[p] += down[u] + size[u]
    ans = [0] * n
    ans[0] = down[0]
    for u in order:                             # reroot parent -> child
        p = parent[u]
        if p >= 0:
            ans[u] = ans[p] - size[u] + (n - size[u])
    return ans
```
</details>
