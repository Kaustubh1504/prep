# Delete a Node From a Search Tree
> Google · Onsite · hard · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/delete-a-node-from-a-search-tree

Given the root of a binary search tree and an integer `key`, delete the node whose value equals `key` if it exists. Return the possibly new root while preserving the binary search tree property.

A binary search tree has this property: for every node, all values in its left subtree are smaller than the node value, and all values in its right subtree are larger.

Example:

```text
Input:
        5
       / \
      3   6
     / \   \
    2   4   7

key = 3

One valid output:
        5
       / \
      4   6
     /     \
    2       7
```

### Constraints & Assumptions

- Values are unique unless the interviewer states a duplicate policy.
- Return the original root if `key` is not found.
- The node to delete may be a leaf, have one child, have two children, or be the root.
- An iterative or recursive solution is acceptable.
- Aim for `O(h)` time where `h` is the tree height.

### Clarifying Questions to Ask

- Are duplicate values possible, and if so where are duplicates stored?
- Should we use the inorder successor, inorder predecessor, or either for the two-child case?
- Is the tree balanced, or can it be skewed?
- Should the function mutate the existing tree or build a new tree?

### What a Strong Answer Covers

- Search for the node using BST ordering.
- Correct handling of missing key.
- Leaf deletion.
- One-child deletion by returning the child.
- Two-child deletion by replacing with inorder successor or predecessor.
- Correct root replacement.
- Time and space complexity.

### Follow-up Questions

- How would the complexity change for a balanced BST versus a skewed BST?
- How would you write the solution iteratively?
- How would you handle duplicate keys?
- How would deletion work in a self-balancing tree such as AVL or Red-Black tree?

<details><summary>Hints (spoiler)</summary>

1. Choose a representation that makes the requested operation direct.
2. Handle empty inputs and boundary cases first.
</details>
