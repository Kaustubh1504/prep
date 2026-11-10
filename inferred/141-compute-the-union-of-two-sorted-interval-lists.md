# Compute the Union of Two Sorted Interval Lists
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Medium · Pattern: Intervals / Sweep Line

## Problem
You are given two lists of **closed** integer intervals, `a` and `b`. Each list is sorted by start point, and the intervals *within* a single list are pairwise non-overlapping (they may still touch at an endpoint, e.g. `[1,2]` and `[2,3]`). Intervals from different lists may overlap arbitrarily: they can be identical, one may contain the other, or they may partially overlap or touch.

Return the union of all intervals from both lists as a sorted list of disjoint closed intervals, with as few intervals as possible. Because intervals are closed, two intervals that share an endpoint (`[1,3]` and `[3,5]`) must be merged into one (`[1,5]`). Intervals that are merely adjacent integers but do not share a point (`[1,2]` and `[3,4]`) are **not** merged.

Your solution should run in linear time in the total number of intervals: don't concatenate and re-sort.

Either list may be empty. If both are empty, return an empty list.

## Function signature
```python
def interval_union(a: list[list[int]], b: list[list[int]]) -> list[list[int]]:
```

## Constraints
- `0 <= len(a), len(b) <= 10^5`
- `a[i] = [start, end]` with `-10^9 <= start <= end <= 10^9`
- Each list is sorted by `start`, and no two intervals in the same list overlap except possibly at a shared endpoint
- Target: O(len(a) + len(b)) time

## Examples
**Example 1**
Input: `a = [[1,3],[6,9]]`, `b = [[2,5],[9,12],[15,16]]`
Output: `[[1,5],[6,12],[15,16]]`
Explanation: `[1,3]` and `[2,5]` overlap, giving `[1,5]`. `[6,9]` and `[9,12]` share the point 9, so they merge into `[6,12]`.

**Example 2** (touching endpoints, and an interval that is a single point)
Input: `a = [[1,2],[5,6]]`, `b = [[2,3],[4,4]]`
Output: `[[1,3],[4,4],[5,6]]`
Explanation: `[1,2]` and `[2,3]` touch at 2. `[4,4]` and `[5,6]` share no point, so they stay separate.

**Example 3** (containment and an empty list)
Input: `a = [[1,10]]`, `b = [[2,3],[4,5],[10,10]]`
Output: `[[1,10]]`

Input: `a = []`, `b = [[1,10]]`
Output: `[[1,10]]`

<details><summary>Approach (spoiler)</summary>

Do the merge step of merge sort with two pointers. At each step, take whichever list's next interval starts earlier, so you see intervals in global start order. Keep a running result. If the next interval starts at or before the end of the last result interval (`s <= res[-1][1]`, using `<=` because the intervals are closed), extend that end to `max(end, e)`; otherwise start a new result interval. Since every interval is visited exactly once in sorted order, this is the standard merge-intervals sweep without the sort.

**Time:** O(n + m) · **Space:** O(1) beyond the output

```python
def interval_union(a, b):
    i = j = 0
    res = []
    while i < len(a) or j < len(b):
        if j >= len(b) or (i < len(a) and a[i][0] <= b[j][0]):
            s, e = a[i]; i += 1
        else:
            s, e = b[j]; j += 1
        if res and s <= res[-1][1]:
            res[-1][1] = max(res[-1][1], e)
        else:
            res.append([s, e])
    return res
```
</details>
