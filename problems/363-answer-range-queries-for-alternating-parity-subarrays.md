# Answer range queries for alternating parity subarrays
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Prefix Sum, Segment Tree / Fenwick

## Problem
A subarray is **alternating-parity** if every pair of adjacent elements in it has different parity (one even, one odd). A subarray of length 1 is always alternating-parity.

### Part 1 — Static queries
Given an integer array `nums` and a list of queries `queries[i] = [l, r]` (0-indexed, inclusive, `l <= r`), return a list of booleans where answer `i` is `True` iff `nums[l..r]` is alternating-parity. Many queries are asked, so preprocess `nums` once and answer each query in O(1).

### Part 2 — Follow-up with updates
Now the array can change. Implement a class supporting:
- `update(index, value)`: set `nums[index] = value`;
- `query(l, r) -> bool`: same question as Part 1 on the current array.

Both operations should take O(log n).

## Function signature
```python
from typing import List

def alternating_parity_queries(nums: List[int], queries: List[List[int]]) -> List[bool]:
    ...

class AlternatingParity:
    def __init__(self, nums: List[int]): ...
    def update(self, index: int, value: int) -> None: ...
    def query(self, l: int, r: int) -> bool: ...
```

## Constraints
- `1 <= len(nums) <= 10^5`
- `1 <= len(queries)` (or number of operations) `<= 10^5`
- `-10^9 <= nums[i], value <= 10^9`
- `0 <= l <= r < len(nums)`

## Examples
**Example 1** (Part 1)
Input: `nums = [3, 4, 1, 2, 6]`, `queries = [[0,4],[0,3],[3,4],[2,2]]`
Output: `[False, True, False, True]`
Explanation: Parities are `odd, even, odd, even, even`. The only same-parity neighbours are `2, 6` (indices 3–4), so any range containing both indices 3 and 4 fails. A single element always passes.

**Example 2** (Part 1, negatives)
Input: `nums = [4, 3, 1, 6]`, `queries = [[0,2],[2,3]]`
Output: `[False, True]`
Explanation: `3` and `1` are both odd. Parity must be computed safely for negative numbers too (e.g. `(a - b) % 2 == 0` in Python).

**Example 3** (Part 2)
Input: `AlternatingParity([3,4,1,2,6])`, then `query(0,4)`, `update(4,7)`, `query(0,4)`, `query(3,4)`, `update(0,8)`, `query(0,1)`, `query(0,4)`
Output: `False, -, True, True, -, False, False`
Explanation: Changing the last element to 7 fixes the only bad pair; changing the first element to 8 makes `8, 4` a new bad pair.

<details><summary>Approach (spoiler)</summary>

Mark each adjacent pair `(j-1, j)` as **bad** if the two values share parity. `nums[l..r]` is alternating iff no bad pair has `j` in `[l+1, r]`. In Part 1 a prefix count `bad[i]` (number of bad pairs with `j <= i`) answers each query as `bad[r] - bad[l] == 0`. In Part 2 store the bad flags in a Fenwick tree; an update to `index` can only change the flags of pairs `j = index` and `j = index + 1`, so remove their old contributions, write the value, and add the new ones.
**Time:** Part 1 O(n + q); Part 2 O(n log n) build (O(n) possible), O(log n) per operation · **Space:** O(n)

```python
from typing import List

def alternating_parity_queries(nums: List[int], queries: List[List[int]]) -> List[bool]:
    n = len(nums)
    bad = [0] * n  # bad[i] = number of same-parity pairs (j-1, j) with j <= i
    for i in range(1, n):
        bad[i] = bad[i - 1] + ((nums[i] - nums[i - 1]) % 2 == 0)
    return [bad[r] - bad[l] == 0 for l, r in queries]


class AlternatingParity:
    def __init__(self, nums: List[int]):
        self.nums = list(nums)
        self.n = len(nums)
        self.tree = [0] * (self.n + 1)  # Fenwick over bad flags of pairs j = 1..n-1
        for j in range(1, self.n):
            if self._is_bad(j):
                self._add(j, 1)

    def _is_bad(self, j: int) -> bool:
        return (self.nums[j] - self.nums[j - 1]) % 2 == 0

    def _add(self, i: int, delta: int) -> None:
        while i <= self.n:
            self.tree[i] += delta
            i += i & -i

    def _prefix(self, i: int) -> int:
        s = 0
        while i > 0:
            s += self.tree[i]
            i -= i & -i
        return s

    def update(self, index: int, value: int) -> None:
        touched = [j for j in (index, index + 1) if 1 <= j < self.n]
        for j in touched:
            if self._is_bad(j):
                self._add(j, -1)
        self.nums[index] = value
        for j in touched:
            if self._is_bad(j):
                self._add(j, 1)

    def query(self, l: int, r: int) -> bool:
        return self._prefix(r) - self._prefix(l) == 0
```
</details>
