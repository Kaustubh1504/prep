# Find the Sorted Insertion Index
> Google · Other · easy · Pattern: Binary Search
> Source: https://prachub.com/interview-questions/find-the-sorted-insertion-index

### Problem

You receive a strictly increasing integer array `items` and an integer `key`. Return the zero-based position of `key` when it is already in the array. Otherwise, return the position at which placing `key` would keep the array in increasing order.

A position of `0` means before the first element. A position equal to the array length means after the last element.

The required running time is `O(log n)`, with `n = items.length`.

### Examples

**Example 1**

```text
Input: items = [-9,-2,5,12], key = 4
Output: 2
```

Placing `4` between `-2` and `5` would give it index `2`.

**Example 2**

```text
Input: items = [-4,0,8], key = 8
Output: 2
```

The key is already present at index `2`.

### Constraints

- `1 <= items.length <= 10^4`
- Every entry of `items` is an integer between `-10^4` and `10^4`, inclusive.
- Entries are distinct and ordered from smallest to largest.
- `-10^4 <= key <= 10^4`
