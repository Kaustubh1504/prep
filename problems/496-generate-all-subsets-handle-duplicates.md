# Generate all subsets (handle duplicates)
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Backtracking

## Problem
Given an integer array `nums` that **may contain duplicates**, return all possible **distinct** subsets (the power set). Two subsets are the same if they contain the same values with the same multiplicities, regardless of which positions they came from — so the result must not contain duplicate subsets.

Output format: each subset is listed in non-decreasing order, and the subsets themselves may be returned in any order (the examples show the order produced by the reference solution). The empty subset is always included; for `nums = []` the answer is `[[]]`.

Generate the subsets directly without producing duplicates and filtering them afterwards (e.g. via a set of tuples).

## Function signature
```python
from typing import List

def subsets_with_dup(nums: List[int]) -> List[List[int]]:
    ...
```

## Constraints
- `0 <= len(nums) <= 10`
- `-10 <= nums[i] <= 10`

## Examples
**Example 1**
Input: `nums = [1, 2, 2]`
Output: `[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]`
Explanation: There are `2 × 3 = 6` distinct subsets: 1 can appear 0 or 1 times and 2 can appear 0, 1 or 2 times. `[1, 2]` is listed once even though there are two ways to pick a 2.

**Example 2** (unsorted input, value repeated three times)
Input: `nums = [2, 1, 2, 2]`
Output: `[[], [1], [1, 2], [1, 2, 2], [1, 2, 2, 2], [2], [2, 2], [2, 2, 2]]`

**Example 3** (edge cases)
Input: `nums = [0]` → Output: `[[], [0]]`; `nums = []` → Output: `[[]]`

<details><summary>Approach (spoiler)</summary>

Sort the array so equal values are adjacent, then backtrack: each call records the current path as a subset and tries to extend it with each later element. At a given depth, skip `nums[i]` when it equals `nums[i-1]` and `i > start` — choosing the second copy of a value at the same position would only reproduce subsets already generated from the first copy. Every distinct multiset is produced exactly once (as its sorted sequence), so the output size is `∏(count_v + 1)`.
**Time:** O(n · 2^n) worst case (copying each subset) · **Space:** O(n) recursion besides the output

```python
from typing import List

def subsets_with_dup(nums: List[int]) -> List[List[int]]:
    nums = sorted(nums)
    result: List[List[int]] = []
    path: List[int] = []

    def backtrack(start: int) -> None:
        result.append(path[:])
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue        # same value already tried at this depth
            path.append(nums[i])
            backtrack(i + 1)
            path.pop()

    backtrack(0)
    return result
```
</details>
