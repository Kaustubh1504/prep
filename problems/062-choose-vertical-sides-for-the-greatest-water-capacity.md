# Choose Vertical Sides for the Greatest Water Capacity
> Google · Other · medium · Pattern: Two Pointers
> Source: https://prachub.com/interview-questions/choose-vertical-sides-for-the-greatest-water-capacity

### Problem

The array `heights` describes upright lines at integer horizontal positions. Line `i` extends from `(i, 0)` to `(i, heights[i])`.

Choose two different lines as the sides of a container, with the horizontal axis as its base. The sides remain vertical; tilting them is not allowed. Return the greatest amount of water any such pair can hold.

For positions `left < right`, the width is `right - left`, and water cannot rise above the shorter selected line. Lines at positions between the selected sides do not create additional side choices for that particular container.

Preserve the original `maxArea` interface: one integer array and an integer result. Return the maximum amount, not the chosen indices.

### Examples

**Example 1**

```text
Input: heights = [2,6,3,5,4]
Output: 12
```

Positions `1` and `4` have width `3` and limiting height `4`, giving amount `12`.

**Example 2**

```text
Input: heights = [0,9,0]
Output: 0
```

Every pair includes a zero-height side. One tall line alone cannot hold water.

### Constraints

- The array length is between `2` and `100000`.
- Every height is an integer between `0` and `10000`.
- Horizontal positions are the array indices, one unit apart.
- Choose two distinct positions and keep both selected sides vertical.
