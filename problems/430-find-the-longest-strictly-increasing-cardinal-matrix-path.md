# Find the Longest Strictly Increasing Cardinal Matrix Path
> Google · Other · hard · Pattern: Dynamic Programming, Graph BFS / DFS
> Source: https://prachub.com/interview-questions/find-the-longest-strictly-increasing-cardinal-matrix-path

### Problem

Return the greatest number of cells in a strictly increasing matrix path. Moves are only up, down, left and right inside the matrix; no diagonal movement or wraparound is allowed.

```cpp
int longestIncreasingPath(vector<vector<int>>& matrix);
```

### Examples

```text
matrix = [[1,2],[4,3]] -> 4
matrix = [[7,7]] -> 1
```

### Constraints

- Both dimensions are 1 through 200.
- Values lie in [0,2147483647].
