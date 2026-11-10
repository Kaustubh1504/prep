# Compute city skyline outline
> Google · Technical Screen · hard · Pattern: Intervals / Sweep Line, Heap / Top-K
> Source: https://prachub.com/interview-questions/compute-city-skyline-outline

You are given a list of rectangular buildings in a 2D city skyline.

Each building is represented by three integers `[L, R, H]`:
- `L`: the x-coordinate of the left edge of the building,
- `R`: the x-coordinate of the right edge of the building (`L < R`),
- `H`: the height of the building.

All buildings stand on a flat horizontal line (y = 0) and extend vertically up to height `H`. Buildings may overlap in the x-dimension.

Your task is to compute the *skyline* formed by these buildings, as seen from a distance. The skyline should be represented as a list of **key points** `[x, height]` that describe the outer contour of the union of all buildings.

A **key point** is a point where the height of the skyline changes. The output list must satisfy all of the following:

1. The list is sorted by increasing `x`.
2. No two consecutive points have the same height (i.e., the height must change at each key point).
3. The first point has a height greater than 0.
4. The last point has height 0, marking the end of the skyline.

### Input
- An integer `n` — the number of buildings.
- A list of `n` buildings, where each building is given as a triple `[L, R, H]` of integers.

You may assume:
- `1 <= n <= 10^4`
- `0 <= L < R <= 10^9`
- `1 <= H <= 10^9`

### Output
Return a list of key points representing the skyline. Each key point is a pair `[x, height]` (or a 2-element array/tuple) of integers.

### Example
Input:
- `n = 3`
- buildings = `[[2, 9, 10], [3, 7, 15], [5, 12, 12]]`

One valid output:
- `[[2, 10], [3, 15], [7, 12], [12, 0]]`

Explanation (informal):
- From x = 2 to 3, the highest building has height 10.
- From x = 3 to 7, the highest building has height 15.
- From x = 7 to 12, the remaining highest building has height 12.
- After x = 12, there are no buildings, so the height drops to 0.

Design an algorithm to compute the skyline key points for the given buildings.

<details><summary>Hints (spoiler)</summary>

1. Think of each building as two events: a 'start' at x = L (height rises) and an 'end' at x = R (height may fall). Sort all events by x.
2. At any x, the skyline height equals the tallest building currently spanning that x. A max-heap of active building heights gives this in O(log n).
3. Use lazy deletion: instead of removing a building's height when it ends, store its right edge with it in the heap and pop entries whose end <= current x before reading the top.
4. Emit a key point only when the current max height differs from the last emitted height. When several events share the same x, collapse them so only the final height at that x is recorded.
</details>
