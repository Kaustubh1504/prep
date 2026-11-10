# Locate the Middle Value Across Two Sorted Inputs
> Google · Other · hard · Pattern: Binary Search, Heap / Top-K, Sorting
> Source: https://prachub.com/interview-questions/locate-the-middle-value-across-two-sorted-inputs

### Problem

Two integer arrays, `first` and `second`, are already sorted in nondecreasing order. Return the median of the values in their combined multiset, retaining every occurrence of a repeated value.

For an odd total count, the median is the central value. For an even total count, it is the arithmetic mean of the two central values and may end in `.5`.

The overall algorithm must take `O(log(m + n))` time, where `m` and `n` are the two lengths. A linear merge does not meet that requirement.

Preserve the original `findMedianSortedArrays` interface: two integer-array arguments and a floating-point scalar result (`double` in C++ and Java). Do not replace the result with an integer or change the arrays into a different input representation.

### Examples

**Example 1**

```text
Input: first = [2,8], second = [4]
Output: 4.0
```

The combined order is `[2,4,8]`, whose middle value is `4`.

**Example 2**

```text
Input: first = [1,5], second = [2,8]
Output: 3.5
```

The central values in `[1,2,5,8]` are `2` and `5`.

### Constraints

- `m = first.length` and `n = second.length`.
- Each length is between `0` and `1000`.
- The total length is between `1` and `2000`; both arrays cannot be empty.
- Each element is an integer between `-1000000` and `1000000`.
- Both inputs are already sorted; sorting them again is not part of the permitted logarithmic algorithm.
