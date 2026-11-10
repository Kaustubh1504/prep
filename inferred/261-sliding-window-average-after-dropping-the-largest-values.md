# Sliding Window Average After Dropping the Largest Values
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Sliding Window

## Problem
You get an integer array `nums`, a window size `w` and an integer `k` with `0 <= k < w`. Look at every contiguous window of `w` elements, from left to right. In each window, remove exactly the `k` **largest** values. Duplicates count separately, so if the window has three 9s and `k = 2`, only two of the 9s are removed. Then compute the average of the remaining `w - k` values.

Return the list of averages, one per window, in window order. If `len(nums) < w`, there are no windows, so return `[]`. Values may be negative. With `k = 0`, the answer is the plain moving average.

The input can be long, so do not re-sort each window. That would cost O(n · w log w). Maintain an ordered structure as the window slides.

## Function signature
```python
def windowed_trimmed_average(nums: list[int], w: int, k: int) -> list[float]:
```

## Constraints
- `0 <= len(nums) <= 2 * 10^5`
- `1 <= w <= 2 * 10^5`, `0 <= k < w`
- `-10^9 <= nums[i] <= 10^9`

## Examples
**Example 1**
Input: `nums = [1,5,2,8,3,7], w = 3, k = 1`
Output: `[1.5, 3.5, 2.5, 5.0]`
Explanation: For window [1,5,2], dropping 5 leaves (1+2)/2 = 1.5. For [5,2,8], dropping 8 leaves 3.5. For [2,8,3], dropping 8 leaves 2.5. For [8,3,7], dropping 8 leaves 5.0.

**Example 2** (an edge case: duplicates removed one at a time)
Input: `nums = [7,7,1,7,2], w = 4, k = 2`
Output: `[4.0, 1.5]`
Explanation: For window [7,7,1,7], two of the three 7s are dropped, leaving (1+7)/2 = 4.0. For window [7,1,7,2], both 7s are dropped, leaving 1.5.

**Example 3** (an edge case: k = 0 with negative values)
Input: `nums = [-3,6,-1,2], w = 2, k = 0`
Output: `[1.5, 2.5, 0.5]`

**Example 4** (an edge case)
Input: `nums = [1,2], w = 3, k = 1`
Output: `[]`

<details><summary>Approach (spoiler)</summary>

Keep the current window in an order-statistics structure that can return "the sum of the `w - k` smallest values". Here that structure is a Fenwick tree over coordinate-compressed values, storing a **count** and a **sum** for each value. Sliding the window means one insert and one delete, each O(log n). To get the sum of the `t` smallest values, descend the Fenwick tree with binary lifting. Accumulate whole blocks while their count stays below `t`, then fill the remaining slots with copies of the next value. This handles duplicates exactly. An equivalent alternative uses two balanced multisets (or two lazy-deletion heaps): one holds the top `k` values and the other holds the rest, with a running sum of the second.
**Time:** O(n log n) · **Space:** O(n)

```python
def windowed_trimmed_average(nums: list[int], w: int, k: int) -> list[float]:
    vals = sorted(set(nums))
    rank = {v: i + 1 for i, v in enumerate(vals)}
    m = len(vals)
    cnt = [0] * (m + 1)       # Fenwick tree of counts per value rank
    sm = [0] * (m + 1)        # Fenwick tree of sums per value rank
    LOG = m.bit_length()

    def update(v: int, sign: int) -> None:
        i = rank[v]
        while i <= m:
            cnt[i] += sign
            sm[i] += sign * v
            i += i & -i

    def sum_smallest(t: int) -> int:
        # sum of the t smallest values currently stored (duplicates counted separately)
        pos, c, s = 0, 0, 0
        for b in range(LOG, -1, -1):
            nxt = pos + (1 << b)
            if nxt <= m and c + cnt[nxt] < t:
                pos = nxt
                c += cnt[nxt]
                s += sm[nxt]
        # values[pos] (rank pos + 1) fills the remaining t - c slots
        return s + (t - c) * vals[pos] if t > c else s

    keep = w - k
    out = []
    for i, x in enumerate(nums):
        update(x, +1)
        if i >= w:
            update(nums[i - w], -1)
        if i >= w - 1:
            out.append(sum_smallest(keep) / keep)
    return out
```
</details>
