# Reconstruct a Tree from Inorder and Postorder Values
> Google · Other · medium · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/reconstruct-a-tree-from-inorder-and-postorder-values

### Problem

Construct the binary tree described by its inorder and postorder traversals, then return its root. Inorder visits left subtree, root, right subtree. Postorder visits left subtree, right subtree, root. The arrays contain unique values and are valid traversals of the same tree.

```cpp
TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder);
```

Keep the supplied `TreeNode` interface. Output brackets illustrate a tree in level order.

### Examples

```text
Input: inorder = [-1,2,4,7,9], postorder = [-1,4,2,9,7]
Output tree: [7,2,9,-1,4]
```

```text
Input: inorder = [4,6,8], postorder = [4,6,8]
Output tree: [8,6,null,4]
```

### Constraints

- The two lengths are equal and between 1 and 3000.
- All values lie between -3000 and 3000, inclusive.
- Each array contains distinct values and the same value set as the other.
- Both traversals are guaranteed to describe the same valid binary tree.
