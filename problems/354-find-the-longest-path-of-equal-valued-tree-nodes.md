# Find the Longest Path of Equal-Valued Tree Nodes
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Tree Traversal / BST

## Problem
You are given a **binary tree** encoded as a breadth-first (level-order) list in the LeetCode style: `level[0]` is the root, and the children of each non-null node are listed in order (left, then right) as the list is read; `None` marks a missing child, and missing children of `None` entries are not listed. Trailing `None`s may be omitted. An empty list (or `[None]`) is an empty tree.

Clarification: although the interviewer may loosely call it a "BST", the tree is a **general binary tree** — values are not ordered and equal values may appear anywhere. Do not rely on any search-tree property.

Return the length, measured in **edges**, of the longest path in which every node has the **same value**. A path is any sequence of nodes connected by parent–child edges with no node repeated; it may go down one side of a node (a "one-sided" path) or pass **through** a node, joining a path from its left subtree with a path from its right subtree. A tree with zero or one node has answer `0`.

The tree can be very deep (a degenerate chain of up to `10^5` nodes), so the solution must not depend on deep recursion.

## Function signature
```python
from typing import List, Optional

def longest_univalue_path(level: List[Optional[int]]) -> int:
    ...
```

## Constraints
- `0 <= number of nodes <= 10^5`
- `-1000 <= node value <= 1000`
- Tree depth can be up to the number of nodes

## Examples
**Example 1**
Input: `level = [5, 4, 5, 1, 1, None, 5]`
Output: `2`
Explanation: The root 5, its right child 5 and that node's right child 5 form a path of 2 edges.

**Example 2** (path through a node)
Input: `level = [1, 4, 5, 4, 4, None, 5]`
Output: `2`
Explanation: The path `4 – 4 – 4` goes from the left grandchild, up through the left child, down to the right grandchild.

**Example 3** (an edge case)
Input: `level = [2, None, 2, None, 2, None, 2]`
Output: `3`
Explanation: A right-leaning chain of four 2's. (`[]` and `[7]` both give `0`.)

<details><summary>Approach (spoiler)</summary>

Decode the list with a queue, which also yields the nodes in BFS order — every parent precedes its children. Processing that order **in reverse** therefore visits children before parents, giving a post-order without recursion. For each node compute `down[node]`, the longest one-sided equal-valued path going downward: an arm toward a child counts `down[child] + 1` only if the child has the same value. The best path through a node is `arm_left + arm_right`; the answer is the maximum over all nodes. This is the same recurrence as recursive DFS, just driven by an explicit order.
**Time:** O(n) · **Space:** O(n)

```python
from typing import List, Optional

def longest_univalue_path(level: List[Optional[int]]) -> int:
    if not level or level[0] is None:
        return 0
    n = len(level)
    left, right = {}, {}
    order = [0]          # BFS order of node indices
    head, i = 0, 1
    while head < len(order) and i < n:
        p = order[head]
        head += 1
        if i < n and level[i] is not None:
            left[p] = i
            order.append(i)
        i += 1
        if i < n and level[i] is not None:
            right[p] = i
            order.append(i)
        i += 1

    down = {}
    best = 0
    for p in reversed(order):  # children before parents
        arm_l = down[left[p]] + 1 if p in left and level[left[p]] == level[p] else 0
        arm_r = down[right[p]] + 1 if p in right and level[right[p]] == level[p] else 0
        down[p] = max(arm_l, arm_r)
        best = max(best, arm_l + arm_r)
    return best
```
</details>
