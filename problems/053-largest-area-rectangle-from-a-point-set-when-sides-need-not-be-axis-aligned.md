# Largest-Area Rectangle From a Point Set When Sides Need Not Be Axis-Aligned
> Google · Onsite · medium · Pattern: Hashing / Counting
> Source: https://prachub.com/interview-questions/largest-area-rectangle-from-a-point-set-when-sides-need-not-be-axis-aligned

You are given a set of distinct points with integer coordinates in the plane. Choose four of the points that are the corners of a rectangle, and return the largest area such a rectangle can have. The sides of the rectangle do not have to be parallel to the x- and y-axes. Return `0` if no four points form a rectangle.

### Function Signature

```python
def max_rectangle_area(points: list[list[int]]) -> int:
```

### Rules

- `points[i] = [x_i, y_i]`. The four chosen points must be distinct input points and must be exactly the four corners of the rectangle. Other input points may lie anywhere, including inside the rectangle or on its sides.
- A square counts as a rectangle.
- Because all coordinates are integers, the area of any such rectangle is an integer, so return it as an `int`.

### Constraints

- `1 <= len(points) <= 200`
- `0 <= x_i, y_i <= 40000`
- All points are distinct.
- The answer is at most `40000 * 40000 = 1,600,000,000`, which fits in a 32-bit signed integer, but intermediate values such as squared distances can reach `3,200,000,000`, which does not.

### Examples

**Example 1**

```text
Input:  points = [[1, 2], [2, 1], [1, 0], [0, 1]]
Output: 2
```

The four points form a square rotated by 45 degrees, with side length $\sqrt{2}$.

**Example 2**

```text
Input:  points = [[0, 1], [1, 0], [3, 2], [2, 3], [1, 1], [2, 1], [1, 2], [2, 2]]
Output: 4
```

`(0, 1)`, `(1, 0)`, `(3, 2)` and `(2, 3)` form a rectangle with side lengths $\sqrt{2}$ and $\sqrt{8}$, so its area is 4. The other rectangles in this set, such as the unit square `(1, 1)`, `(2, 1)`, `(2, 2)`, `(1, 2)`, are smaller.

**Example 3**

```text
Input:  points = [[0, 0], [1, 0], [2, 1], [0, 1]]
Output: 0
```

The only four points do not form a rectangle.

<details><summary>Hints (spoiler)</summary>

1. The rectangle may be tilted: in Example 1 the four points form a square rotated by 45 degrees, so checking only axis-parallel sides is not enough.
2. Other input points inside the rectangle or on its sides do not disqualify it; only the four corners have to be input points.
3. Squared distances can reach 3,200,000,000, so keep length and area arithmetic in exact 64-bit integers instead of floating-point square roots.
</details>

<details><summary>Approach (spoiler)</summary>

Two segments are the diagonals of a rectangle exactly when they have the same midpoint and the same length: diagonals that bisect each other make a parallelogram, and a parallelogram with equal diagonals is a rectangle. So enumerate every pair of points (i, j) and group it under the integer key (x_i + x_j, y_i + y_j, (x_i - x_j)^2 + (y_i - y_j)^2); using the doubled midpoint keeps the key exact. Two different pairs in one group never share a point (a shared endpoint plus a shared midpoint forces the other endpoints to coincide too), and they cannot lie on one line (equal length and equal midpoint on one line would make them the same segment), so they are the diagonals of a non-degenerate rectangle with corners p_i, p_k, p_j, p_l in that cyclic order. The two sides leaving p_i are p_k - p_i and p_l - p_i, so the area is the absolute cross product |(p_k - p_i) x (p_l - p_i)|, an exact integer with no square roots. The answer is the maximum over every pair of pairs inside every group, or 0 when no group holds two pairs: fewer than four points, collinear points, parallelograms, rhombi and trapezoids all land here. Other points inside the rectangle or on its sides never affect the check, because only the four corners are tested. Squared lengths reach 3,200,000,000, so keys and products use 64-bit integers in Java and C++ (JavaScript numbers stay exact far below 2^53); the final area is at most 1,600,000,000 and fits in a 32-bit int. All pairs sharing one midpoint are disjoint, so a group holds at most n/2 pairs, and the pair-of-pairs work is at most (n/2) * (n^2/2), which is O(n^3).

**Time:** O(n^3) · **Space:** O(n^2)
</details>
