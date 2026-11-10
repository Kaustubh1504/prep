# Find a Horizontal Cut That Bisects Rectangle Area
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Binary Search, Math / Number Theory

## Problem
You get `n` axis-aligned rectangles that don't overlap. Each is `[x, y, w, h]`: its bottom-left corner is at `(x, y)`, its width is `w > 0` and its height is `h > 0`. Find a horizontal line `y = Y` such that the total rectangle area **below** the line equals the total area **above** it.

A rectangle the line cuts through contributes only its part below the line, `w · (Y - y)`. A rectangle entirely below the line contributes all of its area. A rectangle entirely above contributes nothing.

Several values of `Y` can work when there is a vertical gap with no rectangles at the bisecting height. In that case, return the **smallest** valid `Y`. The answer is accepted if it is within `1e-5` of the exact value. The x-coordinates have no effect on the answer.

## Function signature
```python
def horizontal_bisector(rectangles: list[list[float]]) -> float:
```

## Constraints
- `1 <= n <= 2 * 10^5`
- `-10^9 <= x, y <= 10^9`, `0 < w, h <= 10^9`
- The rectangles are pairwise disjoint. Their interiors don't intersect.
- Absolute or relative error up to `1e-5` is accepted.

## Examples
**Example 1**
Input: `rectangles = [[0,0,2,2],[3,1,1,2]]`
Output: `1.3333333333333333`
Explanation: The total area is 4 + 2 = 6, so each side needs 3. Below y = 1, only the first rectangle is present (width 2), giving area 2. Above y = 1, the combined width is 3, so we need 1/3 more height. Y = 4/3.

**Example 2**
Input: `rectangles = [[0,0,4,1]]`
Output: `0.5`

**Example 3** (an edge case: a gap at the bisecting height)
Input: `rectangles = [[0,0,1,1],[2,2,1,1]]`
Output: `1.0`
Explanation: Every Y in [1, 2] leaves area 1 on each side. The smallest is 1.

**Example 4** (an edge case: negative coordinates)
Input: `rectangles = [[0,-3,1,2],[5,10,2,1]]`
Output: `-1.0`

<details><summary>Approach (spoiler)</summary>

`areaBelow(Y)` is continuous and non-decreasing, and it is piecewise linear. Its slope at any height is the total width of the rectangles crossing that height. One option is to binary search `Y` on `[min y, max y+h]` for about 100 iterations (O(n · 100)). An exact alternative is a sweep. Record `+w` at each `y` and `-w` at each `y + h`, sort the distinct event heights, and walk upward while accumulating area. Within the first slab where the accumulated area reaches `total / 2`, solve the linear equation `Y = y_prev + (target - covered) / width`. Checking with `>=` at the bottom of each slab gives the smallest valid Y when there is a gap.
**Time:** O(n log n) · **Space:** O(n)

```python
def horizontal_bisector(rectangles: list[list[float]]) -> float:
    # rectangle = [x, y, w, h]; width enters at y, leaves at y + h
    events = {}
    total = 0.0
    for _, y, w, h in rectangles:
        total += w * h
        events[y] = events.get(y, 0.0) + w
        events[y + h] = events.get(y + h, 0.0) - w
    target = total / 2.0
    ys = sorted(events)
    covered = 0.0          # area strictly below the current sweep line
    width = 0.0            # total width of rectangles crossing the line
    for i, y in enumerate(ys):
        if i > 0:
            gain = width * (y - ys[i - 1])
            if covered + gain >= target:
                return ys[i - 1] + (target - covered) / width
            covered += gain
        width += events[y]
    return ys[-1]
```
</details>
