# Count Collinear Points with Exact Integer Directions
> Google · Other · hard · Pattern: Math / Number Theory
> Source: https://prachub.com/interview-questions/count-collinear-points-with-exact-integer-directions

### Problem

Given distinct integer-coordinate points, return the greatest number lying on one straight line. Lines may be vertical, horizontal, or sloped. Return the count, not a line equation or a selected subset.

```cpp
int maxPoints(vector<vector<int>>& points);
```

### Examples

```text
Input: points = [[0,1],[1,3],[2,5],[3,7],[2,0]]
Output: 4
```

Four points lie on `y=2x+1`.

```text
Input: points = [[4,-2],[4,1],[4,6]]
Output: 3
```

### Constraints

- There are between 1 and 300 points.
- Each point has exactly two coordinates, each between -10000 and 10000.
- All coordinate pairs are unique.
