# Solve matrix groups and recipe inventory
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Graph BFS / DFS

## Problem
This screen consisted of two independent coding problems.

### Part 1 — Minimum-sum matrix group
You are given an `R x C` integer matrix `grid` and a positive integer `k` such that both `R` and `C` are divisible by `k`. Partition the matrix into non-overlapping `k x k` **groups** (blocks): group `(br, bc)` covers rows `br*k .. br*k + k - 1` and columns `bc*k .. bc*k + k - 1`.

Compute the sum of each group and return the block coordinates `(br, bc)` of the group with the **minimum sum**. If several groups tie, return the one that comes first in row-major order (smallest `br`, then smallest `bc`). If `k` does not divide both dimensions, raise `ValueError`.

### Part 2 — Recipe inventory
You are given:
- `recipes`: a map from a craftable item to its recipe, a list of `(ingredient, quantity)` pairs needed to produce **one** unit of that item. Each item has at most one recipe. Items without a recipe are raw materials.
- `inventory`: how many units of each item you currently hold.
- a `target_item` and a `target_quantity`.

To obtain `q` units of an item, first use as many units as you have in stock; for the remaining shortfall `s`, craft `s` units, which consumes `quantity * s` units of each ingredient (obtained recursively by the same rule). Stock is shared: units consumed for one branch are not available to another.

Return `True` if `target_quantity` units of `target_item` can be obtained, else `False`. A shortfall in a raw material makes it impossible. If satisfying a shortfall would require crafting an item that is already being crafted higher up the chain (a **dependency cycle**), that path fails. Requesting `0` units always succeeds.

## Function signature
```python
from typing import Dict, List, Tuple

def min_sum_block(grid: List[List[int]], k: int) -> Tuple[int, int]:
    ...

def can_make(recipes: Dict[str, List[Tuple[str, int]]],
             inventory: Dict[str, int],
             target_item: str, target_quantity: int) -> bool:
    ...
```

## Constraints
- Part 1: `1 <= R, C <= 1000`, `1 <= k <= min(R, C)`, `-10^6 <= grid[i][j] <= 10^6`
- Part 2: at most `10^4` distinct items; recipes have at most `20` ingredients; quantities and inventory counts are between `0` and `10^9` (arbitrary-precision in Python); `target_quantity >= 0`

## Examples
**Example 1** (Part 1)
Input: `grid = [[1,2,3,4],[5,6,7,8],[0,0,9,9],[1,1,9,9]], k = 2`
Output: `(1, 0)`
Explanation: Group sums are `(0,0)=14`, `(0,1)=22`, `(1,0)=2`, `(1,1)=36`; the minimum is group `(1,0)`.

**Example 2** (Part 1, tie)
Input: `grid = [[1,1,1,1],[1,1,1,1]], k = 2`
Output: `(0, 0)`
Explanation: Both groups sum to 4; the first in row-major order wins.

**Example 3** (Part 2)
Input: `recipes = {"cake": [("flour",2),("egg",1)], "flour": [("wheat",3)]}`, `inventory = {"flour":1, "wheat":9, "egg":2}`, `target_item = "cake"`, `target_quantity = 2`
Output: `True`
Explanation: 2 cakes need 4 flour and 2 eggs. We hold 1 flour, so we craft 3 flour from 9 wheat. Asking for 3 cakes instead returns `False` (only 2 eggs, and eggs are a raw material).

**Example 4** (Part 2, cycle edge case)
Input: `recipes = {"a": [("b",1)], "b": [("a",1)]}`, `inventory = {}`, `target_item = "a"`, `target_quantity = 1`
Output: `False`
Explanation: Crafting `a` needs `b`, which needs `a` again — a cycle. With `inventory = {"b": 1}` the answer is `True`, because `b` comes from stock and the cycle is never entered.

<details><summary>Approach (spoiler)</summary>

**Part 1:** Iterate over the `(R/k) * (C/k)` groups and sum each one, keeping the first strict minimum; every cell is read exactly once. (A 2-D prefix sum makes each group O(1) if many different `k` values are queried.)

**Part 2:** DFS over the recipe dependency graph. For each request, draw from shared stock first, then recurse into ingredients scaled by the shortfall. Maintain an "in progress" set of items on the current recursion path; re-entering one means a cycle and the request fails. Because each item has a single recipe there is no choice to backtrack over, so the first failure decides the answer.
**Time:** Part 1 O(R·C); Part 2 O(size of the expanded dependency tree), O(items + edges) for tree-shaped recipes · **Space:** Part 1 O(1); Part 2 O(items) for stock + recursion depth

```python
from typing import Dict, List, Tuple

def min_sum_block(grid: List[List[int]], k: int) -> Tuple[int, int]:
    rows, cols = len(grid), len(grid[0])
    if k <= 0 or rows % k or cols % k:
        raise ValueError("grid dimensions must be divisible by k")
    best = None
    for br in range(rows // k):
        for bc in range(cols // k):
            s = sum(grid[r][c]
                    for r in range(br * k, br * k + k)
                    for c in range(bc * k, bc * k + k))
            if best is None or s < best[0]:   # strict: earliest group wins ties
                best = (s, br, bc)
    return best[1], best[2]


def can_make(recipes: Dict[str, List[Tuple[str, int]]],
             inventory: Dict[str, int],
             target_item: str, target_quantity: int) -> bool:
    stock = dict(inventory)
    in_progress = set()

    def make(item: str, qty: int) -> bool:
        if qty <= 0:
            return True
        have = stock.get(item, 0)
        used = min(have, qty)
        stock[item] = have - used
        need = qty - used
        if need == 0:
            return True
        if item not in recipes or item in in_progress:
            return False          # raw-material shortage, or a dependency cycle
        in_progress.add(item)
        ok = all(make(ing, q * need) for ing, q in recipes[item])
        in_progress.discard(item)
        return ok

    return make(target_item, target_quantity)
```
</details>
