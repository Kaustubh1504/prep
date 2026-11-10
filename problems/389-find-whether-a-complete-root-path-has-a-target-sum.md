# Find Whether a Complete Root Path Has a Target Sum
> Google · Other · easy · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/find-whether-a-complete-root-path-has-a-target-sum

### Problem

Decide whether a binary tree contains a root-to-leaf path whose values add up to `targetSum`. Return a Boolean. The path must start at the root and end at a node with no children; stopping at an internal node is insufficient. An empty tree has no qualifying path.

```cpp
bool hasPathSum(TreeNode* root, int targetSum);
```

Keep the supplied `TreeNode` pointer interface. Brackets display level-order tree structure.

### Examples

```text
Input: root = [4,-2,7,3,null,-1,2], targetSum = 5
Output: true
```

The path 4→-2→3 sums to 5.

```text
Input: root = [4,-2], targetSum = 4
Output: false
```

The root has a child, so its value alone is not a root-to-leaf path.

### Constraints

- The tree contains between 0 and 5000 nodes.
- Every node value and `targetSum` are between -1000 and 1000, inclusive.
