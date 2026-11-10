# Find the Longest Non-Decreasing Subarray After One Replacement
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Medium · Pattern: Dynamic Programming, Sliding Window

## Problem
Given an integer array `nums`, you may replace **at most one** element with any integer you like (or replace nothing). Return the maximum length of a contiguous subarray that is **non-decreasing** (`a[i] <= a[i+1]`; equal neighbours are allowed) after the replacement.

The result is a length (not the subarray). An empty array returns `0`; any array of length 1 or 2 returns its length, since a single replacement can always fix two elements.

## Function signature
```python
from typing import List

def longest_after_one_replacement(nums: List[int]) -> int:
    ...
```

## Constraints
- `0 <= len(nums) <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- Target O(n) time

## Examples
**Example 1**
Input: `nums = [1,2,5,3,4]`
Output: `5`
Explanation: Replace `5` with `3` (anything in `[2,3]`): `[1,2,3,3,4]`.

**Example 2**
Input: `nums = [1,3,2,1,4]`
Output: `3`
Explanation: For example, replace the second `1` with `2` to get `[1,3,2,2,4]`, whose run `[2,2,4]` has length 3. Two descents cannot be fixed with one change.

**Example 3** (strictly decreasing)
Input: `nums = [5,4,3,2,1]`
Output: `2`

**Example 4** (bridging two runs)
Input: `nums = [1,2,3,0,4,5,6]`
Output: `7`
Explanation: Replace `0` with any value in `[3,4]`.

**Example 5** (edge cases)
Input: `[2,2,2]` → `3`; `[7]` → `1`; `[]` → `0`

<details><summary>Approach (spoiler)</summary>

Precompute `left[i]`, the length of the non-decreasing run ending at `i`, and `right[i]`, the run starting at `i`. If we replace `nums[i]`, we can always extend the run ending at `i-1` by one (`left[i-1] + 1`) or the run starting at `i+1` by one (`right[i+1] + 1`). If `nums[i-1] <= nums[i+1]`, a value between them joins both runs: `left[i-1] + 1 + right[i+1]`. Take the maximum with the best run without any replacement, capped at `n`.
**Time:** O(n) · **Space:** O(n) (reducible to O(1) with a sliding window that tracks the last violation)

```python
from typing import List

def longest_after_one_replacement(nums: List[int]) -> int:
    n = len(nums)
    if n <= 2:
        return n
    left = [1] * n        # left[i]: non-decreasing run ending at i
    for i in range(1, n):
        if nums[i - 1] <= nums[i]:
            left[i] = left[i - 1] + 1
    right = [1] * n       # right[i]: non-decreasing run starting at i
    for i in range(n - 2, -1, -1):
        if nums[i] <= nums[i + 1]:
            right[i] = right[i + 1] + 1
    best = max(left)
    for i in range(n):    # replace nums[i]
        if i > 0:
            best = max(best, left[i - 1] + 1)
        if i < n - 1:
            best = max(best, right[i + 1] + 1)
        if 0 < i < n - 1 and nums[i - 1] <= nums[i + 1]:
            best = max(best, left[i - 1] + 1 + right[i + 1])
    return min(best, n)
```
</details>
