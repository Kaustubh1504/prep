# Validate parent array forms a tree
> Google · Technical Screen · medium · Pattern: Graph BFS / DFS, Tree Traversal / BST
> Source: https://prachub.com/interview-questions/validate-parent-array-forms-a-tree

## Problem
You are given an integer array `parent` of length `n` describing a directed parent pointer for each node `i` (nodes are labeled `0..n-1`).

- `parent[i]` is the parent of node `i`.
- Exactly one node should be the root, indicated by `parent[root] = -1`.

Determine whether these `n` nodes form a **valid rooted tree**.

A valid rooted tree must satisfy all of the following:
1. **Exactly one root** (exactly one index `i` with `parent[i] = -1`).
2. **No cycles** (following parent pointers from any node must eventually reach the root).
3. **Connectivity** (every node is reachable from the root; equivalently, every node has exactly one simple path to the root).

## Input
- `parent`: integer array of length `n` where each value is either `-1` or in `[0, n-1]`.

## Output
- Return `true` if `parent` represents a valid rooted tree; otherwise return `false`.

## Notes / Edge Cases
- `n` can be 1 (then the only valid tree is `parent[0] = -1`).
- Self-parenting like `parent[i] = i` is invalid.
- Multiple `-1` entries (multiple roots) is invalid.
- A cycle among non-root nodes is invalid.
- A disconnected component (some nodes not reachable from the root) is invalid.

<details><summary>Hints (spoiler)</summary>

1. First count how many roots there are. A valid tree must have exactly one `-1` entry.
2. Build children lists from the parent array, then traverse from the root. If you do not visit every node, the structure is disconnected or contains a cycle away from the root.
</details>
