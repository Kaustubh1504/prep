# Find the first larger value for every element of a circular array
> Google · Onsite · medium · Pattern: Monotonic Stack
> Source: https://prachub.com/interview-questions/find-the-first-larger-value-for-every-element-of-a-circular-array

You are given an integer array `nums` that is treated as circular: after the last element, scanning continues from the first element. For every index `i`, find the next greater value of `nums[i]`: the first value strictly greater than `nums[i]` met while scanning forward from index `i + 1`, wrapping around past the end, and stopping before returning to index `i`. If no such value exists, the answer for that index is `-1`.

### Function Signature

```python
def next_greater_circular(nums: list[int]) -> list[int]:
```

### Rules

- The scan for index `i` visits indices `i + 1, i + 2, ..., n - 1, 0, 1, ..., i - 1` in that order, so it visits every other index exactly once. For `n = 1` it visits nothing, and the answer is `[-1]`.
- Only a strictly greater value counts; an equal value is skipped.
- Return a list `answer` of length `n`, where `answer[i]` is the value found for index `i`, or `-1` if none is found. Values in `nums` are non-negative, so `-1` cannot be confused with a real value.

### Constraints

- `1 <= n <= 100000`, where `n = len(nums)`
- `0 <= nums[i] <= 10^9`

### Examples

**Example 1**

```text
Input:  nums = [3, 8, 4, 1, 2]
Output: [8, -1, 8, 2, 3]
```

For index 2 (value 4), the scan visits 1 and 2, wraps around to 3, and then reaches 8. Nothing exceeds 8, so index 1 gets `-1`. Index 4 (value 2) wraps around and finds 3 immediately.

**Example 2**

```text
Input:  nums = [5, 5, 5]
Output: [-1, -1, -1]
```

Equal values do not count as greater.

**Example 3**

```text
Input:  nums = [2, 1, 2, 4, 3]
Output: [4, 2, 4, -1, 4]
```

Index 0 skips 1 and the equal value 2 before reaching 4. Index 4 (value 3) wraps around past 2, 1 and 2 to reach 4.

<details><summary>Hints (spoiler)</summary>

1. Scanning forward separately from every index can visit up to n - 1 other elements per index; with n up to 100000, look for a way to let a single left-to-right sweep settle the answers of many waiting indices at once.
2. The circular scan for index i sees the same elements, in the same order, as a straight scan over the array written twice in a row, starting just after position i.
3. Only a strictly greater value ends the search for an index, so equal values never resolve each other and every copy of the largest value ends up with -1.
</details>

<details><summary>Approach (spoiler)</summary>

Walk the array twice in circular order, k = 0 .. 2n - 1 with i = k mod n, keeping a stack of indices whose answer is still unknown. When value v = nums[i] arrives, pop every stacked index whose value is strictly less than v and record v as its answer; an equal value pops nothing. Only during the first pass (k < n) is i pushed afterwards, so each index is pushed once; the second pass only resolves indices that are still waiting.

Invariant: the values of the stacked indices are non-increasing from bottom to top, because an index is pushed only after every smaller value above it has been popped. Hence the stacked indices with a value smaller than v always form a contiguous top segment, and an index j is popped at exactly the first step k > j whose value exceeds nums[j].

Correctness: steps k = j + 1 .. 2n - 1 visit indices j + 1, ..., n - 1, 0, ..., j - 1 in that order, then index j itself (never strictly greater than nums[j]), then indices j + 1 .. n - 1 again, which were already examined. So the first strictly greater value met is exactly the first one in the required scan order i + 1, ..., n - 1, 0, ..., i - 1. An index that is never popped has no strictly greater value anywhere (it holds the global maximum) and keeps -1.

Edge cases: n = 1 pushes the single index and nothing can pop it, giving [-1]; an all-equal array never pops; every copy of the maximum keeps -1; the answer is the first greater value in scan order, not the largest; values stay within 32-bit range, and an empty list (outside the stated constraints) returns [].

**Time:** O(n) · **Space:** O(n)
</details>
