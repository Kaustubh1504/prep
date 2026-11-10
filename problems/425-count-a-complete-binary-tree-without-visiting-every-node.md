# Count a Complete Binary Tree without Visiting Every Node
> Google · Other · medium · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/count-a-complete-binary-tree-without-visiting-every-node

### Problem

Return the node count of a complete binary tree. Every level except possibly the last is full, and the last level's nodes occupy the leftmost positions without gaps. Use an algorithm taking less than linear time in the number of nodes.

```cpp
int countNodes(TreeNode* root);
```

Preserve the original TreeNode pointer interface. Example brackets display tree structure.

### Examples

```text
Input: root = [9,4,12,2,6,10]
Output: 6
```

```text
Input: root = []
Output: 0
```

### Constraints

- Node count is between 0 and 50000.
- Values lie between 0 and 50000.
- The tree is guaranteed complete.
