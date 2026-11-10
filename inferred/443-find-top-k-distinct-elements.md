# Find top-k distinct elements
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Heap / Top-K

## Problem
Given an integer array `nums` (which may contain duplicates) and an integer `k`, return the `k` **largest distinct** values in `nums`, ordered from **largest to smallest**.

- Each value appears at most once in the output, no matter how many times it occurs in `nums`.
- If `nums` contains fewer than `k` distinct values, return all distinct values (still in descending order).
- If `k <= 0` or `nums` is empty, return `[]`.

Aim for better than sorting the whole array when `k` is much smaller than `n`: O(n log k) time with O(k) extra space beyond the input.

## Function signature
```python
from typing import List

def top_k_distinct(nums: List[int], k: int) -> List[int]:
    ...
```

## Constraints
- `0 <= len(nums) <= 10^6`
- `-10^9 <= nums[i] <= 10^9`
- `0 <= k <= 10^5`

## Examples
**Example 1**
Input: `nums = [5, 1, 5, 3, 9, 9, 7], k = 3`
Output: `[9, 7, 5]`
Explanation: The distinct values are `{1, 3, 5, 7, 9}`; the three largest, in descending order, are 9, 7, 5. The duplicate 9s and 5s count once.

**Example 2** (an edge case)
Input: `nums = [4, 4, 4], k = 2`
Output: `[4]`
Explanation: Only one distinct value exists, so fewer than `k` values are returned. (`nums = [], k = 3` → `[]`; any input with `k = 0` → `[]`.)

<details><summary>Approach (spoiler)</summary>

Maintain a min-heap holding the `k` largest distinct values seen so far, plus a set of the values currently in the heap to skip duplicates. For each new value not already in the heap: push it if the heap has fewer than `k` items, or replace the heap's minimum if the value is larger. A value evicted from the heap is smaller than everything that remains, so it can never re-enter, which keeps the dedup set correct. Finally sort the at most `k` survivors in descending order. (One-liner alternative: `heapq.nlargest(k, set(nums))`, which costs O(n) extra space for the set.)
**Time:** O(n log k + k log k) · **Space:** O(k)

```python
import heapq
from typing import List

def top_k_distinct(nums: List[int], k: int) -> List[int]:
    if k <= 0:
        return []
    heap: List[int] = []   # min-heap of the k largest distinct values so far
    in_heap = set()
    for x in nums:
        if x in in_heap:
            continue
        if len(heap) < k:
            heapq.heappush(heap, x)
            in_heap.add(x)
        elif x > heap[0]:
            in_heap.discard(heapq.heapreplace(heap, x))
            in_heap.add(x)
    return sorted(heap, reverse=True)
```
</details>
