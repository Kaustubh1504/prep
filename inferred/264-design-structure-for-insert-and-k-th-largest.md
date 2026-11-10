# Design structure for insert and k-th largest
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Design / Data Structure

## Problem
Design a data structure that keeps a **multiset** of integers, so duplicates are allowed and each copy counts separately. It supports two operations:
- `insert(x)`: add one copy of `x`.
- `kth_largest(k)`: return the k-th largest value currently stored, counting duplicates separately. `k = 1` is the maximum. If `k < 1` or `k` is greater than the number of stored values, return `None`.

You also implement a driver `process(operations)`. Each operation is either `["insert", x]` or `["kth_largest", k]`. The driver applies the operations in order and returns the list of results from the `kth_largest` calls.

Both operations should be fast, O(log U) or O(log n), even after many inserts. Sorting on every query, or a heap that only answers for one fixed `k`, does not meet the requirement because `k` changes from query to query.

## Function signature
```python
class KthLargest:
    def insert(self, x: int) -> None: ...
    def kth_largest(self, k: int) -> int | None: ...

def process(operations: list[list]) -> list[int | None]: ...
```

## Constraints
- Up to `2 * 10^5` operations
- `-10^9 <= x <= 10^9`
- `k` is an integer and may be out of range

## Examples
**Example 1**
Input: `[["insert",5],["insert",1],["insert",9],["kth_largest",1],["kth_largest",3],["insert",9],["kth_largest",2],["kth_largest",3]]`
Output: `[9, 1, 9, 5]`
Explanation: For {5,1,9}, the 1st largest is 9 and the 3rd is 1. After a second 9 is inserted, the multiset is {9,9,5,1}, so the 2nd largest is 9 (the duplicate) and the 3rd is 5.

**Example 2** (edge cases: empty structure, out-of-range k, extreme values)
Input: `[["kth_largest",1],["insert",-7],["kth_largest",1],["kth_largest",2],["insert",1000000000],["insert",-1000000000],["kth_largest",3]]`
Output: `[None, -7, None, -1000000000]`

<details><summary>Approach (spoiler)</summary>

Keep a count-augmented tree over the values. Here it is a **sparse segment tree** on the fixed range [-10^9, 10^9], where each node stores how many values fall in its range and nodes are created only along insert paths, about 31 per insert. To answer `kth_largest(k)`, start at the root. If the right (larger) child holds at least `k` values, go right. Otherwise subtract its count from `k` and go left. The leaf you end at is the answer. Other valid choices: an order-statistics balanced BST with subtree sizes, or a Fenwick tree over coordinate-compressed values when the operations are known in advance.
**Time:** O(log U) per operation, U = 2·10^9 · **Space:** O(n log U)

```python
from typing import Optional

class KthLargest:
    """Multiset with insert and k-th largest, via a sparse (dynamic) segment tree
    over the value range [LO, HI]. Nodes are created only along inserted paths."""
    LO, HI = -10**9, 10**9

    def __init__(self) -> None:
        self.cnt = [0]
        self.left = [0]       # child index, 0 = absent (node 0 is the root, never a child)
        self.right = [0]
        self.size = 0

    def _new(self) -> int:
        self.cnt.append(0); self.left.append(0); self.right.append(0)
        return len(self.cnt) - 1

    def insert(self, x: int) -> None:
        node, lo, hi = 0, self.LO, self.HI
        while True:
            self.cnt[node] += 1
            if lo == hi:
                break
            mid = (lo + hi) // 2
            if x <= mid:
                if not self.left[node]:
                    child = self._new(); self.left[node] = child
                node, hi = self.left[node], mid
            else:
                if not self.right[node]:
                    child = self._new(); self.right[node] = child
                node, lo = self.right[node], mid + 1
        self.size += 1

    def kth_largest(self, k: int) -> Optional[int]:
        if k < 1 or k > self.size:
            return None
        node, lo, hi = 0, self.LO, self.HI
        while lo < hi:
            mid = (lo + hi) // 2
            r = self.right[node]
            rc = self.cnt[r] if r else 0
            if k <= rc:                       # answer lies among the larger values
                node, lo = r, mid + 1
            else:
                k -= rc
                node, hi = self.left[node], mid
        return lo

def process(operations: list[list]) -> list[Optional[int]]:
    ds, out = KthLargest(), []
    for op, arg in operations:
        if op == "insert":
            ds.insert(arg)
        else:                                 # "kth_largest"
            out.append(ds.kth_largest(arg))
    return out
```
</details>
