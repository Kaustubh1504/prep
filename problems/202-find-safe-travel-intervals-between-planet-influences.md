# Find safe travel intervals between planet influences
> Google · Technical Screen · hard · Pattern: Intervals / Sweep Line
> Source: https://prachub.com/interview-questions/find-safe-travel-intervals-between-planet-influences

You are planning a space route along a one-dimensional line (the x-axis).

You are given a list of planets. Each planet is represented by an integer pair \((c, r)\):

- `c` is the coordinate of the planet's center on the x-axis.
- `r` is a non-negative integer radius of its gravitational influence.

A point `x` on the x-axis is **unsafe** for a space traveler if it lies within the gravitational influence of at least one planet:

\[
|x - c_i| \le r_i \quad \text{for some planet } i
\]

Equivalently, each planet makes the interval \([c_i - r_i,\; c_i + r_i]\) unsafe.

Task:

- Consider the entire real line as the possible travel path.
- Compute all **maximal continuous intervals** on this line where the traveler is **safe**, i.e., points not covered by any planet's unsafe interval.
- Return these safe intervals as a sorted list of disjoint intervals.

Representation details:

- Represent each safe interval as a pair `(start, end)` with `start < end`.
- Intervals may be unbounded on the left or right:
  - Use `-∞` for an interval unbounded to the left (e.g., `(-∞, a)`).
  - Use `+∞` for an interval unbounded to the right (e.g., `(b, +∞)`).

You may assume the input list of planets can be in any order and may contain overlapping or nested gravitational ranges. Return the safe intervals in increasing order of `start`.

<details><summary>Hints (spoiler)</summary>

1. First convert every planet (c, r) into the unsafe interval [c - r, c + r].
2. Sort the unsafe intervals and merge all overlapping or touching ones. The safe intervals are the gaps before, between, and after the merged intervals.
</details>
