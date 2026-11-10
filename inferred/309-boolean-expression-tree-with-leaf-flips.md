# Boolean Expression Tree with Leaf Flips
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Tree Traversal / BST

## Problem
A Boolean expression is stored as a tree of `n` nodes. Node `0` is the root, and `nodes[i]` is one of:
- `["VAL", b]`: a leaf with value `b`, which is `0` or `1`,
- `["NOT", c]`: the negation of child `c`,
- `["AND", l, r]` or `["OR", l, r]`: a binary operator on children `l` and `r`.

You also get a list of `flips`. Each entry is the index of a leaf, and processing it toggles that leaf's value. Apply the flips in order. After each flip, record the value of the **root** as a `bool`, and return the list of recorded values. If `flips` is empty, return `[]`. Flips are permanent, so each one builds on the ones before it, and the function may modify `nodes`.

Re-evaluating the whole tree after each flip costs O(n) per flip, which is too slow for many flips. Evaluate the tree once, then update only the path from the flipped leaf to the root. Stop as soon as a node's value doesn't change. The tree may be deep, so avoid recursion.

*Discussion follow-up:* for n-ary AND or OR nodes, keep a count of true children at each node, so updating an ancestor takes O(1) instead of O(degree).

## Function signature
```python
def root_after_flips(nodes: list[list], flips: list[int]) -> list[bool]:
```

## Constraints
- `1 <= n <= 10^5`, and the nodes form a valid tree rooted at 0
- `0 <= len(flips) <= 10^5`, and every flip index refers to a `"VAL"` node

## Examples
**Example 1**
Input: `nodes = [["OR",1,2],["AND",3,4],["NOT",5],["VAL",1],["VAL",0],["VAL",1]], flips = [4,3,5,5]`
Output: `[True, False, True, False]`
Explanation: The expression is `(A AND B) OR (NOT C)` with A = 1, B = 0 and C = 1, so it starts out False. Flip B to 1: `1 AND 1` is True. Flip A to 0: both sides are False. Flip C to 0: `NOT C` is True. Flip C back to 1: False.

**Example 2**
Input: `nodes = [["AND",1,2],["OR",3,4],["VAL",1],["VAL",0],["VAL",0]], flips = [3,4,3,2]`
Output: `[True, True, True, False]`
Explanation: The second flip makes both inputs of the OR true, so the OR's value stays the same and the upward walk stops there.

**Example 3** (an edge case: the root is a leaf)
Input: `nodes = [["VAL",0]], flips = [0,0]`
Output: `[True, False]`

<details><summary>Approach (spoiler)</summary>

Build parent pointers and evaluate every node bottom-up in iterative post-order, caching `val[i]`. To flip a leaf, toggle it and walk up the parent pointers, recomputing each node from its children's cached values. If a node's recomputed value equals its old value, stop, because no ancestor can change. Each flip therefore costs O(depth) in the worst case, and the early exit usually makes it much cheaper. For example, an OR that already has another true child absorbs the change.
**Time:** O(n) preprocessing, O(h) per flip · **Space:** O(n)

```python
def root_after_flips(nodes: list[list], flips: list[int]) -> list[bool]:
    n = len(nodes)
    parent = [-1] * n
    for i, node in enumerate(nodes):
        for c in node[1:] if node[0] != "VAL" else ():
            parent[c] = i
    val = [False] * n

    def compute(i: int) -> bool:
        op = nodes[i][0]
        if op == "VAL":
            return bool(nodes[i][1])
        if op == "NOT":
            return not val[nodes[i][1]]
        if op == "AND":
            return val[nodes[i][1]] and val[nodes[i][2]]
        return val[nodes[i][1]] or val[nodes[i][2]]       # "OR"

    # initial evaluation in post-order, iteratively (the tree may be deep)
    order, stack = [], [0]
    while stack:
        u = stack.pop()
        order.append(u)
        if nodes[u][0] != "VAL":
            stack.extend(nodes[u][1:])
    for u in reversed(order):
        val[u] = compute(u)

    out = []
    for leaf in flips:
        nodes[leaf][1] = 1 - nodes[leaf][1]
        u = leaf
        while u != -1:
            new = compute(u)
            if new == val[u]:
                break                                     # nothing above can change
            val[u] = new
            u = parent[u]
        out.append(val[0])
    return out
```
</details>
