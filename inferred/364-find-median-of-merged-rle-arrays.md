# Find median of merged RLE arrays
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Heap / Top-K

## Problem
Two sorted arrays are given in **run-length encoding (RLE)**. Each array is a list of pairs `(value, freq)` meaning `value` repeated `freq` times; within each list the values are strictly increasing and every `freq >= 1`. The same value may appear in both lists.

Return the **median** of the multiset formed by merging both decoded arrays:
- if the total count `N` is odd, the median is the element at 0-indexed position `N // 2` of the merged sorted order;
- if `N` is even, it is the average of the elements at positions `N/2 - 1` and `N/2`.

Always return the median as a `float`. Frequencies can be huge (up to `10^12`), so you must **not** decompress the arrays. At least one of the arrays is non-empty; if both are empty, raise `ValueError`.

## Function signature
```python
from typing import List, Tuple

def median_of_rle(A: List[Tuple[int, int]], B: List[Tuple[int, int]]) -> float:
    ...
```

## Constraints
- `0 <= len(A), len(B) <= 10^5`, `len(A) + len(B) >= 1`
- `1 <= freq <= 10^12`
- `-10^9 <= value <= 10^9`; values strictly increasing within each list

## Examples
**Example 1**
Input: `A = [(1,2),(5,1)]`, `B = [(2,1),(3,2)]`
Output: `2.5`
Explanation: Decoded and merged: `[1,1,2,3,3,5]`. `N = 6`, so the median is `(2 + 3) / 2`.

**Example 2**
Input: `A = [(1,3)]`, `B = [(4,1)]`
Output: `1.0`
Explanation: Merged `[1,1,1,4]`; positions 1 and 2 are both 1.

**Example 3** (an edge case)
Input: `A = []`, `B = [(7, 1000000000000)]`
Output: `7.0`
Explanation: One empty array and an enormous run; decompressing would be infeasible, but both middle positions fall inside the single run.

<details><summary>Approach (spoiler)</summary>

Compute `N` from the frequencies and the two target positions `lo = (N-1)//2` and `hi = N//2`. Merge the runs with two pointers (always take the run with the smaller value), tracking how many elements have been passed; a run covers positions `[seen, seen + freq)`, so the run containing `lo` and the run containing `hi` are found without expanding anything. This is the two-list case of a k-way merge — with k RLE lists, a min-heap of run heads gives O(R log k). If the run lists themselves were extremely long, binary searching on the value with per-list prefix sums of frequencies would give O(log V · log R).
**Time:** O(len(A) + len(B)) · **Space:** O(1)

```python
from typing import List, Tuple

def median_of_rle(A: List[Tuple[int, int]], B: List[Tuple[int, int]]) -> float:
    total = sum(f for _, f in A) + sum(f for _, f in B)
    if total == 0:
        raise ValueError("both arrays are empty")
    lo_pos, hi_pos = (total - 1) // 2, total // 2
    i = j = seen = 0
    lo_val = None
    while True:
        if j == len(B) or (i < len(A) and A[i][0] <= B[j][0]):
            val, cnt = A[i]
            i += 1
        else:
            val, cnt = B[j]
            j += 1
        if lo_val is None and lo_pos < seen + cnt:
            lo_val = val
        if hi_pos < seen + cnt:
            return (lo_val + val) / 2
        seen += cnt
```
</details>
