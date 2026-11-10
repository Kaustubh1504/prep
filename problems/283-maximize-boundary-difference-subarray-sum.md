# Maximize Boundary-Difference Subarray Sum
> Google · Onsite · medium · Pattern: Prefix Sum
> Source: https://prachub.com/interview-questions/maximize-boundary-difference-subarray-sum

Given an integer array `nums` and an integer `k`, find the maximum possible sum of a non-empty contiguous subarray whose first and last elements differ by exactly `k` in absolute value.

A subarray `nums[l..r]` is valid if:

`abs(nums[l] - nums[r]) == k`

Return the maximum sum among all valid subarrays. If no valid subarray exists, return `0`.

Example 1:

```text
Input: nums = [1, 2, 3, 4, 5], k = 3
Output: 14
Explanation: The subarray [2, 3, 4, 5] has endpoints 2 and 5, whose absolute difference is 3, and its sum is 14.
```

Example 2:

```text
Input: nums = [-1, 3, 2, 4, 5], k = 3
Output: 11
Explanation: The subarray [2, 4, 5] has endpoints 2 and 5, whose absolute difference is 3, and its sum is 11.
```

Example 3:

```text
Input: nums = [5, 1, 8], k = 10
Output: 0
Explanation: There is no valid subarray.
```

Constraints:

```text
1 <= nums.length <= 100000
-1000000000 <= nums[i] <= 1000000000
0 <= k <= 1000000000
```

Design an algorithm efficient enough for the given constraints.

<details><summary>Hints (spoiler)</summary>

1. Use prefix sums so you can compute the sum of any subarray ending at index r in O(1) once you know its starting index.
2. For each ending value nums[r], the starting value must be either nums[r] - k or nums[r] + k. For each value, keep the smallest prefix sum seen before an index holding that value.
</details>
