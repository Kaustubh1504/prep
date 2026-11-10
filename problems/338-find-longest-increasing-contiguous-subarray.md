# Find longest increasing contiguous subarray
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Sliding Window

## Problem
Given an integer array `nums`, find the length of the longest **contiguous** subarray that can be made **strictly increasing** by changing **at most one** element of that subarray to any integer value of your choice.

Notes:
- The replacement value must be an integer, so for example `[1, 2, ?, 3]` cannot be fixed by changing the `?` position, because there is no integer strictly between 2 and 3.
- A subarray that is already strictly increasing needs no change.
- Return `0` for an empty array. Any single element is trivially strictly increasing, and any subarray of length 2 can always be fixed with one change.

## Function signature
```python
from typing import List

def longest_increasing_with_one_change(nums: List[int]) -> int:
    ...
```

## Constraints
- `0 <= len(nums) <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- Target: O(n) time

## Examples
**Example 1**
Input: `nums = [7, 2, 3, 1, 5, 6]`
Output: `5`
Explanation: Take `[2, 3, 1, 5, 6]` and change `1` to `4`, giving `[2, 3, 4, 5, 6]`.

**Example 2** (integer edge case)
Input: `nums = [1, 2, 2, 3]`
Output: `3`
Explanation: The whole array would need a value strictly between 2 and 3 (or between 1 and 2) — impossible for integers. A length-3 window such as `[2, 2, 3]` works by changing the first 2 to 1.

**Example 3** (an edge case)
Input: `nums = [5, 5, 5, 5]`
Output: `2`
Explanation: Any two adjacent elements can be fixed by changing one of them; three cannot, because two of the equal elements would remain. (`nums = [4]` gives `1`, `nums = []` gives `0`.)

<details><summary>Approach (spoiler)</summary>

Precompute `left[i]` = length of the strictly increasing run ending at `i` and `right[i]` = length of the run starting at `i`. If we change `nums[i]`, three candidates arise: extend the run ending at `i-1` by one (`left[i-1] + 1`), prepend to the run starting at `i+1` (`right[i+1] + 1`), or bridge both runs (`left[i-1] + 1 + right[i+1]`), which is possible only when an integer fits strictly between the neighbours, i.e. `nums[i+1] - nums[i-1] >= 2`. The answer is the maximum of these and the unmodified runs. Any optimal window has its single changed position at some `i`, and the part on each side must be an unmodified increasing run, so this enumeration is complete.
**Time:** O(n) · **Space:** O(n)

```python
from typing import List

def longest_increasing_with_one_change(nums: List[int]) -> int:
    n = len(nums)
    if n <= 2:
        return n
    left = [1] * n   # strictly increasing run ending at i
    right = [1] * n  # strictly increasing run starting at i
    for i in range(1, n):
        if nums[i] > nums[i - 1]:
            left[i] = left[i - 1] + 1
    for i in range(n - 2, -1, -1):
        if nums[i] < nums[i + 1]:
            right[i] = right[i + 1] + 1

    best = max(max(left), max(right))
    for i in range(n):
        if i > 0:
            best = max(best, left[i - 1] + 1)
        if i < n - 1:
            best = max(best, right[i + 1] + 1)
        if 0 < i < n - 1 and nums[i + 1] - nums[i - 1] >= 2:
            best = max(best, left[i - 1] + 1 + right[i + 1])
    return best
```
</details>
