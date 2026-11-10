# Measure the Longest Root-to-Leaf Node Path
> Google · Other · easy · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/measure-the-longest-root-to-leaf-node-path

### Problem

Find the maximum depth of a binary tree. Depth counts nodes, so it is the greatest number of nodes on any path beginning at the root and ending at a leaf. An empty tree has depth 0.

```cpp
int maxDepth(TreeNode* root);
```

The supplied `TreeNode` contains `val`, `left`, and `right`. Brackets in examples describe its level-order structure, not an array parameter.

### Examples

```text
Input: root = [6,2,9,null,4,null,11,null,5]
Output: 4
```

The path through values 6,2,4,5 contains four nodes.

```text
Input: root = []
Output: 0
```

### Constraints

- There are between 0 and 10000 nodes.
- Each node value is between -100 and 100, inclusive.
