# Maximize the Equal Wood Segment Length
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Medium · Pattern: Binary Search

## Problem
You are given the lengths of `n` pieces of wood and an integer `k`. You may cut the pieces, but you may not glue pieces together. Find the **largest positive integer** `L` such that cutting the wood into segments of length exactly `L` produces **at least** `k` segments. A piece of length `w` gives `w // L` segments, and any leftover is discarded. If even `L = 1` gives fewer than `k` segments, which means the total length is less than `k`, return `0`. An empty list of woods returns `0`.

## Function signature
```python
def max_segment_length(woods: list[int], k: int) -> int:
```

## Constraints
- `0 <= len(woods) <= 10^5`
- `1 <= woods[i] <= 10^9`
- `1 <= k <= 10^9`
- Target: O(n log(max(woods)))

## Examples
**Example 1**
Input: `woods = [232, 124, 456]`, `k = 7`
Output: `114`
Explanation: With `L = 114` the pieces give `2 + 1 + 4 = 7` segments. With `L = 115` they give `2 + 1 + 3 = 6`, which is not enough.

**Example 2** (impossible)
Input: `woods = [1, 2, 3]`, `k = 7`
Output: `0`
Explanation: The total length is 6, so even unit segments give only 6.

**Example 3** (boundaries)
Input: `woods = [5]`, `k = 5` gives `1`.
Input: `woods = [4, 4, 4]`, `k = 3` gives `4`, using each whole piece.
Input: `woods = [10**9, 10**9, 10**9]`, `k = 3` gives `1000000000`.
Input: `woods = []`, `k = 1` gives `0`.

<details><summary>Approach (spoiler)</summary>

The feasibility test `count(L) = Σ w // L >= k` is monotone: if length `L` works, every shorter length works too. Binary search for the largest feasible `L` in `[0, max(woods)]`, keeping the invariant that `lo` is always feasible (`L = 0` stands for "impossible"). Use the upper midpoint `(lo + hi + 1) // 2` so the loop always makes progress. In fixed-width languages, accumulate the count in 64 bits, or stop early once it reaches `k`.

**Time:** O(n log(max w)) · **Space:** O(1)

```python
def max_segment_length(woods, k):
    lo, hi = 0, max(woods, default=0)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if sum(w // mid for w in woods) >= k:
            lo = mid
        else:
            hi = mid - 1
    return lo
```
</details>
