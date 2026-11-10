# Search a Pattern Across the Leaf Text of a Binary Tree
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Tree Traversal / BST

## Problem
A binary tree has `n` nodes, numbered `0` to `n - 1`, with node `0` as the root. It is given as two arrays: `left[i]` and `right[i]` are the children of node `i`, or `-1` when there is no child. Every leaf (a node with no children) holds a string `leaf_text[i]`. Internal nodes also have an entry in `leaf_text`, but it is ignored (usually `""`).

Join the leaf strings in left-to-right order (the order an in-order or pre-order traversal visits the leaves) to form one long text `T`. Return `True` if `pattern` appears as a contiguous substring of `T`, and `False` otherwise. Matches may span leaf boundaries. For example, with leaves `"ab"` and `"cd"`, the pattern `"bc"` matches.

Edge cases:
- An empty `pattern` always matches, so return `True`.
- A leaf string can be empty. It adds nothing to `T`.

The total leaf text can be large. A good solution streams through the leaves with a linear-time matcher (KMP) and does not run a naive O(|T|·|P|) search. Use an iterative traversal, because the tree can be very deep.

## Function signature
```python
def contains_pattern(left: list[int], right: list[int], leaf_text: list[str], pattern: str) -> bool:
```

## Constraints
- `1 <= n <= 10^5`
- `len(left) == len(right) == len(leaf_text) == n`, and the arrays describe a valid binary tree rooted at 0
- Total length of all leaf strings is at most `10^6`
- `0 <= len(pattern) <= 10^5`
- Strings use lowercase English letters

## Examples
**Example 1**
Input: `left = [1,-1,-1], right = [2,-1,-1], leaf_text = ["","ab","cd"], pattern = "bc"`
Output: `True`
Explanation: The leaf text is `"ab" + "cd" = "abcd"`. The match `"bc"` crosses the boundary between the two leaves.

**Example 2**
Input: `left = [1,3,-1,-1,-1], right = [2,4,-1,-1,-1], leaf_text = ["","","ca","ab","ra"], pattern = "abrac"`
Output: `True`
Explanation: The leaves in order are node 3 `"ab"`, node 4 `"ra"`, then node 2 `"ca"`. So T = `"abraca"`, which contains `"abrac"`.

**Example 3**
Same tree as Example 2, `pattern = "cab"`
Output: `False`

**Example 4** (an edge case)
Input: `left = [1,-1,-1], right = [2,-1,-1], leaf_text = ["xyz","a",""], pattern = "ay"`
Output: `False`
Explanation: The root is internal, so its text `"xyz"` is ignored. T = `"a"`.

<details><summary>Approach (spoiler)</summary>

Build the KMP failure function for `pattern`. Then visit the leaves left to right with an explicit stack (push the right child before the left child) and feed each leaf's characters into the KMP automaton. The matched-prefix length `j` carries over from one leaf to the next, so matches that cross leaf boundaries are found automatically. T is never built in memory. Return `True` as soon as `j == len(pattern)`.
**Time:** O(n + |T| + |P|) · **Space:** O(|P| + h), where h is the tree height

```python
def contains_pattern(left, right, leaf_text, pattern):
    if not pattern:
        return True
    m = len(pattern)
    lps = [0] * m
    k = 0
    for i in range(1, m):
        while k and pattern[i] != pattern[k]:
            k = lps[k - 1]
        if pattern[i] == pattern[k]:
            k += 1
        lps[i] = k

    j = 0                       # matched prefix length, carried across leaves
    stack = [0]
    while stack:
        node = stack.pop()
        if left[node] == -1 and right[node] == -1:
            for ch in leaf_text[node]:
                while j and ch != pattern[j]:
                    j = lps[j - 1]
                if ch == pattern[j]:
                    j += 1
                    if j == m:
                        return True
            continue
        if right[node] != -1:
            stack.append(right[node])
        if left[node] != -1:
            stack.append(left[node])
    return False
```
</details>
