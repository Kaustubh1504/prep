# Reconstruct a Tree from Preorder and Inorder Values
> Google · Other · medium · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/reconstruct-a-tree-from-preorder-and-inorder-values

### Problem

Reconstruct a binary tree from its preorder and inorder traversals and return its root node. Preorder visits root, left subtree, then right subtree; inorder visits left subtree, root, then right subtree. Both arrays describe the same tree and contain distinct values.

```cpp
TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder);
```

Use the original `TreeNode` fields `val`, `left`, and `right`. Output brackets below only display the resulting tree in level order.

### Examples

```text
Input: preorder = [8,3,1,6,11], inorder = [1,3,6,8,11]
Output tree: [8,3,11,1,6]
```

```text
Input: preorder = [2,5,7], inorder = [2,5,7]
Output tree: [2,null,5,null,7]
```

### Constraints

- Both arrays have the same length, between 1 and 3000.
- Every value is between -3000 and 3000, inclusive.
- Each array has unique values; the two arrays contain the same values.
- They are guaranteed to be valid preorder and inorder traversals of the same tree.
