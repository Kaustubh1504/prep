# Flatten Existing Tree Nodes into a Preorder Right Chain
> Google · Other · medium · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/flatten-existing-tree-nodes-into-a-preorder-right-chain

### Problem

Flatten a binary tree into its preorder node sequence using the same existing `TreeNode` objects. After the call, every `left` pointer must be null, and each `right` pointer must lead to the next node in the original root-left-right preorder. The last node's `right` pointer is null.

The original function mutates the tree and returns nothing:

```cpp
void flatten(TreeNode* root);
```

The nodes still use `val`, `left`, and `right`; do not replace them with a different linked-list node type. Example brackets describe the input tree in level order. The displayed output chain follows right pointers.

### Examples

```text
Input: root = [8,3,12,1,6,null,15]
Right-pointer chain after the call: 8 -> 3 -> 1 -> 6 -> 12 -> 15 -> null
Every left pointer: null
```

```text
Input: root = []
After the call: empty tree
```

### Constraints

- The tree contains between 0 and 2000 nodes.
- Node values are between -100 and 100, inclusive.

### Optional follow-up

Can the flattening be done in place using `O(1)` extra space?
