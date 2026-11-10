# Find mode in a trinary search tree
> Google · Technical Screen · medium · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/find-mode-in-a-trinary-search-tree

You are given the root of a **trinary search tree** where each node has up to three children:

```text
class Node {
  int val;
  Node left;    // all values < val
  Node middle;  // all values = val
  Node right;   // all values > val
}
```

Assume the tree is intended to satisfy the ordering rules above.

## Task
Return the **mode(s)** of the tree: the value(s) that occur most frequently among all nodes.

- If there is one mode, return a single-element list.
- If multiple values tie for highest frequency, return **all** such values (in any order).

## Constraints (typical)
- Number of nodes `n` can be large (e.g., up to `10^5`).
- Values can be any 32-bit signed integers.

## Follow-up
How would your approach change if the tree is **broken** (i.e., it may not respect the `<`, `=`, `>` constraints), but you still must return the correct mode(s)?

<details><summary>Hints (spoiler)</summary>

1. In a valid trinary search tree, an inorder traversal using left, node, middle, right visits values in nondecreasing order.
2. Because equal values appear consecutively during that traversal, you can track only the current run length and the best run length so far.
</details>
