# O(1) Range Queries: Are All Elements of a Subarray Distinct?
> Google · Onsite · medium · Pattern: Sliding Window, Topological Sort
> Source: https://prachub.com/interview-questions/o-1-range-queries-are-all-elements-of-a-subarray-distinct

You are given an integer array `nums` and a range `[l, r]` of indices. Determine whether the elements `nums[l], nums[l + 1], ..., nums[r]` are all distinct, that is, whether no value appears twice in the range.

The interviewer then extended the task: many different ranges will be queried against the same array, so precompute information about `nums` once, with the best preprocessing time you can achieve, such that every query is answered in O(1) time. Implement the extended version, which receives all the queries at once.

### Function Signature

```python
def ranges_distinct(nums: list[int], queries: list[list[int]]) -> list[bool]:
```

### Rules

- Each query is `[l, r]` with 0-indexed, inclusive bounds.
- The answer to a query is `True` if no value occurs more than once among `nums[l..r]`, and `False` otherwise. A range with one element is always `True`.
- Return the answers in the order of `queries`.
- The preprocessing may depend only on `nums`, and each query must then be answered in O(1) time.

### Constraints

- `1 <= len(nums) <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `1 <= len(queries) <= 10^5`
- `0 <= l <= r < len(nums)` for every query

### Examples

**Example 1**

```text
Input:  nums = [3, 1, 4, 1, 5, 9, 2, 6, 5]
        queries = [[0, 2], [0, 3], [4, 7], [2, 8], [5, 5]]
Output: [True, False, True, False, True]
```

`nums[0..3]` contains `1` twice (indices 1 and 3), and `nums[2..8]` contains `5` twice (indices 4 and 8). The other three ranges have no repeated value.

**Example 2**

```text
Input:  nums = [2, 2]
        queries = [[0, 0], [0, 1], [1, 1]]
Output: [True, False, True]
```

Each single-element range is distinct, while the whole array repeats `2`.

<details><summary>Hints (spoiler)</summary>

1. Check Example 1 by hand: for each False answer, find the two equal values inside the range and note where they sit relative to l and r.
2. If a range contains a repeated value, every larger range that contains it does too, and a single-element range is always True.
3. Values span -10^9 to 10^9, so treat them as arbitrary integers: x and -x are different values.
</details>

<details><summary>Approach (spoiler)</summary>

Scan nums once from left to right, keeping a hash map from each value to the most recent index where it occurred, and a running bound: the smallest index b such that nums[b..i] has no repeated value. When nums[i] was last seen at index j, any distinct window ending at i must start after j, so bound = max(bound, j + 1); store start[i] = bound. A query [l, r] is then True exactly when l >= start[r], which is one array lookup and one comparison.

Invariant: start[r] = 1 + max(prev[k] for k <= r), where prev[k] is the nearest earlier index holding the value nums[k] (or -1 if there is none). Correctness: if l >= start[r], every k in [l, r] has prev[k] < l, so no value in the range has an earlier copy inside the range and the range is distinct. If l < start[r], some k <= r has prev[k] = start[r] - 1 >= l; because k > prev[k] >= l, both k and prev[k] lie in [l, r] and hold the same value, so the range is not distinct.

Why the details matter: tracking the nearest earlier occurrence (not the first) is required when a value occurs three or more times, and the running maximum is required because the repeat inside [l, r] need not involve nums[r]. Edge cases: start[r] <= r always, so a single-element range [r, r] is always True; a copy just outside the range (at l - 1 or r + 1) never fires, because it either gives a prev value below l or only raises start at positions beyond r; repeated queries are answered independently in query order; negative values and x / -x pairs are distinct keys in the map. Preprocessing is O(n) expected time and O(n) extra space, and each query costs O(1).

**Time:** O(n + q) · **Space:** O(n)
</details>
