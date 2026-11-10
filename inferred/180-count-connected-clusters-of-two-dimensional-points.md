# Count Connected Clusters of Two-Dimensional Points
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Union-Find, Graph BFS / DFS

## Problem
You are given `points`, a list of integer coordinates `(x, y)`, and a non-negative integer radius `r`. Two points are **directly connected** if the Euclidean distance between them is **at most** `r`, inclusive. Connectivity is transitive: if A is connected to B and B to C, then A, B and C are in the same cluster, even when A and C are farther apart than `r`.

Return the number of clusters (connected components).

Details:
- Duplicate coordinates are separate points. They are at distance 0 from each other, so they always land in the same cluster, even when `r = 0`.
- Compare distances exactly. Use squared integer distances, `dx*dx + dy*dy <= r*r`, rather than floating-point square roots. Coordinates go up to `10^9`, so the squared values reach about `8·10^18`. That is fine in Python but overflows 32-bit integers, and comes close to the signed 64-bit limit, in other languages.
- An empty input has 0 clusters.
- A recursive DFS can blow the stack on long chains. Use union-find or an iterative traversal.
- Follow-up: comparing all pairs is O(n²). Do better on large inputs when points are spread out.

## Function signature
```python
def count_clusters(points: list[tuple[int, int]], r: int) -> int:
```

## Constraints
- `0 <= len(points) <= 10^5`
- `-10^9 <= x, y <= 10^9`
- `0 <= r <= 3·10^9`

## Examples
**Example 1** (transitive chain)
Input: `points = [(0,0),(3,4),(6,8),(20,20),(21,20)]`, `r = 5`
Output: `2`
Explanation: `(0,0)-(3,4)` and `(3,4)-(6,8)` are both exactly 5 apart, so the first three points form one chain even though `(0,0)` and `(6,8)` are 10 apart. `(20,20)` and `(21,20)` form the second cluster.

**Example 2** (the boundary matters)
Input: same points, `r = 4`
Output: `4`
Explanation: A distance of exactly 5 is now too far. Only `(20,20)-(21,20)` is connected.

**Example 3** (duplicates with r = 0, and empty input)
Input: `points = [(1,1),(1,1),(2,2)]`, `r = 0`
Output: `2`

Input: `points = []`, `r = 3`
Output: `0`

<details><summary>Approach (spoiler)</summary>

Use union-find with path compression, starting with `n` components and decrementing on every successful union. To avoid checking all O(n²) pairs, bucket the points into a grid of square cells of side `r` (side 1 when `r = 0`). Two points within distance `r` must be in the same cell or in one of the 8 neighbouring cells, so each point only needs to be compared with points in those 9 cells. Visiting only half of the neighbour offsets handles each pair of cells once. Do every distance test in exact integer arithmetic. For spread-out data this is close to linear. The worst case, with many points packed into one cell, is still quadratic; mention a k-d tree as a further option.

**Time:** O(n α(n)) expected for spread-out points, O(n²) worst case · **Space:** O(n)

```python
from collections import defaultdict

def count_clusters(points, r):
    n = len(points)
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    comps = n
    r2 = r * r
    size = max(r, 1)
    cells = defaultdict(list)
    for i, (x, y) in enumerate(points):
        cells[(x // size, y // size)].append(i)
    for (cx, cy), idxs in cells.items():
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                if (dx, dy) < (0, 0):          # visit each pair of cells once
                    continue
                other = cells.get((cx + dx, cy + dy))
                if not other:
                    continue
                for i in idxs:
                    xi, yi = points[i]
                    for j in other:
                        if (dx, dy) == (0, 0) and j <= i:
                            continue
                        xj, yj = points[j]
                        if (xi - xj) ** 2 + (yi - yj) ** 2 <= r2:
                            ri, rj = find(i), find(j)
                            if ri != rj:
                                parent[ri] = rj
                                comps -= 1
    return comps
```
</details>
