# Collect Every Target-Sum Root-to-Leaf Value Path
> Google · Other · medium · Pattern: Tree Traversal / BST, Backtracking
> Source: https://prachub.com/interview-questions/collect-every-target-sum-root-to-leaf-value-path

### Problem

Return every root-to-leaf path in a binary tree whose node values sum to `targetSum`. Each returned path is a list of values in root-to-leaf order, not a list of node references. A leaf has no children.

Paths are identified by their node positions. If two different qualifying paths have the same value sequence, include that sequence twice. No ordering between different paths is prescribed.

```cpp
vector<vector<int>> pathSum(TreeNode* root, int targetSum);
```

Keep the supplied `TreeNode` pointer interface. Example tree brackets use level-order notation.

### Examples

```text
Input: root = [4,2,6,3,1,-1,0], targetSum = 9
One valid output: [[4,2,3],[4,6,-1]]
```

```text
Input: root = [2,1,1], targetSum = 3
Output: [[2,1],[2,1]]
```

The two leaves in the second example represent two paths, even though their values match.

### Constraints

- The tree has between 0 and 5000 nodes.
- Every node value and `targetSum` lie between -1000 and 1000, inclusive.
- Empty input has no root-to-leaf paths and returns an empty collection.

### What a Strong Answer Covers

- Every qualifying complete root-to-leaf path, returned as values.
- Multiplicity when distinct node paths have equal value sequences.
- Negative values, leaf-only matching, and output-sensitive copying cost.

### Follow-up Questions

- What should be returned when two qualifying leaves produce the same value sequence?
- Why does an internal path prefix that reaches the target not yet qualify?
