# Find where to cut cake into equal areas
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Binary Search, Math / Number Theory

## Problem
A "cake" is made of `n` rectangles placed side by side along the x-axis, all standing on `y = 0`. Rectangle `i` has width `widths[i]` and height `heights[i]`. Rectangle 0 starts at `x = 0`, and each later rectangle starts where the previous one ends. The cake's height profile is therefore a piecewise-constant step function.

**Part 1.** Find the x-coordinate of a single **vertical** cut that splits the cake into two pieces of equal area. All heights are positive, so the answer is unique. The cut can fall strictly inside a rectangle or exactly on a boundary between two rectangles.

**Part 2 (follow-up).** Given `k >= 2`, return the `k-1` x-coordinates, in increasing order, of vertical cuts that split the cake into `k` pieces of equal area.

Answers within `1e-6` of the true value are accepted. Widths, heights and areas can be large (areas up to about `10^18` per rectangle). Keep the prefix areas as exact integers and divide only at the end, so floating-point error doesn't build up.

## Function signature
```python
def cut_position(widths: list[int], heights: list[int]) -> float: ...                 # Part 1
def cut_positions(widths: list[int], heights: list[int], k: int) -> list[float]: ...   # Part 2
```

## Constraints
- `1 <= n <= 10^5`
- `1 <= widths[i], heights[i] <= 10^9`
- `2 <= k <= 10^5`
- Target: O(n + k log n)

## Examples
**Example 1**
Input: `widths = [2,2,4]`, `heights = [4,1,2]`
Output: `3.0`
Explanation: The areas are `8, 2, 8`, for a total of 18, so each half has area 9. The first rectangle supplies 8. The second rectangle has height 1, so it needs 1 more unit of width, which puts the cut at `x = 2 + 1 = 3`.

**Example 2** (cut exactly on a boundary, and a single rectangle)
Input: `widths = [1,1]`, `heights = [3,3]`
Output: `1.0`

Input: `widths = [5]`, `heights = [7]`
Output: `2.5`

**Example 3** (Part 2, and large values)
Input: `widths = [2,2,4]`, `heights = [4,1,2]`, `k = 3`
Output: `[1.5, 5.0]`
Explanation: Each piece must have area 6. The first cut is at `6/4 = 1.5`. The second needs a cumulative area of 12: the first two rectangles give 10, and the remaining 2 at height 2 needs width 1, so the cut is at `4 + 1 = 5`.

Input: `widths = [10**9]*3`, `heights = [10**9, 1, 10**9]`, `k = 2`
Output: `[1500000000.0]`

<details><summary>Approach (spoiler)</summary>

Build integer prefix sums of the areas (`pref`) and of the widths (the left edge `xs[i]` of each rectangle). For a target cumulative area `A`, binary search for the first rectangle `i` with `pref[i+1] >= A`. Inside that rectangle the area grows linearly at rate `heights[i]`, so the cut is at `xs[i] + (A - pref[i]) / heights[i]`. To keep things exact for `A = total·j/k`, compare `pref·k` against `total·j` using integers, and do one floating-point division at the end. You can also binary search on x directly, using a monotone area function, but that takes many iterations and is less precise.

**Time:** O(n + k log n) · **Space:** O(n)

```python
from itertools import accumulate

def cut_positions(widths, heights, k):
    pref = [0] + list(accumulate(w * h for w, h in zip(widths, heights)))
    xs = [0] + list(accumulate(widths))
    total = pref[-1]
    res = []
    for j in range(1, k):
        tgt_k = total * j                      # target area, scaled by k
        lo, hi = 0, len(widths) - 1
        while lo < hi:                         # first i with pref[i+1] >= target
            mid = (lo + hi) // 2
            if pref[mid + 1] * k >= tgt_k:
                hi = mid
            else:
                lo = mid + 1
        i = lo
        res.append(xs[i] + (tgt_k - pref[i] * k) / (k * heights[i]))
    return res

def cut_position(widths, heights):
    return cut_positions(widths, heights, 2)[0]
```
</details>
