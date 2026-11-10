# Return top-k subset sums in descending order
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Hard · Pattern: Heap / Top-K

## Problem
You are given an integer array `nums`, which may contain negative numbers and zeros, and an integer `k`. Every subset of indices, including the empty subset (sum `0`), has a subset sum. There are `2^n` subsets, and subsets are counted by indices, so equal sums from different subsets count separately.

Return the `k` largest subset sums in **descending** order, with repeats included.

`n` can be large, so enumerating all `2^n` subsets is not an option. The work should depend on `k` and `n log n`, not on `2^n`. (This generalises LeetCode 2386, "Find the K-Sum of an Array", which asks only for the k-th value.)

## Function signature
```python
def top_k_subset_sums(nums: list[int], k: int) -> list[int]:
```

## Constraints
- `0 <= n = len(nums) <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `1 <= k <= min(2000, 2^n)`

## Examples
**Example 1**
Input: `nums = [2, 4, -2]`, `k = 5`
Output: `[6, 4, 4, 2, 2]`
Explanation: The subset sums are `{}`=0, `{2}`=2, `{4}`=4, `{-2}`=-2, `{2,4}`=6, `{2,-2}`=0, `{4,-2}`=2, `{2,4,-2}`=4. The five largest are 6, 4, 4, 2, 2.

**Example 2**
Input: `nums = [1, -2, 3, 4, -10, 12]`, `k = 6`
Output: `[20, 19, 18, 17, 17, 16]`

**Example 3** (all negative, and the empty array)
Input: `nums = [-1, -1]`, `k = 4`
Output: `[0, -1, -1, -2]`

Input: `nums = []`, `k = 1`
Output: `[0]`

<details><summary>Approach (spoiler)</summary>

The largest sum is `best`, the sum of all positive numbers. Every other subset sum is `best` minus a "loss". Removing a positive `x` costs `x`, and adding a negative `x` costs `|x|`, so each subset corresponds to a subset of `a = sorted(|nums|)`, and the loss is that subset's sum. The k largest subset sums are therefore `best` minus the k smallest subset sums of the non-negative sorted array `a`.

Generate those smallest sums in order with a min-heap of `(loss, i)` pairs, where `i` is the largest index in the chosen subset. Start from `(a[0], 0)`. When you pop `(loss, i)`, push two successors: "add `a[i+1]`" and "replace `a[i]` with `a[i+1]`". Every non-empty subset is generated exactly once, and each successor's loss is at least its parent's, so pops come out in non-decreasing order.

**Time:** O(n log n + k log k) · **Space:** O(n + k)

```python
import heapq

def top_k_subset_sums(nums, k):
    best = sum(x for x in nums if x > 0)
    a = sorted(abs(x) for x in nums)
    n = len(a)
    res = [best]
    if n == 0:
        return res[:k]
    heap = [(a[0], 0)]  # (loss, index of last chosen element)
    while len(res) < k:
        loss, i = heapq.heappop(heap)
        res.append(best - loss)
        if i + 1 < n:
            heapq.heappush(heap, (loss + a[i + 1], i + 1))
            heapq.heappush(heap, (loss - a[i] + a[i + 1], i + 1))
    return res
```
</details>
