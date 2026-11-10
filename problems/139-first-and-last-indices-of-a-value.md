# First and Last Indices of a Value
> Google · Other · medium · Pattern: Binary Search
> Source: https://prachub.com/interview-questions/first-and-last-indices-of-a-value

### Problem

You receive an integer array `values` in non-decreasing order and an integer `key`. Return a two-element array containing the zero-based indices of the first and last occurrences of `key`, in that order. Both endpoints are inclusive.

If `key` is absent, return `[-1, -1]`. An empty input array also produces `[-1, -1]`.

Your algorithm must run in `O(log n)` time, where `n` is the length of `values`.

### Examples

**Example 1**

```text
Input: values = [-4,-1,-1,-1,2,6], key = -1
Output: [1,3]
```

The first `-1` is at index `1`, and the last is at index `3`.

**Example 2**

```text
Input: values = [1,1,4,9], key = 7
Output: [-1,-1]
```

The array does not contain `7`.

### Constraints

- `0 <= values.length <= 10^5`
- `-10^9 <= values[i] <= 10^9`
- `values` is sorted in non-decreasing order.
- `-10^9 <= key <= 10^9`
