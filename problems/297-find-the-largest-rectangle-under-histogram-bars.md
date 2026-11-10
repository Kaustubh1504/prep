# Find the Largest Rectangle Under Histogram Bars
> Google · Other · hard · Pattern: Monotonic Stack
> Source: https://prachub.com/interview-questions/find-the-largest-rectangle-under-histogram-bars

### Problem

The array `bars` gives the heights of adjacent histogram bars, each of width one. Return the greatest area of a rectangle that fits inside this histogram.

The rectangle spans a contiguous group of bars, has horizontal and vertical sides, and cannot extend above any bar it spans. Return only its area.

### Examples

**Example 1**

```text
Input: bars = [3,3,1,4,4]
Output: 8
```

The final two bars support a rectangle of width `2` and height `4`.

**Example 2**

```text
Input: bars = [0,2,0]
Output: 2
```

The middle bar alone supports the largest rectangle.

### Constraints

- `1 <= bars.length <= 10^5`
- `0 <= bars[i] <= 10^4`
