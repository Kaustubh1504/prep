# Compute Two-Rectangle Coverage from Eight Coordinates
> Google · Other · medium · Pattern: Intervals / Sweep Line, Math / Number Theory
> Source: https://prachub.com/interview-questions/compute-two-rectangle-coverage-from-eight-coordinates

### Problem

Return the total area covered by two axis-aligned rectangles, counting overlap once. The first is specified by bottom-left `(ax1,ay1)` and top-right `(ax2,ay2)`, and the second by the corresponding b coordinates.

```cpp
int computeArea(int ax1, int ay1, int ax2, int ay2,
                int bx1, int by1, int bx2, int by2);
```

Keep all eight scalar parameters in that order.

### Examples

```text
Input: ax1=-2, ay1=-1, ax2=3, ay2=2,
       bx1=1, by1=0, bx2=5, by2=4
Output: 27
```

The individual areas are 15 and 16; overlap area is 4.

```text
Input: ax1=0, ay1=0, ax2=0, ay2=5,
       bx1=1, by1=1, bx2=3, by2=4
Output: 6
```

### Constraints

- Every coordinate is between -10000 and 10000.
- Within each rectangle, lower x/y coordinates are at most their corresponding upper coordinates.
- Zero-width or zero-height rectangles are allowed by those inequalities.
