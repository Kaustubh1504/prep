# Smallest Missing Positive Integer in Linear Time and Constant Extra Space
> Google · Technical Screen · hard · Pattern: Hashing / Counting
> Source: https://prachub.com/interview-questions/smallest-missing-positive-integer-in-linear-time-and-constant-extra-space

You are given an unsorted list of integers `nums`, which may contain negative numbers, zeros, duplicates, and values far larger than the length of the list. Return the smallest positive integer, that is the smallest integer that is at least `1`, that does not appear in `nums`.

In the interview, a first solution that ran in linear time but used extra memory proportional to the input was accepted as a starting point, and the interviewer then asked for the same result using only constant extra space. Aim for that tighter target.

### Function Signature

```python
def first_missing_positive(nums: list[int]) -> int:
```

### Rules

- Target complexity: `O(n)` time and `O(1)` auxiliary space, where `n = len(nums)`. The list may be rearranged or overwritten in place; its contents after the call do not matter.
- Return only the missing value.

### Constraints

- `1 <= len(nums) <= 10^5`
- `-2147483648 <= nums[i] <= 2147483647`
- The answer is a positive integer that fits in a signed 32-bit integer.

### Examples

**Example 1**

- Input: `nums = [4, -2, 1, 2]`
- Output: `3`
- Explanation: `1` and `2` are present and `3` is not.

**Example 2**

- Input: `nums = [5, 6, 100, -3]`
- Output: `1`
- Explanation: `1` does not appear, so it is the answer, however large the other values are.

**Example 3**

- Input: `nums = [1, 2, 2, 3]`
- Output: `4`
- Explanation: `1`, `2` and `3` all appear (`2` twice), so the smallest missing positive integer is `4`.

<details><summary>Hints (spoiler)</summary>

1. For a list of length n, the answer can only be one of 1, 2, ..., n + 1. Values outside [1, n] can never affect it.
2. You are allowed to overwrite the input. Could the list itself serve as the record of which values in [1, n] you have seen?
3. Try to move every value v in [1, n] to a fixed home position determined by v, then scan for the first position that does not hold its expected value. Watch out for duplicates causing endless swaps.
</details>

<details><summary>Approach (spoiler)</summary>

The answer always lies in [1, n + 1]: if every value 1..n is present the answer is n + 1, otherwise it is the smallest gap. So only values in [1, n] matter, and the list itself can act as the presence table. The reference performs a cyclic placement: at index i, if v = nums[i] is in [1, n] and its home slot nums[v - 1] does not already hold v, swap v into slot v - 1 and re-examine the value that arrived at i; otherwise advance i. Each swap puts at least one value into its final home, and the check nums[v - 1] != v stops duplicates from swapping forever, so there are at most n swaps and the loop is O(n) overall. Afterwards, the first index k with nums[k] != k + 1 gives the answer k + 1; if every slot is correct, the answer is n + 1. Only a few index variables are used beyond the input, which is O(1) auxiliary space.

**Time:** O(n) · **Space:** O(1)
</details>
