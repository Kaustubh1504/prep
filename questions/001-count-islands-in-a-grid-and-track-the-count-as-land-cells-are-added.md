<!-- rank 1 · Coding & Algorithms · Technical Screen · medium · https://prachub.com/interview-questions/count-islands-in-a-grid-and-track-the-count-as-land-cells-are-added -->

# Count Islands in a Grid and Track the Count as Land Cells Are Added
Google · Software Engineer · Technical Screen · Coding & Algorithms · medium · General
Topics: Graphs, Grids & Matrices
https://prachub.com/interview-questions/count-islands-in-a-grid-and-track-the-count-as-land-cells-are-added

A map is a grid with `m` rows and `n` columns in which every cell is land (`1`) or water (`0`). An island is a maximal group of land cells connected horizontally or vertically. Cells that touch only at a corner are not connected.

You are given the initial map and a sequence of additions, each of which turns one cell into land. Report the number of islands before any addition, and again after each addition.

### Function Signature

```python
def island_counts(grid: list[list[int]], additions: list[tuple[int, int]]) -> list[int]:
```

### Rules

- `grid[r][c]` is `1` for land and `0` for water, where `r` is the row index and `c` is the column index.
- An addition `(r, c)` turns cell `(r, c)` into land. If that cell is already land, either initially or because of an earlier addition, the map does not change.
- Additions are applied in the given order. Land never turns back into water.
- Return a list of length `len(additions) + 1`. Element `0` is the number of islands in the initial grid. For `i >= 1`, element `i` is the number of islands after the first `i` additions have been applied.

### Constraints

- `1 <= m <= 1000`, `1 <= n <= 1000` and `m * n <= 200000`
- Every row of `grid` has exactly `n` entries, each `0` or `1`.
- `0 <= len(additions) <= 200000`
- Every addition `(r, c)` satisfies `0 <= r < m` and `0 <= c < n`. The same cell may appear more than once.
- Every count is at most `m * n`, so all values fit in a 32-bit signed integer.

### Examples

**Example 1**

```text
Input:  grid = [[1, 1, 0, 0], [0, 0, 0, 1], [1, 0, 0, 1]], additions = []
Output: [3]
```

The islands are {(0, 0), (0, 1)}, {(1, 3), (2, 3)} and {(2, 0)}. With no additions, the only element is the initial count.

**Example 2**

```text
Input:  grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], additions = [(0, 0), (0, 1), (1, 2), (2, 1), (1, 1), (1, 1)]
Output: [0, 1, 1, 2, 3, 1, 1]
```

The grid starts with no land. (0, 0) creates an island and (0, 1) joins it. (1, 2) and (2, 1) each touch no land, so each creates a new island. (1, 1) touches all three islands and merges them into one. The second (1, 1) is already land, so nothing changes.

**Example 3**

```text
Input:  grid = [[1, 1, 0, 0], [0, 0, 0, 1], [1, 0, 0, 1]], additions = [(0, 2), (0, 3), (1, 0)]
Output: [3, 3, 2, 1]
```

(0, 2) joins the top-left island. It touches (1, 3) only at a corner, so the count stays 3. (0, 3) connects the top-left island to the island at (1, 3) and (2, 3), giving 2. (1, 0) connects the merged island to (2, 0), giving 1.

## Island Count After Each Land Addition (Hard)

A map is a grid with m rows and n columns in which every cell is land (1) or water (0). An island is a maximal group of land cells connected horizontally or vertically. Cells that touch only at a corner are not connected.

You are given the initial map grid and a sequence of additions, each of which turns one cell into land. Each addition is given as a pair [r, c]. Report the number of islands before any addition, and again after each addition.

Rules:
- grid[r][c] is 1 for land and 0 for water, where r is the row index and c is the column index.
- An addition [r, c] turns cell (r, c) into land. If that cell is already land, either initially or because of an earlier addition, the map does not change.
- Additions are applied in the given order. Land never turns back into water.
- Return a list of length len(additions) + 1. Element 0 is the number of islands in the initial grid. For i >= 1, element i is the number of islands after the first i additions have been applied.

Constraints:
- 1 <= m <= 1000, 1 <= n <= 1000 and m * n <= 200000
- Every row of grid has exactly n entries, each 0 or 1.
- 0 <= len(additions) <= 200000
- Every addition [r, c] satisfies 0 <= r < m and 0 <= c < n. The same cell may appear more than once.
- Every count is at most m * n, so all values fit in a 32-bit signed integer (no value can exceed 2^31 - 1).

Example 1:
Input: grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], additions = [[0, 0], [0, 1], [1, 2], [2, 1], [1, 1], [1, 1]]
Output: [0, 1, 1, 2, 3, 1, 1]
The grid starts with no land. [0, 0] creates an island and [0, 1] joins it. [1, 2] and [2, 1] each touch no land, so each creates a new island. [1, 1] touches all three islands and merges them into one. The second [1, 1] is already land, so nothing changes.

Example 2:
Input: grid = [[1, 1, 0, 0], [0, 0, 0, 1], [1, 0, 0, 1]], additions = [[0, 2], [0, 3], [1, 0]]
Output: [3, 3, 2, 1]
The initial islands are {(0, 0), (0, 1)}, {(1, 3), (2, 3)} and {(2, 0)}. [0, 2] joins the top-left island; it touches (1, 3) only at a corner, so the count stays 3. [0, 3] connects the top-left island to the island at (1, 3) and (2, 3), giving 2. [1, 0] connects the merged island to (2, 0), giving 1.

### Constraints
- 1 <= m <= 1000, 1 <= n <= 1000 and m * n <= 200000
- Every row of grid has exactly n entries, each 0 or 1.
- 0 <= len(additions) <= 200000
- Every addition [r, c] satisfies 0 <= r < m and 0 <= c < n. The same cell may appear more than once.
- Every count is at most m * n, so all values fit in a 32-bit signed integer (no value can exceed 2^31 - 1).

### Examples
- Input: `([[1, 1, 0, 0], [0, 0, 0, 1], [1, 0, 0, 1]], [])` → Output: `[3]` — Source example 1: islands {(0,0),(0,1)}, {(1,3),(2,3)}, {(2,0)} and no additions, so only the initial count is returned.
- Input: `([[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0], [0, 1], [1, 2], [2, 1], [1, 1], [1, 1]])` → Output: `[0, 1, 1, 2, 3, 1, 1]` — Source example 2: islands are created, (1,1) merges three islands into one, and its repeat changes nothing.

### Sample tests
- Input: `([[1, 1, 0, 0], [0, 0, 0, 1], [1, 0, 0, 1]], [])` → Output: `[3]` — Source example 1: islands {(0,0),(0,1)}, {(1,3),(2,3)}, {(2,0)} and no additions, so only the initial count is returned.
- Input: `([[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0], [0, 1], [1, 2], [2, 1], [1, 1], [1, 1]])` → Output: `[0, 1, 1, 2, 3, 1, 1]` — Source example 2: islands are created, (1,1) merges three islands into one, and its repeat changes nothing.

### Starter code
**python**
```python
def island_counts(grid, additions):
    pass
```
**java**
```java
class Solution {
    public int[] island_counts(int[][] grid, int[][] additions) {
        return null;
    }
}
```
**cpp**
```cpp
#include <vector>
class Solution {
public:
    std::vector<int> island_counts(const std::vector<std::vector<int>>& grid, const std::vector<std::vector<int>>& additions) {
        return {};
    }
};
```
**javascript**
```javascript
function island_counts(grid, additions) {
    return [];
}
```

### Hints (interviewer only — reveal one at a time, and only when asked)
1. Land never turns back into water, so adding one cell can only change the island count in a limited way; consider what the new cell can connect to.
2. If the new cell touches the same island from more than one side, that island must only be counted as merged once, so you need a fast way to tell whether two land cells already belong to the same island.
3. Recounting all islands from scratch after every addition is too slow with up to 200000 cells and 200000 additions.

---

## INTERVIEWER ONLY
_Everything below is grading material. Do not show, quote or paraphrase it until the member has given their own answer, or asks to see the solution._

## Island Count After Each Land Addition
```python
def island_counts(grid, additions):
    m = len(grid)
    n = len(grid[0]) if m > 0 else 0
    total = m * n
    parent = list(range(total))
    size = [1] * total
    land = [False] * total
    count = 0

    def find(x):
        root = x
        while parent[root] != root:
            root = parent[root]
        while parent[x] != root:
            nxt = parent[x]
            parent[x] = root
            x = nxt
        return root

    def unite(i, j):
        nonlocal count
        if not land[j]:
            return
        a = find(i)
        b = find(j)
        if a == b:
            return
        if size[a] < size[b]:
            a, b = b, a
        parent[b] = a
        size[a] += size[b]
        count -= 1

    def activate(r, c):
        nonlocal count
        idx = r * n + c
        if land[idx]:
            return
        land[idx] = True
        count += 1
        if r > 0:
            unite(idx, idx - n)
        if r + 1 < m:
            unite(idx, idx + n)
        if c > 0:
            unite(idx, idx - 1)
        if c + 1 < n:
            unite(idx, idx + 1)

    for r in range(m):
        row = grid[r]
        for c in range(n):
            if row[c] == 1:
                activate(r, c)
    result = [count]
    for r, c in additions:
        activate(r, c)
        result.append(count)
    return result
```
Time O((m*n + k) * alpha(m*n)), where k = len(additions) · Space O(m*n + k)

Treat every cell as a node of a disjoint-set (union-find) structure indexed by r * n + c, with path compression and union by size, and keep a running island count. Activating a cell that is already land does nothing. Activating a water cell marks it as land and increments the count (it starts as its own island); then, for each of its up to four in-bounds orthogonal neighbours that is land, the roots of the two cells are found and, if they differ, the two sets are merged and the count is decremented. The initial grid is built by activating its land cells in row-major order and the count is recorded; each addition is then activated in order and the count recorded again.

Invariant: the count always equals the number of disjoint sets among land cells, and two land cells share a set exactly when a horizontal/vertical path of land joins them. A new land cell can only connect itself to the islands of its orthogonal neighbours, so merging it with each distinct neighbouring set and decrementing once per successful merge preserves the invariant. Comparing roots before merging is what makes a cell that touches the same island from two or more sides decrement the count only once. Diagonal cells are never examined, so corner contact never connects islands, and neighbour indices are derived from (r, c) with explicit bounds checks against m and n, so the last cell of one row is never treated as adjacent to the first cell of the next.

Edge cases: empty additions returns only the initial count; repeated additions and additions on initial land repeat the previous count; an all-water grid starts at 0 and an all-land grid stays at 1. Every count is at most m * n <= 200000, so 32-bit integers suffice in every language.

---
PracHub quota: 1/25 questions opened today · 60/250 this month · resets 2026-10-30 00:00 UTC