# Count Clusters of 2D Points Within a Radius
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Union-Find, Graph BFS / DFS

## Problem
You are given a list of 2D points and a radius `r >= 0`. Two points are **directly connected** if their Euclidean distance is at most `r` (`dx² + dy² <= r²`). A **cluster** is a maximal set of points connected through a chain of direct connections (connectivity is transitive).

Return the number of clusters.

- Each list entry is a separate point; duplicate coordinates are allowed and are always in the same cluster (distance 0).
- With `r = 0`, only identical points connect.
- An empty list has 0 clusters.

Follow-up: the naive approach compares all pairs (O(n²)). Discuss how to scale to large point sets.

## Function signature
```python
from typing import List, Tuple

def count_clusters(points: List[Tuple[float, float]], r: float) -> int:
    ...
```

## Constraints
- `0 <= len(points) <= 10^5`
- Coordinates and `r` are integers or floats with absolute value `<= 10^9`
- Avoid `sqrt`: compare squared distances

## Examples
**Example 1**
Input: `points = [(0,0),(1,0),(3,0),(10,10),(10,11)]`, `r = 2`
Output: `2`
Explanation: `(0,0)-(1,0)` (distance 1) and `(1,0)-(3,0)` (distance 2) chain into one cluster even though `(0,0)` and `(3,0)` are 3 apart. `(10,10)-(10,11)` is the second.

**Example 2** (boundary is inclusive)
Input: `points = [(0,0),(3,4)]`, `r = 5`
Output: `1`
With `r = 4.99` the output is `2`.

**Example 3** (diagonal distance)
Input: `points = [(0,0),(1,1),(2,2)]`, `r = 1` → Output: `3` (each step is √2 > 1); with `r = 1.5` → `1`

**Example 4** (edge cases)
Input: `points = []`, `r = 3` → `0`; `points = [(1,1),(1,1),(2,2)]`, `r = 0` → `2`

<details><summary>Approach (spoiler)</summary>

Model points as graph nodes and count connected components with union-find (or DFS/BFS). To avoid O(n²) pair checks, hash each point into a square grid cell of side `r`: any point within distance `r` must lie in the same or one of the 8 neighbouring cells, so each point is only compared against those buckets. Handle `r = 0` separately by grouping identical coordinates. Worst case (all points in one cell) is still quadratic, but for spread-out data it is close to linear; a k-d tree is another option.
**Time:** O(n · α(n)) expected with bucketing (O(n²) worst case) · **Space:** O(n)

```python
import math
from collections import defaultdict
from typing import List, Tuple

def count_clusters(points: List[Tuple[float, float]], r: float) -> int:
    n = len(points)
    parent = list(range(n))

    def find(a: int) -> int:
        while parent[a] != a:
            parent[a] = parent[parent[a]]
            a = parent[a]
        return a

    comps = n
    def union(a: int, b: int) -> None:
        nonlocal comps
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb
            comps -= 1

    if r == 0:                                   # only identical points connect
        first = {}
        for i, p in enumerate(points):
            if p in first: union(i, first[p])
            else: first[p] = i
        return comps
    cell = defaultdict(list)                     # grid of side r: neighbours lie in the 3x3 block
    r2 = r * r
    for i, (x, y) in enumerate(points):
        cx, cy = math.floor(x / r), math.floor(y / r)
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                for j in cell.get((cx + dx, cy + dy), ()):
                    px, py = points[j]
                    if (x - px) ** 2 + (y - py) ** 2 <= r2:
                        union(i, j)
        cell[(cx, cy)].append(i)
    return comps
```
</details>
