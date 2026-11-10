# Answer parity-alternation range queries
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Prefix Sum, Segment Tree / Fenwick

## Problem
You are given an integer array `nums` and a list of queries, where `queries[i] = [l, r]` with `0 <= l <= r < n`. A subarray `nums[l..r]` (inclusive) is **parity-alternating** if every pair of adjacent elements in it has different parity, one even and one odd. A single-element subarray (`l == r`) is always parity-alternating.

For each query, return `True` if `nums[l..r]` is parity-alternating and `False` otherwise. Both `n` and the number of queries can be large, so checking each query element by element (O(n·q)) is too slow. Negative numbers follow the usual parity rules: `-3` is odd.

## Function signature
```python
def alternating_queries(nums: list[int], queries: list[list[int]]) -> list[bool]:
```

## Constraints
- `1 <= n <= 10^5`
- `1 <= len(queries) <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- Target: O(n + q)

## Examples
**Example 1**
Input: `nums = [4,3,1,6]`, `queries = [[0,2],[2,3],[0,1]]`
Output: `[False, True, True]`
Explanation: `3` and `1` are both odd, so `[4,3,1]` fails. `[1,6]` and `[4,3]` alternate.

**Example 2**
Input: `nums = [3,4,1,2,6]`, `queries = [[0,4],[0,3],[3,4],[4,4]]`
Output: `[False, True, False, True]`
Explanation: Only the pair `(2,6)` at indices 3 and 4 has equal parity. Any query that contains both indices 3 and 4 fails, and the single-element query `[4,4]` is trivially true.

**Example 3** (negative numbers)
Input: `nums = [-3,2,-1]`, `queries = [[0,2]]`
Output: `[True]`

<details><summary>Approach (spoiler)</summary>

Call index `i >= 1` a "break" if `nums[i-1]` and `nums[i]` have the same parity. A subarray `[l, r]` alternates exactly when no break `i` lies in `(l, r]`. Precompute a prefix count `bad[i]` of breaks at indices `1..i`. A query is then true exactly when `bad[r] - bad[l] == 0`. Note `bad[l]`, not `bad[l-1]`: the pair `(l-1, l)` is outside the subarray. If `nums` could change between queries, replace the prefix array with a Fenwick tree over break indicators.

**Time:** O(n + q) · **Space:** O(n)

```python
def alternating_queries(nums, queries):
    n = len(nums)
    bad = [0] * n
    for i in range(1, n):
        bad[i] = bad[i - 1] + ((nums[i] - nums[i - 1]) % 2 == 0)
    return [bad[r] - bad[l] == 0 for l, r in queries]
```
</details>
