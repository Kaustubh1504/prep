# Choose the Closest Three-Position Sum
> Google · Other · medium · Pattern: Two Pointers, Sorting
> Source: https://prachub.com/interview-questions/choose-the-closest-three-position-sum

### Problem

Given the integer array `values` and the integer `target`, choose three array positions whose sum is nearest to `target`. The three positions must be distinct, although equal values at different positions may be chosen.

Return the sum itself, rather than the selected values or indices. Every legal input is guaranteed to have exactly one closest answer. No additional rule for equal-distance answers is supplied or needed under that guarantee.

Preserve the original `threeSumClosest` interface: an integer array and an integer target, returning an integer sum.

### Examples

**Example 1**

```text
Input: values = [-3,1,4,8], target = 5
Output: 6
```

The sum `-3 + 1 + 8` is one away from the target. The other three-position sums are `2`, `9`, and `13`, all farther away.

**Example 2**

```text
Input: values = [2,2,2], target = 1
Output: 6
```

The only three positions sum to `6`; equal values do not mean an index is being reused.

### Constraints

- The array length is between `3` and `500`.
- Each array value is between `-1000` and `1000`.
- `-10000 <= target <= 10000`.
- Exactly one closest answer is guaranteed for each input.
