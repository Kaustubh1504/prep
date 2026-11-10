# Longest Non-Decreasing Subarray After One Replacement
> Google · Onsite · medium · Pattern: Dynamic Programming, Sliding Window
> Source: https://prachub.com/interview-questions/longest-non-decreasing-subarray-after-one-replacement

Given an integer array `nums`, return the maximum length of a contiguous non-decreasing subarray obtainable after changing at most one array element to any integer value. You may also leave the array unchanged.

A subarray uses consecutive positions. It is non-decreasing when each element is less than or equal to the next element within that subarray.

### Input and Output

- Input: `nums`, an array of integers.
- Output: one integer, the maximum achievable length. Return the length only; no replacement value or subarray is required.
- Equal adjacent values are allowed. The one replacement, if used, may be at any array position, including an endpoint of the chosen subarray.

For this practice version, input values fit in signed 32-bit integers. An empty array has answer `0`. The source report gives no input-size bound.

### Example

```text
nums = [1, 0, 3, 4, 5, 2, 3]
answer = 5
```

Changing the second element from `0` to `1` gives a non-decreasing contiguous subarray `[1, 1, 3, 4, 5]` of length `5`.

<details><summary>Hints (spoiler)</summary>

1. A subarray uses consecutive positions and allows equal neighbors.
2. The replacement, if used, may be at an endpoint.
</details>

<details><summary>Approach (spoiler)</summary>

For each position, record the length of the existing non-decreasing run ending there and starting there. The no-change answer is the longest original run. If one position is replaced, the new subarray can include the left run, the right run, or both. Both runs can be joined exactly when an integer can fit between the unchanged outer neighbors; with an unrestricted integer replacement this is equivalent to the left neighbor being no larger than the right neighbor. At an endpoint, the missing side imposes no bound. Check every position and take the maximum. This covers all possible single replacements because the rest of a chosen contiguous subarray remains unchanged.

**Time:** O(n), where n is the number of input elements. · **Space:** O(n) for the two run-length arrays.
</details>
