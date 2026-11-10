# Traverse Binary-Tree Values in Left-Root-Right Order
> Google · Other · easy · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/traverse-binary-tree-values-in-left-root-right-order

### Problem

Return the node values of a binary tree in inorder: traverse the left subtree, then the current node, then the right subtree. The input is an arbitrary binary tree, not necessarily a binary search tree.

Use the supplied `TreeNode`, with `val`, `left`, and `right` fields:

```cpp
vector<int> inorderTraversal(TreeNode* root);
```

Tree examples use level-order notation, with `null` for a missing child. The actual input remains a node pointer.

### Examples

```text
Input: root = [4,2,7,null,3,6]
Output: [2,3,4,6,7]
```

```text
Input: root = [9,null,-1]
Output: [9,-1]
```

### Constraints

- The tree has between 0 and 100 nodes.
- Node values lie between -100 and 100, inclusive.

### Source follow-up

In addition to the recursive method, perform the traversal iteratively.
