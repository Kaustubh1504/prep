# Test for an Exact Descendant Subtree Match
> Google · Other · easy · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/test-for-an-exact-descendant-subtree-match

### Problem

Return whether some node of root, together with all its descendants, forms a tree identical to subRoot in both shape and values. The whole root tree is also a candidate subtree. Both parameters are TreeNode pointers.

```cpp
class Solution {
public:
    bool isSubtree(TreeNode* root, TreeNode* subRoot);
};
```

### Examples

**Example 1:**

```text
root = [8,4,11,2,6], subRoot = [4,2,6]
Output: true
Explanation: The subtree beginning at node 4 matches exactly.
```

**Example 2:**

```text
root = [8,4,11,2,6], subRoot = [4,2]
Output: false
Explanation: The extra descendant 6 prevents an exact match.
```

### Constraints

- The main tree has 1..2000 nodes; the proposed subtree has 1..1000. In either tree, values lie in -10000..10000.

### Clarifying Questions

Compare full structure, including absent children, and allow the match to start at the root itself.

```hint Read the boundary condition
How can an equality check distinguish a missing child from an extra descendant?
```

### Contract considerations

Compare full structure, including absent children, and allow the match to start at the root itself.
