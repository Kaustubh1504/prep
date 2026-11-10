# Group Binary-Tree Values by Left-to-Right Level
> Google · Other · medium · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/group-binary-tree-values-by-left-to-right-level

### Problem

Return the values of a binary tree one level at a time, starting at the root. Within each level, list nodes from left to right. Return a list of value lists, with one inner list for each nonempty depth.

Preserve the supplied `TreeNode` interface with `val`, `left`, and `right` fields:

```cpp
vector<vector<int>> levelOrder(TreeNode* root);
```

The examples display input trees in level order with `null` for missing children; that notation is not an array-based replacement for the pointer argument.

### Examples

```text
Input: root = [10,4,15,null,6,12,18]
Output: [[10],[4,15],[6,12,18]]
```

```text
Input: root = [-5,null,2,null,7]
Output: [[-5],[2],[7]]
```

### Constraints

- The tree has between 0 and 2000 nodes.
- Node values lie between -1000 and 1000, inclusive.
- Missing children are not output values. An empty tree returns an empty collection.
