# Return Unique Three-Sum Value Triples
> Google · Onsite · medium · Pattern: Monotonic Stack, Sorting
> Source: https://prachub.com/interview-questions/return-unique-three-sum-value-triples

## Return Unique Three-Sum Value Triples

### Problem

Implement `threeSumTarget(nums, target) -> triples`.

Return every distinct value triple `[a, b, c]` for which three distinct input indices exist, `a <= b <= c`, and `a + b + c == target`.

Each value triple must appear exactly once even when the input contains duplicates. Sort the returned triples lexicographically. Return `[]` when no triple exists, and do not mutate `nums`.

### Constraints

- `0 <= nums.length <= 2,000`.
- `-1,000,000,000 <= nums[i], target <= 1,000,000,000`.
- Use signed 64-bit arithmetic for sums.
- Target `O(n^2 + P)` time after sorting, where `P` is the number of returned triples, and `O(n + P)` space including the result.

```hint Separate index use from output identity
Trace an input containing four copies of one value and decide which repeated index choices collapse to the same canonical value triple.
```

### Examples

```text
nums = [-1, 0, 1, 2, -1, -4]
target = 0
triples = [[-1, -1, 2], [-1, 0, 1]]
```

```text
nums = [2, 2, 2, 2]
target = 6
triples = [[2, 2, 2]]
```

```text
nums = [1, 2]
target = 3
triples = []
```

### Discussion Requirements

- Explain how duplicate values are skipped without losing a valid repeated-value triple.
- Compare the quadratic approach with extending the hash-based two-sum strategy for each fixed first element.

<details><summary>Hints (spoiler)</summary>

1. Sorting a copy of the array first makes the inner search monotone: with the smallest element of the triple fixed, the remaining two can be found by walking one pointer up from the left and one down from the right of the suffix.
2. Deduplication happens in two places -- the fixed first element, and the two elements the inward scan lands on after a hit. Only skip a repeated value once that value has already been used in the position you are advancing past, or you will delete legitimate triples such as [x, x, y].
3. Trace [2, 2, 2, 2] with target 6 and then [2, 2] with target 6: the first must report one triple and the second none, which is what pins 'three distinct indices' as separate from 'three distinct values'.
</details>

<details><summary>Approach (spoiler)</summary>

Sort a copy of nums (the copy keeps the caller's array unmutated). Then fix the smallest element of the triple by scanning i from left to right, skipping any i whose value repeats the previous one -- that first value has already contributed every triple it can. For each fixed i, the remaining problem is a two-sum over the sorted suffix, which a monotone inward scan solves in linear time: keep lo = i + 1 and hi = n - 1, compute total = arr[i] + arr[lo] + arr[hi] in 64-bit arithmetic, and move lo up when total is too small or hi down when it is too large. On a hit, record [arr[i], arr[lo], arr[hi]], step both pointers inward once, and only then skip further values equal to the ones just consumed -- stepping first is what keeps repeated-value triples like [-2, -2, 4] alive while still emitting each value triple once. The output is already lexicographic without a final sort: i visits distinct first values in ascending order, and within one i the recorded arr[lo] strictly increases. Sorting costs O(n log n), the scans cost O(n^2), and appending results costs O(P), so the total is O(n^2 + P) time and O(n + P) space including the sorted copy and the result.

**Time:** O(n^2 + P) · **Space:** O(n + P)
</details>
