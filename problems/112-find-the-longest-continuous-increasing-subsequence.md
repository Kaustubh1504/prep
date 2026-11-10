# Find the Longest Continuous Increasing Subsequence
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Medium · Pattern: Dynamic Programming

## Problem
Given an integer array `nums`, return the length of the longest **continuous** (contiguous) subarray whose elements are **strictly increasing** (`nums[i] < nums[i+1]` for every consecutive pair inside it).

- This is a subarray, not a general subsequence: elements must be adjacent in the array.
- Equal neighbouring values break a run (`[2,2]` has a longest run of 1).
- An empty array returns `0`; any non-empty array has an answer of at least `1`.

## Function signature
```python
from typing import List

def longest_increasing_run(nums: List[int]) -> int:
    ...
```

## Constraints
- `0 <= len(nums) <= 10^5`
- `-10^9 <= nums[i] <= 10^9`

## Examples
**Example 1**
Input: `nums = [1,3,5,4,7]`
Output: `3`
Explanation: `[1,3,5]`. The subsequence `[1,3,5,7]` is longer but not contiguous.

**Example 2** (equal values)
Input: `nums = [2,2,2,2]`
Output: `1`

**Example 3**
Input: `nums = [1,2,2,3,4,5]`
Output: `4`
Explanation: The repeated `2` resets the run; `[2,3,4,5]` follows.

**Example 4** (edge cases)
Input: `[]` → `0`; `[9]` → `1`; `[5,4,3]` → `1`

<details><summary>Approach (spoiler)</summary>

Single linear scan: keep the length of the strictly increasing run ending at the current index, extend it when `nums[i] > nums[i-1]` and reset it to 1 otherwise (including equality), and track the maximum. Each element is the end of exactly one maximal run, so the maximum seen is the answer.
**Time:** O(n) · **Space:** O(1)

```python
from typing import List

def longest_increasing_run(nums: List[int]) -> int:
    if not nums:
        return 0
    best = cur = 1
    for i in range(1, len(nums)):
        cur = cur + 1 if nums[i] > nums[i - 1] else 1
        best = max(best, cur)
    return best
```
</details>
