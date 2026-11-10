# Find Original-Node Common Ancestors in a Search Tree
> Google · Other · medium · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/find-original-node-common-ancestors-in-a-search-tree

### Problem

Given a BST root and two different original nodes p and q in it, return their lowest common ancestor node. A node counts as its own ancestor. Preserve all three TreeNode* arguments and the TreeNode* result.

```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q);
```

### Examples

```text
root = [7,3,11,1,5,9,13], p = node 3, q = node 5 -> original node 3
root = [7,3,11,1,5,9,13], p = node 1, q = node 13 -> original node 7
```

### Constraints

- There are 2 through 100000 nodes with unique values in [-1000000000,1000000000].
- p and q differ and both belong to the tree.
