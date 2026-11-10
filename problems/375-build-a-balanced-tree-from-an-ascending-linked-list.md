# Build a Balanced Tree from an Ascending Linked List
> Google · Other · medium · Pattern: Tree Traversal / BST, Linked List
> Source: https://prachub.com/interview-questions/build-a-balanced-tree-from-an-ascending-linked-list

### Problem

Convert an ascending singly linked list into a height-balanced binary search tree and return the tree's root. Preserve every input value occurrence. For this exercise, a BST uses nondecreasing inorder order: all values in a left subtree are at most the root value, and all values in a right subtree are at least the root value. Equal keys may appear on either side. At every tree node, the heights of the left and right subtrees must differ by at most one.

Preserve the original node interfaces:

```cpp
TreeNode* sortedListToBST(ListNode* head);
```

`ListNode` contains `val` and `next`; `TreeNode` contains `val`, `left`, and `right`. List brackets describe a linked chain, and output brackets illustrate a tree in level order. Any valid balanced construction is acceptable.

### Examples

```text
Input list: [-5,0,6,12]
One valid output tree: [6,0,12,-5]
```

```text
Input list: []
Output tree: []
```

### Constraints & Assumptions

- The input list has between 0 and 20000 nodes.
- Each value is between -100000 and 100000, inclusive.
- The list is sorted in ascending order.
- The nondecreasing-inorder convention above applies even when equal values occur; no distinctness assumption is added.

### What a Strong Answer Covers

- Every list occurrence represented in the balanced tree's inorder sequence.
- The stated equal-key convention, without an unpromised distinctness assumption.
- Original node-pointer interfaces and the time and working-space costs.

### Follow-up Questions

- What tree is returned for an empty list?
- Under the stated convention, how can three equal input values form a balanced tree?
