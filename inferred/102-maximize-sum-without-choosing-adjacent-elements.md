# Maximize sum without choosing adjacent elements
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Dynamic Programming

## Problem
Given an integer array `nums`, choose a subset of elements such that no two chosen elements are adjacent in the array (indices `i` and `i+1` cannot both be chosen). Return the maximum possible sum of the chosen elements.

Choosing nothing is allowed and has sum `0`, so the answer is never negative (an empty array, or an array of all negative numbers, returns `0`).

## Function signature
```python
from typing import List

def max_non_adjacent_sum(nums: List[int]) -> int:
    ...
```

## Constraints
- `0 <= len(nums) <= 10^5`
- `-10^4 <= nums[i] <= 10^4`
- Target O(n) time and O(1) extra space

## Examples
**Example 1**
Input: `nums = [2,7,9,3,1]`
Output: `12`
Explanation: Choose indices 0, 2, 4: `2 + 9 + 1 = 12`.

**Example 2**
Input: `nums = [2,1,1,2]`
Output: `4`
Explanation: Choose the two 2s at indices 0 and 3 (skipping two elements in a row is allowed).

**Example 3** (negatives)
Input: `nums = [4,-1,-2,5]`
Output: `9`
Input: `nums = [-3,-1,-2]`
Output: `0` (choose nothing)

**Example 4** (edge cases)
Input: `nums = []` → `0`; `nums = [5]` → `5`

<details><summary>Approach (spoiler)</summary>

Scan left to right keeping two values: `take`, the best sum whose last element is the current one, and `skip`, the best sum that does not use the current element. For a new element `x`: `new_take = skip + x` and `new_skip = max(take, skip)`. Starting both at 0 encodes "choose nothing", which also makes negatives harmless. This is the classic House Robber recurrence `best[i] = max(best[i-1], best[i-2] + nums[i])` with rolling variables.
**Time:** O(n) · **Space:** O(1)

```python
from typing import List

def max_non_adjacent_sum(nums: List[int]) -> int:
    take, skip = 0, 0          # best sum ending with / without taking the previous element
    for x in nums:
        take, skip = skip + x, max(take, skip)
    return max(take, skip)
```
</details>
