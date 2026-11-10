# Find Feature Activation Order
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Online Assessment · Easy · Pattern: Topological Sort, Graph BFS / DFS

## Problem
You are rolling out a set of product features. Some features require others to be activated first. You are given:
- `features`: the list of all feature names (unique),
- `dependencies`: a list of pairs `[feature, prerequisite]` meaning `prerequisite` must be activated before `feature`.

Return an order in which all features can be activated so every prerequisite comes before the features that need it. When several features are ready at the same time, activate the **lexicographically smallest** name first, which makes the answer unique.

If the dependencies contain a cycle (so no valid order exists), return an empty list. Duplicate dependency pairs may appear and should not break the algorithm.

## Function signature
```python
from typing import List

def feature_activation_order(features: List[str], dependencies: List[List[str]]) -> List[str]:
    ...
```

## Constraints
- `1 <= len(features) <= 10^4`
- `0 <= len(dependencies) <= 10^5`
- Every name in `dependencies` appears in `features`; no self-dependencies

## Examples
**Example 1**
Input: `features = ["search","auth","db","ui"]`, `dependencies = [["search","db"],["ui","auth"],["ui","search"]]`
Output: `["auth","db","search","ui"]`
Explanation: `auth` and `db` have no prerequisites; `auth` is smaller. `search` becomes ready after `db`, and `ui` needs both `auth` and `search`.

**Example 2** (cycle)
Input: `features = ["a","b","c"]`, `dependencies = [["a","b"],["b","c"],["c","a"]]`
Output: `[]`

**Example 3** (no dependencies)
Input: `features = ["z","y","x"]`, `dependencies = []`
Output: `["x","y","z"]`

<details><summary>Approach (spoiler)</summary>

Kahn's algorithm: compute in-degrees (number of prerequisites) and push every feature with in-degree 0 into a min-heap. Repeatedly pop the smallest ready feature, append it, and decrement its dependents' in-degrees, pushing any that reach 0. If fewer than all features are output, the remaining ones lie on or behind a cycle, so return `[]`. Counting duplicate edges in both the in-degree and the adjacency list keeps them consistent.
**Time:** O((V + E) log V) · **Space:** O(V + E)

```python
import heapq
from typing import List

def feature_activation_order(features: List[str], dependencies: List[List[str]]) -> List[str]:
    indeg = {f: 0 for f in features}
    out = {f: [] for f in features}
    for feat, pre in dependencies:
        out[pre].append(feat)
        indeg[feat] += 1
    heap = [f for f in features if indeg[f] == 0]
    heapq.heapify(heap)
    order = []
    while heap:
        f = heapq.heappop(heap)
        order.append(f)
        for g in out[f]:
            indeg[g] -= 1
            if indeg[g] == 0:
                heapq.heappush(heap, g)
    return order if len(order) == len(features) else []
```
</details>
