# Solve Flower Placement and Directory Deletion
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Medium · Pattern: Backtracking

## Problem
Two independent parts.

### Part 1 — Flower placement
A square garden is an `n x n` grid of `'.'` (soil) and `'#'` (rock). Plant exactly `n` flowers so that:
- each row and each column contains exactly one flower (the placement is a permutation),
- flowers are only planted on soil,
- no two flowers touch, not even diagonally (with one per row and column, this means flowers in consecutive rows cannot be in adjacent columns).

Return the placement as a list `cols` where `cols[row]` is the column of the flower in that row. If several placements exist, return the **lexicographically smallest** `cols`. If none exists, return `[]`.

### Part 2 — Directory deletion
A file system is given as a dict `fs` mapping each directory's full path to the list of its child names; any path that is not a key in `fs` is a file. A directory can only be deleted once it is empty. Return the order in which entries are deleted when deleting `root` and everything beneath it: every child is deleted before its parent, and children of a directory are processed in lexicographic order of name (each subtree is fully deleted before the next sibling). Child paths are `parent + "/" + name`. If `root` is a file, the result is just `[root]`.

The tree may be very deep, so implement it **iteratively** (explicit stack) rather than recursively, and be ready to compare the two.

## Function signature
```python
from typing import Dict, List

def place_flowers(garden: List[str]) -> List[int]: ...

def deletion_order(fs: Dict[str, List[str]], root: str) -> List[str]: ...
```

## Constraints
- Part 1: `1 <= n <= 12`
- Part 2: up to `10^5` entries, depth up to `10^5`; names contain no `/`

## Examples
**Example 1** (Part 1)
Input: `garden = ["....","....","....","...."]`
Output: `[1,3,0,2]`
Explanation: Columns 1, 3, 0, 2 differ pairwise and consecutive rows are at least 2 columns apart. Any placement starting with column 0 fails.

**Example 2** (Part 1, rocks)
Input: `garden = [".#..","....","#...","...."]`
Output: `[2,0,3,1]`

**Example 3** (Part 1, impossible)
Input: `garden = ["...","...","..."]` → `[]` (no valid arrangement exists for `n = 2` or `3`); `garden = ["."]` → `[0]`

**Example 4** (Part 2)
Input: `fs = {"/a": ["x.txt","b","c"], "/a/b": ["y.txt","z.txt"], "/a/c": []}`, `root = "/a"`
Output: `["/a/b/y.txt", "/a/b/z.txt", "/a/b", "/a/c", "/a/x.txt", "/a"]`
With `root = "/a/b/y.txt"` the output is `["/a/b/y.txt"]`.

<details><summary>Approach (spoiler)</summary>

Part 1: backtrack row by row, trying columns in increasing order, skipping rock cells, used columns, and columns adjacent to the previous row's column. Columns differ by construction, and only consecutive rows can touch diagonally, so these checks are complete. The first full placement found is lexicographically smallest.
Part 2: post-order traversal. Push `(path, False)`; when popped unexpanded, push `(path, True)` and then the children in reverse order; when popped expanded (or a file), record the deletion. This mirrors recursion without stack-depth limits.
**Time:** Part 1 O(n!) worst case with heavy pruning; Part 2 O(N log N) for sorting children · **Space:** O(n) / O(N)

```python
from typing import Dict, List

# Part 1
def place_flowers(garden: List[str]) -> List[int]:
    n = len(garden)
    cols_used = [False] * n
    placement: List[int] = []

    def backtrack(row: int) -> bool:
        if row == n:
            return True
        for c in range(n):
            if cols_used[c] or garden[row][c] == '#':
                continue
            if placement and abs(placement[-1] - c) == 1:   # diagonal touch with previous row
                continue
            cols_used[c] = True; placement.append(c)
            if backtrack(row + 1):
                return True
            cols_used[c] = False; placement.pop()
        return False

    return placement if backtrack(0) else []

# Part 2
def deletion_order(fs: Dict[str, List[str]], root: str) -> List[str]:
    order: List[str] = []
    stack = [(root, False)]
    while stack:
        path, children_done = stack.pop()
        if children_done or path not in fs:          # file, or directory already emptied
            order.append(path)
            continue
        stack.append((path, True))
        for child in sorted(fs[path], reverse=True):  # reverse so smallest name pops first
            stack.append((path + "/" + child, False))
    return order
```
</details>
