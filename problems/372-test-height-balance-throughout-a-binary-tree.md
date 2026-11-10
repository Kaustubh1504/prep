# Test Height Balance throughout a Binary Tree
> Google · Other · easy · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/test-height-balance-throughout-a-binary-tree

### Problem

Determine whether a binary tree is height-balanced. At every node, the heights of its left and right subtrees must differ by at most one. Height counts nodes on the longest downward path; an empty subtree has height 0.

```cpp
bool isBalanced(TreeNode* root);
```

Use the supplied `TreeNode` with `val`, `left`, and `right`. Example brackets describe tree structure in level order.

### Examples

```text
Input: root = [8,4,12,2,6,null,14]
Output: true
```

```text
Input: root = [8,4,12,2,null,10,null,1,null,9]
Output: false
```

In the second tree the root's two subtree heights agree, but each child subtree has an internal imbalance.

### Constraints

- The tree contains between 0 and 5000 nodes.
- Values lie between -10000 and 10000, inclusive.
- An empty tree is balanced.
