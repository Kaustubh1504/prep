# Measure the Smallest Gap Between BST Node Values
> Google · Other · easy · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/measure-the-smallest-gap-between-bst-node-values

### Problem

Given a binary search tree through TreeNode* root, return the minimum absolute difference between values stored in two different nodes. TreeNode exposes val, left and right.

```cpp
class Solution {
public:
    int getMinimumDifference(TreeNode* root);
};
```

### Examples

**Example 1:**

```text
root = [8,3,12,1,6]
Output: 2
Explanation: Values 1 and 3 differ by 2.
```

**Example 2:**

```text
root = [10,4,15]
Output: 5
Explanation: The closest values are 10 and 15.
```

### Constraints

- Tree size: 2..10000 nodes. Stored values: 0..100000.

### Clarifying Questions

Exploit sorted inorder values and compare different node occurrences without assuming a particular tree balance.

```hint Read the boundary condition
Which pairs need inspection once all values are in sorted order?
```

### Contract considerations

Exploit sorted inorder values and compare different node occurrences without assuming a particular tree balance.
