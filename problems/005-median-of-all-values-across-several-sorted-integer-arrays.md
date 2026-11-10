# Median of All Values Across Several Sorted Integer Arrays
> Google · Technical Screen · medium · Pattern: Heap / Top-K, Binary Search, Sorting
> Source: https://prachub.com/interview-questions/median-of-all-values-across-several-sorted-integer-arrays

You are given several integer arrays, each sorted in non-decreasing order. Return the median of all of their elements taken together.

The question was first asked for exactly two sorted arrays, and the follow-up asked for the same result when there are many input arrays. Implement the general version: the function receives any number of arrays, and two arrays is the original question.

### Function Signature

```python
def median_of_sorted_arrays(arrays: list[list[int]]) -> float:
```

### Rules

- Let `N` be the total number of elements across all arrays, and let `merged` be all of those elements in sorted order, with duplicates kept.
- If `N` is odd, the median is `merged[N // 2]`. If `N` is even, the median is `(merged[N // 2 - 1] + merged[N // 2]) / 2`.
- Return the median as a float, for example `3.0` rather than `3`. Every possible median is an integer or an integer plus one half, so the result is exact.
- Any individual array may be empty, but there is at least one element in total.

### Constraints

- `1 <= len(arrays) <= 10^4`
- `0 <= len(arrays[i])` for every `i`, and `1 <= N <= 2 * 10^5`
- Each `arrays[i]` is sorted in non-decreasing order.
- `-10^9 <= arrays[i][j] <= 10^9`

### Examples

**Example 1**

```text
Input:  arrays = [[1, 4], [2, 9]]
Output: 3.0
```

All elements in order are `[1, 2, 4, 9]`. `N = 4` is even, so the median is the average of `2` and `4`.

**Example 2**

```text
Input:  arrays = [[-3, 5, 5], [0]]
Output: 2.5
```

All elements in order are `[-3, 0, 5, 5]`, and the average of `0` and `5` is `2.5`.

**Example 3**

```text
Input:  arrays = [[-5, 0, 7], [], [2, 2, 9], [4, 10, 11]]
Output: 4.0
```

All elements in order are `[-5, 0, 2, 2, 4, 7, 9, 10, 11]`. `N = 9` is odd, so the median is the element at index `4`, which is `4`. The empty array contributes nothing.

<details><summary>Hints (spoiler)</summary>

1. Only one position of the combined sorted order matters when N is odd (index N // 2), and two adjacent positions when N is even (N // 2 - 1 and N // 2). Work out N first.
2. Every input array is already sorted, and any of them may be empty; plan how you reach those middle positions without assuming each array has a first element.
3. Duplicates count separately, and the even-N average must keep its half: the average of -2 and -1 is -1.5, not -1 or -2.
</details>

<details><summary>Approach (spoiler)</summary>

Approach: select the middle element(s) by value with binary search, without building the merged array.

Let N be the total number of elements and k the number of arrays. For a 0-indexed rank r, merged[r] is the smallest value v for which at least r + 1 elements are <= v. Reason: merged[r] itself has at least r + 1 elements at or below it (merged[0] through merged[r]), while any value v < merged[r] can only have elements strictly smaller than merged[r] at or below it, and there are at most r of those.

The count of elements <= v is non-decreasing in v. For one sorted array it is an upper-bound index found by binary search (invariant: everything left of lo is <= v, everything from hi on is > v). Summing over the arrays gives the count in O(k log L) time, where L is the longest array length.

To find merged[r], binary search v over the integer range [smallest first element, largest last element]. Invariant: the answer lies in [lo, hi]; it holds initially because the count at the largest element is N >= r + 1. If count(mid) >= r + 1, the answer is <= mid, so hi = mid; otherwise it is > mid, so lo = mid + 1. The midpoint is floored (// in Python, Math.floor in JavaScript, lo + (hi - lo) / 2 on 64-bit integers in Java and C++), so a range of negative values still shrinks and the loop terminates. When lo == hi, that value is merged[r], which is always an actual element.

For odd N return merged[N // 2] as a float. For even N return (merged[N // 2 - 1] + merged[N // 2]) / 2 with real (not integer) division; the result is exact because the sum is an integer of absolute value at most 2 * 10^9, so negative half-integer medians such as -1.5 are not truncated.

Edge cases: empty arrays add 0 to every count and are ignored when choosing the search range; N >= 1 guarantees at least one non-empty array; duplicates are counted individually, so equal values straddling the middle are handled; a single array (k = 1) and N = 1 need no special case.

**Time:** O(k log L log V), where k = len(arrays), L is the longest array length and V is the spread between the smallest and largest element (at most 2 * 10^9 + 1, so about 31 rounds per searched rank) · **Space:** O(k)
</details>
