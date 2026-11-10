# Mirror Binary-Tree Child Links through the Original Root
> Google · Other · easy · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/mirror-binary-tree-child-links-through-the-original-root

### Problem

Invert a binary tree by exchanging left and right children throughout the tree, and return its root. Keep the supplied TreeNode interface with val, left and right fields.

```cpp
TreeNode* invertTree(TreeNode* root);
```

Example brackets display tree structure in level order; the argument and return are node pointers.

### Examples

```text
Input: root = [6,2,10,1,4,8,12]
Output tree: [6,10,2,12,8,4,1]
```

```text
Input: root = [5,null,9,7]
Output tree: [5,9,null,null,7]
```

### Constraints

- There are between 0 and 100 nodes.
- Values lie between -100 and 100.
