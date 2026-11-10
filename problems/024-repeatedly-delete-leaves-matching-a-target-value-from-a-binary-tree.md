# Repeatedly Delete Leaves Matching a Target Value From a Binary Tree
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Hard · Pattern: Tree Traversal / BST

## Problem
You are given a binary tree in level-order form (a list where `None` marks a missing child, as on LeetCode) and an integer `target`.

Delete every **leaf** node whose value equals `target`. Deleting a leaf may turn its parent into a leaf; if that parent's value also equals `target`, it must be deleted too. Keep doing this until no leaf has value `target`.

Return the resulting tree in level-order form, with trailing `None`s removed. If every node is deleted (including the root), return an empty list.

Notes:
- An internal node whose value equals `target` is **kept** as long as it still has at least one child after its subtrees have been processed.
- The root is treated like any other node: it is deleted only if it ends up as a matching leaf.

## Function signature
```python
from typing import List, Optional

def remove_target_leaves(level_order: List[Optional[int]], target: int) -> List[Optional[int]]:
    ...
```
(Equivalently, `def remove_leaf_nodes(root: Optional[TreeNode], target: int) -> Optional[TreeNode]` on a node-based tree.)

## Constraints
- Number of nodes in `[0, 3000]`
- `1 <= Node.val, target <= 1000`
- Tree height can be up to the number of nodes (skewed trees)

## Examples
**Example 1**
Input: `level_order = [1,2,3,2,None,2,4]`, `target = 2`
Output: `[1,None,3,None,4]`
Explanation: The two leaves with value 2 are deleted. The left child `2` of the root then becomes a leaf with value 2 and is deleted as well. Node `3` keeps child `4`.

**Example 2** (matching internal node keeps a child)
Input: `level_order = [1,3,3,3,2]`, `target = 3`
Output: `[1,3,None,None,2]`
Explanation: The leaf `3` (left child of the left `3`) and the right child `3` of the root are deleted. The remaining left `3` still has child `2`, so it stays.

**Example 3** (whole tree deleted)
Input: `level_order = [2,2,2]`, `target = 2`
Output: `[]`

**Example 4** (matching root with a non-matching child)
Input: `level_order = [2,None,3]`, `target = 2`
Output: `[2,None,3]`

<details><summary>Approach (spoiler)</summary>

Process the tree **post-order**: first recursively clean the left and right subtrees and reattach whatever they return, then check the current node. If it is now a leaf with value `target`, return `None` to its parent; otherwise return the node. Because children are handled before parents, cascading deletions happen naturally in a single pass. For very deep trees, an iterative post-order (or a raised recursion limit) avoids stack overflow.
**Time:** O(n) · **Space:** O(h) recursion (O(n) for the level-order conversion)

```python
from collections import deque
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def build(vals):
    if not vals or vals[0] is None: return None
    root = TreeNode(vals[0]); q = deque([root]); i = 1
    while q and i < len(vals):
        node = q.popleft()
        for side in ("left", "right"):
            if i < len(vals) and vals[i] is not None:
                child = TreeNode(vals[i]); setattr(node, side, child); q.append(child)
            i += 1
    return root

def serialize(root):
    out, q = [], deque([root])
    while q:
        node = q.popleft()
        if node is None: out.append(None); continue
        out.append(node.val); q.append(node.left); q.append(node.right)
    while out and out[-1] is None: out.pop()
    return out

def remove_target_leaves(level_order: List[Optional[int]], target: int) -> List[Optional[int]]:
    def prune(node):
        if node is None: return None
        node.left = prune(node.left)
        node.right = prune(node.right)
        if node.left is None and node.right is None and node.val == target:
            return None
        return node
    return serialize(prune(build(level_order)))
```
</details>
