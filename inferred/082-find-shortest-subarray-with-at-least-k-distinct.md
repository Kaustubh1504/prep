# Find shortest subarray with at least k distinct
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Sliding Window

## Problem
Given an integer array `nums` and an integer `k`, return the length of the shortest contiguous subarray that contains **at least `k` distinct values**. If no subarray qualifies (the whole array has fewer than `k` distinct values), return `-1`.

## Function signature
```python
from typing import List

def shortest_subarray_k_distinct(nums: List[int], k: int) -> int:
    ...
```

## Constraints
- `1 <= len(nums) <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `1 <= k <= len(nums)`
- Target O(n) time

## Examples
**Example 1**
Input: `nums = [1,2,2,1,3,3,4]`, `k = 3`
Output: `3`
Explanation: `[2,1,3]` (indices 2..4) has three distinct values; no length-2 subarray can.

**Example 2** (impossible)
Input: `nums = [1,1,2,2]`, `k = 3`
Output: `-1`

**Example 3** (k = 1)
Input: `nums = [5,5,5]`, `k = 1`
Output: `1`

**Example 4**
Input: `nums = [1,2,1,1,1,3,2]`, `k = 3`
Output: `3`
Explanation: `[1,3,2]` at the end.

<details><summary>Approach (spoiler)</summary>

Slide a window with a frequency map and a distinct counter. Extend `right` one step at a time; while the window has at least `k` distinct values, record its length and shrink from the left. Every window that qualifies is checked at its minimal left boundary for that right end, and each pointer moves at most `n` times.
**Time:** O(n) · **Space:** O(min(n, distinct values))

```python
from collections import defaultdict
from typing import List

def shortest_subarray_k_distinct(nums: List[int], k: int) -> int:
    count = defaultdict(int)
    distinct = 0
    left = 0
    best = float("inf")
    for right, x in enumerate(nums):
        count[x] += 1
        if count[x] == 1:
            distinct += 1
        while distinct >= k:
            best = min(best, right - left + 1)
            y = nums[left]
            count[y] -= 1
            if count[y] == 0:
                distinct -= 1
            left += 1
    return best if best != float("inf") else -1
```
</details>
