# Find right-side view of binary tree
> Google · Technical Screen · easy · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/find-right-side-view-of-binary-tree

You are given the root of a binary tree.

From the **right side** of the tree, at each depth you can see exactly one node: the rightmost node at that depth.

Write a function that returns a list of the values of the nodes visible when looking at the tree from the right side, ordered from **top to bottom**.

---
### Function Signature (one possible form)
```text
rightSideView(root: TreeNode) -> List[int]
```

Where `TreeNode` is defined as:
```text
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
}
```

---
### Example
Consider this binary tree:

```text
    1
   / \
  2   3
   \   \
    5   4
```

The right-side view is:

```text
[1, 3, 4]
```

Explain the algorithm you would use, including its time and space complexity. You may use either breadth-first search (BFS) or depth-first search (DFS).

<details><summary>Hints (spoiler)</summary>

1. A level-order (BFS) traversal naturally groups nodes by depth — the last node you process at each level is exactly the one visible from the right.
2. Process the queue level by level: record the current queue size, dequeue that many nodes, and append the value of the final node in the batch to your answer.
3. Alternatively, run a DFS that recurses into the RIGHT child before the LEFT child; the first node you reach at each new depth is the right-side node.
4. Don't forget the empty-tree case: an empty input must return an empty list.
</details>
