# Return all binary search tree keys inside an inclusive range
> Google · Onsite · medium · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/return-all-binary-search-tree-keys-inside-an-inclusive-range

Given a binary search tree and an inclusive range `[low, high]`, return every key in the tree that lies within the range, in ascending order.

### Function Signature

```python
def keys_in_range(root: list[int | None], low: int, high: int) -> list[int]:
```

### Rules

- The tree is given in level order. The first element is the root. Then, for each non-null node in the order it appears, the list gives its left child followed by its right child, with `None` for a missing child. Trailing `None` values may be omitted. An empty list is an empty tree.
- All keys are distinct. For every node, every key in its left subtree is smaller than the node's key, and every key in its right subtree is larger.
- A key `x` is in range when `low <= x <= high`.
- Return the qualifying keys in strictly ascending order, or an empty list if there are none.

### Constraints

- The tree has between `0` and `100000` nodes.
- `-10^9 <= key <= 10^9` for every key
- `-10^9 <= low <= high <= 10^9`
- The tree is not necessarily balanced; its height can equal the number of nodes.

### Examples

**Example 1**

```text
Input:  root = [40, 20, 60, 10, 30, 50, 70, None, 15, 25], low = 14, high = 45
Output: [15, 20, 25, 30, 40]
```

The root 40 has children 20 and 60. Node 20 has children 10 and 30, node 60 has children 50 and 70, node 10 has only a right child 15, and node 30 has only a left child 25. Key 10 is below the range, and keys 50, 60 and 70 are above it.

**Example 2**

```text
Input:  root = [40, 20, 60, 10, 30, 50, 70, None, 15, 25], low = 61, high = 69
Output: []
```

No key lies between 61 and 69.

**Example 3**

```text
Input:  root = [40, 20, 60, 10, 30, 50, 70, None, 15, 25], low = 50, high = 50
Output: [50]
```

Both bounds are inclusive, so a range of a single value returns that key when it is present.

<details><summary>Hints (spoiler)</summary>

1. Every non-null entry in the level-order list is a node, and the positions of a node's children follow from the order in which the non-null nodes appear.
2. Both bounds are inclusive, and a node outside the range can still have descendants inside it.
3. The height can reach 100000, so make sure your traversal does not rely on deep recursion.
</details>

<details><summary>Approach (spoiler)</summary>

Parse, then walk the tree in sorted order while skipping subtrees that cannot contain an answer.

1. Parse the level-order list. Position 0 is the root. Keep a queue of node positions and a pointer i that starts at 1. Each dequeued node takes position i as its left child and position i+1 as its right child, where a None entry (or the end of the list) means no child. Each non-null child is enqueued. This processes nodes in exactly the order the encoding lists them, giving left/right child arrays indexed by list position.

2. Run an in-order traversal with an explicit stack. In-order visits a BST's keys in strictly ascending order, so appending each in-range key as it is visited produces the required order with no sort.

3. Prune safely. Descend into a node's left subtree only when its key > low: if key <= low, every left-subtree key is smaller than key and therefore smaller than low. Descend into its right subtree only when its key < high: if key >= high, every right-subtree key is larger than high. The visited keys form a subsequence of the full in-order sequence that still contains every in-range key, so the output is complete and ascending. A node outside the range is still entered on the side that can hold in-range keys, so in-range descendants of out-of-range nodes are never missed.

Invariant: the stack holds the ancestors whose own key and right side have not yet been processed, in descending key order from bottom to top.

Edge cases: an empty list returns []. If low == high, the result is [low] when low is a key and [] otherwise. A range wholly below or above all keys returns []. The explicit stack keeps a 100000-node chain from overflowing the call stack.

**Time:** O(n) · **Space:** O(n)
</details>
