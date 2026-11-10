# Construct the Unique Maximum-Root Binary Tree
> Google · Other · medium · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/construct-the-unique-maximum-root-binary-tree

### Problem

Given distinct nums values, create a tree whose root is the maximum value. Its left subtree is constructed from values before that maximum, and its right subtree from values after it, recursively. Return the resulting TreeNode*. Empty subarrays produce null children.

```cpp
class Solution {
public:
    TreeNode* constructMaximumBinaryTree(vector<int>& nums);
};
```

### Examples

**Example 1:**

```text
nums = [2,5,1,4]
Output: [5,2,4,null,null,1]
Explanation: Five splits the array into [2] and [1,4].
```

**Example 2:**

```text
nums = [1,3,6]
Output: [6,3,null,1]
Explanation: Increasing values form a chain of left children.
```

### Constraints

- Array size: 1..1000. All values are distinct integers in 0..1000.

### Clarifying Questions

Preserve original inorder sequence, maximum-at-root structure and the native TreeNode return type.

```hint Read the boundary condition
Which right-spine nodes become smaller than a newly scanned value?
```

### Contract considerations

Preserve original inorder sequence, maximum-at-root structure and the native TreeNode return type.
