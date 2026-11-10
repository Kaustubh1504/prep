# Min deletions to avoid overlap in first k
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Intervals / Sweep Line

## Problem
You are given two integer lists `list1` and `list2` and an integer `k`.

You may delete any elements from `list2` (but not from `list1`); the remaining elements of `list2` keep their original relative order. Your goal is that, after the deletions, the **first `k` elements** of `list2` share **no value** with the first `k` elements of `list1`. That is, no value appearing in `list1[0:k]` may appear anywhere in the new `list2[0:k]`.

Return the **minimum number of deletions** needed. If it is impossible (after removing the forbidden values, fewer than `k` elements of `list2` remain), return `-1`. If `k == 0` the condition holds trivially and the answer is `0`.

Values may repeat in either list; only membership matters.

## Function signature
```python
from typing import List

def min_deletions(list1: List[int], list2: List[int], k: int) -> int:
    ...
```

## Constraints
- `0 <= k <= len(list1) <= 10^5`
- `0 <= len(list2) <= 10^5`
- `-10^9 <= list1[i], list2[i] <= 10^9`

## Examples
**Example 1**
Input: `list1 = [1,2,3,4], list2 = [2,5,1,6,3,7], k = 2`
Output: `2`
Explanation: The forbidden values are `{1, 2}`. Deleting `2` and `1` makes `list2 = [5,6,3,7]`, whose first two elements `[5,6]` avoid them. Note that `3` is not forbidden here, because only `list1[0:2]` counts.

**Example 2**
Input: `list1 = [3,3,1], list2 = [3,7,3,7,1,2], k = 3`
Output: `3`
Explanation: Forbidden `{3, 1}`. We must skip past `3, 3, 1` to collect three allowed elements `[7,7,2]`.

**Example 3** (an edge case)
Input: `list1 = [1,2,3], list2 = [1,2,4], k = 2`
Output: `-1`
Explanation: Forbidden `{1, 2}` leaves only `[4]` in `list2`, fewer than `k = 2` elements. (With `k = 0` the answer would be `0`.)

<details><summary>Approach (spoiler)</summary>

Put `list1[:k]` into a hash set. Scan `list2` left to right: every forbidden value encountered before we have collected `k` allowed values must be deleted (it would otherwise land in the first k), while allowed values are kept. Deleting anything else is never necessary, and deleting allowed values only pulls more elements forward, so the greedy count is minimal. Stop as soon as `k` allowed values are kept; if the scan ends first, return `-1`.
**Time:** O(len(list1[:k]) + len(list2)) · **Space:** O(k)

```python
from typing import List

def min_deletions(list1: List[int], list2: List[int], k: int) -> int:
    if k == 0:
        return 0
    forbidden = set(list1[:k])
    kept = removed = 0
    for x in list2:
        if x in forbidden:
            removed += 1
        else:
            kept += 1
            if kept == k:
                return removed
    return -1
```
</details>
