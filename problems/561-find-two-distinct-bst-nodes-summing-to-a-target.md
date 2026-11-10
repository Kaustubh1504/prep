# Find Two Distinct BST Nodes Summing to a Target
> Google · Other · easy · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/find-two-distinct-bst-nodes-summing-to-a-target

### Problem

Return whether the binary search tree rooted at root has two different nodes whose values sum to k. The function receives TreeNode* with val,left,right; a node may not be reused as both summands.

```cpp
class Solution {
public:
    bool findTarget(TreeNode* root, int k);
};
```

### Examples

**Example 1:**

```text
root = [8,3,11,1,6], k = 9
Output: true
Explanation: Nodes 3 and 6 sum to 9.
```

**Example 2:**

```text
root = [5], k = 10
Output: false
Explanation: The single node cannot be used twice.
```

### Constraints

- The input is a valid BST with 1..10000 nodes. Node values: -10000..10000. Target k: -100000..100000.

### Clarifying Questions

Enforce distinct nodes and check the complement before adding the current node to the seen set.

```hint Read the boundary condition
How can a complement lookup avoid matching a node with itself?
```

### Contract considerations

Enforce distinct nodes and check the complement before adding the current node to the seen set.
