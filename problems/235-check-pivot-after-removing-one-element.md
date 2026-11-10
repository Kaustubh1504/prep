# Check pivot after removing one element
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Prefix Sum

## Problem
You get an integer array `nums`. In an array `a`, a **pivot** is an index `p` where the sum of the elements strictly left of `p` equals the sum of the elements strictly right of `p`. An empty side sums to 0.

You must remove **exactly one** element from `nums`, and the remaining elements keep their relative order. Return `True` if some choice of removed element leaves an array that has at least one pivot. Otherwise return `False`.

Notes:
- Values can be negative or zero, and duplicates are allowed.
- If `nums` has one element, removing it leaves an empty array, which has no pivot, so the answer is `False`.
- If `nums` has two elements, the answer is always `True`. Removing either one leaves a single element, which is its own pivot (0 == 0).
- Aim for O(n) time. The O(n²) and O(n³) brute-force versions are acceptable only as a starting point.

## Function signature
```python
def can_make_pivot(nums: list[int]) -> bool:
```

## Constraints
- `1 <= len(nums) <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

## Examples
**Example 1**
Input: `nums = [2, 5, 3, 1, 4]`
Output: `True`
Explanation: Removing the `2` gives `[5, 3, 1, 4]`. At index 1, the left sum is 5 and the right sum is 1 + 4 = 5.

**Example 2**
Input: `nums = [1, 7, 3, 6, 5, 6, 1]`
Output: `True`
Explanation: Removing the last `1` gives `[1, 7, 3, 6, 5, 6]`. Its pivot is index 3, where 11 == 11.

**Example 3**
Input: `nums = [4, 1, -3, 2, 6]`
Output: `True`
Explanation: Removing the `6` gives `[4, 1, -3, 2]`. At pivot 0, the left sum is 0 and the right sum is 1 - 3 + 2 = 0. Negative values matter here.

**Example 4** (an edge case)
Input: `nums = [1, 2, 3]`
Output: `False`
Explanation: The possible arrays are `[2,3]`, `[1,3]` and `[1,2]`. None of them has a pivot.

**Example 5** (an edge case)
Input: `nums = [5]`
Output: `False`

<details><summary>Approach (spoiler)</summary>

Fix the pivot `p` in the original array, and let `L` and `R` be the sums to its left and right. The removed element is either left of `p` or right of `p`. If it is on the left with value `x`, we need `L - x == R`, so `x == L - R` must be some element before `p`. Scan left to right, keeping a hash set of the values seen so far. If it is on the right, we need `L == R - x`, so `x == R - L` must be some element after `p`. Scan right to left with a second set. Since removal is mandatory and the pivot itself can't be the removed element, these two cases cover every possibility.
**Time:** O(n) · **Space:** O(n)

```python
def can_make_pivot(nums: list[int]) -> bool:
    n, total = len(nums), sum(nums)
    # removed element lies left of pivot p: need L - x == R
    seen, L = set(), 0
    for p in range(n):
        R = total - L - nums[p]
        if L - R in seen:
            return True
        seen.add(nums[p])
        L += nums[p]
    # removed element lies right of pivot p: need L == R - x
    seen, R = set(), 0
    for p in range(n - 1, -1, -1):
        L = total - R - nums[p]
        if R - L in seen:
            return True
        seen.add(nums[p])
        R += nums[p]
    return False
```
</details>
