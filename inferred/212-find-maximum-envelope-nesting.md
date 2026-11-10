# Find Maximum Envelope Nesting
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Hard · Pattern: Dynamic Programming, Sorting; Binary Search

## Problem
You are given a list of envelopes, where `envelopes[i] = [w, h]` is the width and height of envelope `i`. Envelope A fits inside envelope B only if A's width **and** height are both **strictly** smaller than B's. Envelopes cannot be rotated.

Return the maximum number of envelopes that can be nested one inside another (Russian-doll style). An empty list returns 0. Envelopes with equal width, or equal height, can never nest inside each other. An O(n²) DP is the warm-up; the expected solution runs in O(n log n). (This matches LeetCode 354.)

## Function signature
```python
def max_envelopes(envelopes: list[list[int]]) -> int:
```

## Constraints
- `0 <= len(envelopes) <= 10^5`
- `1 <= w, h <= 10^5`

## Examples
**Example 1**
Input: `envelopes = [[5,4],[6,4],[6,7],[2,3]]`
Output: `3`
Explanation: `[2,3] -> [5,4] -> [6,7]`. `[6,4]` can't follow `[5,4]` because the heights are equal.

**Example 2** (duplicates)
Input: `envelopes = [[1,1],[1,1],[1,1]]`
Output: `1`

**Example 3** (a greedy choice by width fails, and empty input)
Input: `envelopes = [[1,5],[2,4],[3,3],[4,6],[5,7]]`
Output: `3`
Explanation: For example `[3,3] -> [4,6] -> [5,7]`. The heights `5,4,3` decrease, so at most one of the first three can be used.

Input: `envelopes = []`
Output: `0`

<details><summary>Approach (spoiler)</summary>

Sort by width ascending and, for equal widths, by height **descending**. Then find the longest strictly increasing subsequence of the heights. Sorting equal widths by descending height means two envelopes with the same width can never both appear in an increasing run, which enforces the strict width condition. Compute the LIS with patience sorting: `tails[k]` is the smallest possible last height of an increasing subsequence of length `k+1`. For each height, `bisect_left` finds the position to replace, or appends when the height is larger than all tails. `bisect_left` (not `bisect_right`) keeps the subsequence strictly increasing.

**Time:** O(n log n) · **Space:** O(n)

```python
from bisect import bisect_left

def max_envelopes(envelopes):
    envelopes = sorted(envelopes, key=lambda e: (e[0], -e[1]))
    tails = []
    for _, h in envelopes:
        i = bisect_left(tails, h)
        if i == len(tails):
            tails.append(h)
        else:
            tails[i] = h
    return len(tails)
```
</details>
