# Apply Range Overwrite Queries
> Google · Onsite · hard · Pattern: Union-Find
> Source: https://prachub.com/interview-questions/apply-range-overwrite-queries

You are given an integer array `nums` of length `n` and a list of range-assignment queries. Each query is a tuple `(left, right, value)`, where `left` and `right` define an inclusive index range, and the operation means:

- for every index `i` such that `left <= i <= right`, set `nums[i] = value`

All queries are applied **in the given order**, so later queries overwrite earlier updates on overlapping positions.

Return the final state of the array after processing all queries.

Your solution should be as efficient as possible.

Example:
- `nums = [1,2,3,4,5]`
- `queries = [(1,3,9), (2,4,7)]`

After the first query: `[1,9,9,9,5]`
After the second query: `[1,9,7,7,7]`

Return `[1,9,7,7,7]`.

You may assume:
- `0 <= left <= right < n`
- `n` and the number of queries can both be large, so a naive `O(n * q)` approach may be too slow.

<details><summary>Hints (spoiler)</summary>

1. Try processing the queries from last to first. The first time you assign an index in reverse order, you already know its final value.
2. Use a disjoint-set / union-find style 'next unfilled index' structure so you can skip positions that have already been finalized.
</details>
