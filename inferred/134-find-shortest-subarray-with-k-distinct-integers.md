# Find shortest subarray with ≥k distinct integers
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Sliding Window, Design / Data Structure

## Problem
Given an integer array `nums` and an integer `k >= 1`, find the shortest contiguous subarray that contains **at least `k` distinct integers**.

Return its inclusive bounds `[left, right]` (0-indexed). If several shortest subarrays exist, return the one with the smallest `left`. If no subarray qualifies (the array has fewer than `k` distinct values in total, including an empty array), return `[-1, -1]`.

Aim for O(n) time and O(D) extra space, where `D` is the number of distinct values.

## Function signature
```python
from typing import List

def shortest_k_distinct_window(nums: List[int], k: int) -> List[int]:
    ...
```

## Constraints
- `0 <= len(nums) <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `1 <= k <= 10^5`

## Examples
**Example 1**
Input: `nums = [1,2,1,3,4,2,3]`, `k = 3`
Output: `[1, 3]`
Explanation: `[2,1,3]` and `[1,3,4]` both have length 3; the one starting at index 1 comes first.

**Example 2** (duplicates inside the best window)
Input: `nums = [4,4,4,1,1,2,2,3]`, `k = 3`
Output: `[2, 5]`
Explanation: `[4,1,1,2]` (indices 2..5) and `[1,2,2,3]` (indices 4..7) both have length 4; no length-3 window has 3 distinct values.

**Example 3** (impossible)
Input: `nums = [1,1,1]`, `k = 2` → Output: `[-1, -1]`

**Example 4** (k = 1)
Input: `nums = [7,8,7]`, `k = 1` → Output: `[0, 0]`

<details><summary>Approach (spoiler)</summary>

Sliding window with a hash-map frequency counter and a running distinct count. For each `right`, while the window holds at least `k` distinct values, it is a candidate: record it if strictly shorter than the best so far (strict comparison keeps the leftmost on ties), then shrink from the left. Each index enters and leaves the window once.
**Time:** O(n) · **Space:** O(D)

```python
from collections import defaultdict
from typing import List

def shortest_k_distinct_window(nums: List[int], k: int) -> List[int]:
    count = defaultdict(int)
    distinct = 0
    left = 0
    best = [-1, -1]
    for right, x in enumerate(nums):
        count[x] += 1
        if count[x] == 1:
            distinct += 1
        while distinct >= k:
            if best[0] == -1 or right - left < best[1] - best[0]:
                best = [left, right]                 # strict '<' keeps the leftmost on ties
            y = nums[left]
            count[y] -= 1
            if count[y] == 0:
                distinct -= 1
            left += 1
    return best
```
</details>
