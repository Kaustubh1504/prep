# Solve Two Array Optimization Problems
> Google · Onsite · medium · Pattern: Prefix Sum
> Source: https://prachub.com/interview-questions/solve-two-array-optimization-problems-2

You are given two coding problems from the same interview round.

**Problem 1: Split a gold chain fairly**

An array `weights` represents the weights of consecutive links in a gold chain.

You must perform the following steps:
1. Remove exactly one link.
2. Reconnect the remaining links, preserving their relative order.
3. Cut the reconnected chain once so that it becomes two non-empty contiguous parts.

Return `true` if there exists a choice of removed index `r` and cut position `k` in the new array such that the two resulting parts have the same total weight. Otherwise, return `false`.

Formally, after removing `weights[r]`, the new array is:
- `weights[0], weights[1], ..., weights[r-1], weights[r+1], ..., weights[n-1]`

You need to determine whether there exists a cut position `k` in this new array such that:
- sum of elements from index `0` to `k` equals the sum of elements from `k+1` to the end.

**Follow-up:** Return all valid `(r, k)` pairs, where `r` is the removed index in the original array and `k` is the cut index in the array after removal.

---

**Problem 2: Maximize a subarray whose endpoints are equal**

Given an integer array `a`, find indices `i` and `j` such that:
- `0 <= i <= j < n`
- `a[i] == a[j]`
- the value of `a[i] + a[i+1] + ... + a[j]` is maximized

Return one pair `(i, j)` that achieves the maximum sum.

**Follow-up:** Solve the problem using strictly `O(1)` extra space, even if a higher time complexity is allowed.

<details><summary>Hints (spoiler)</summary>

1. Use prefix sums so you can compute the weight of a left segment in O(1) time after a hypothetical removal.
2. For a fixed removed index `r`, a cut index `k` maps differently depending on whether `k < r` or `k >= r`.
</details>
