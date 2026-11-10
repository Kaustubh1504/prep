# Graphs & Trees

Patterns in this family, in order of interview value: Graph BFS / DFS, Trees, Shortest Path, Union-Find, Topological Sort, Trie, Linked List. Inferred problems were reconstructed from interview reports, so their wording may not match what you get asked.

---

## Graph BFS / DFS

**Recognise it when:**
- "connected", "region", "island", "group", "community", "cluster": you are counting or labelling connected components.
- "can X reach Y", "is there a path", "are A and B related": a single reachability check.
- "fewest moves / hops / steps" with **unit** edge costs: BFS (the first time you reach a node is its shortest distance).
- "time until every target is reached" with **several simultaneous starting points**: multi-source BFS (all sources go into the queue at distance 0).
- "dependencies", "references", "expand recursively", "prerequisites of X": DFS over a dependency graph with memoisation and cycle detection.
- Small `n` (≤ 20–30) together with "simple path" or "set of possible positions": the search state includes a bitmask.

**Core idea:** Model the input as nodes and edges. Grid cells have 4 neighbours, and lists of pairs become an adjacency list. Then visit every node at most once with a `visited` set. BFS expands in order of distance, so it answers "how far". DFS goes deep first, so it suits "explore everything / detect a cycle / compute from the children". What you add on top is the **state** (cell, cell + used-power, set of cells) and **what you record** when you visit a node.

**Skeleton:**
```python
from collections import deque
def bfs(sources, neighbors):
    dist = {s: 0 for s in sources}          # multi-source: all at 0
    q = deque(sources)
    while q:
        u = q.popleft()
        for v in neighbors(u):              # grid: 4 dirs + bounds + wall check
            if v not in dist:               # mark on ENQUEUE, not dequeue
                dist[v] = dist[u] + 1
                q.append(v)
    return dist
# components: for each unvisited node -> bfs/dfs from it, count += 1
```

**Pitfalls:**
- Marking a node visited when you dequeue it instead of when you enqueue it. Nodes then enter the queue many times, and dense graphs blow up.
- Recursive DFS on a 10^5-cell grid or a long chain overflows Python's recursion stack. Use an explicit stack.
- Mixing up node counts and edge counts, or forgetting the endpoint cases (start == target, start blocked, target unreachable → -1).
- In "time until all targets" problems: no targets means 0, and an unreachable target means -1. Check this before you take the max.

### Clusters

#### Connected components / flood fill — find an unvisited node, flood its whole component, count += 1
- **Anchor:** [#17 Solve Grid and Counting Problems](problems/017-solve-grid-and-counting-problems.md) — the classic island count. Learn the grid-neighbour loop and the visited marking here. (Part 2 is an unrelated multiset-counting task.)
- **Variants:**
  - [#66 Grid Reachability From Start to Target With Impassable Water Cells](problems/066-grid-reachability-from-start-to-target-with-impassable-water-cells.md) — **Differs:** only asks whether S and T are in the same component, so one flood fill from S that stops early once it reaches T. **Same concept, simpler question.**
  - [#124 Solve array-sum and city-community problems](problems/124-solve-array-sum-and-city-community-problems.md) *(inferred)* — **Differs:** part 2 is the island count with "buildings" in place of land. **Near-duplicate of #17** (part 1 is prefix-sum + hashmap, see Cross-pattern).
  - [#129 Group movies via graph traversal](problems/129-group-movies-via-graph-traversal.md) — **Differs:** the graph is an adjacency list (movie similarity), not a grid. The follow-ups compare iterative BFS, recursive DFS and Union-Find. **Same concept, different setting.**
  - [#90 Determine whether two nodes are related](problems/090-determine-whether-two-nodes-are-related.md) *(inferred)* — **Differs:** one reachability query on an undirected relation graph. Cycles and duplicate edges are harmless if you keep a visited set, and Union-Find fits equally well. **Same concept, different setting.**

#### Multi-source BFS on a grid — every source starts at distance 0, and the frontier is the "signal wave"
- **Anchor:** [#131 Find the Time for Grid Signals to Reach Every Target](problems/131-find-the-time-for-grid-signals-to-reach-every-target.md) *(inferred)* — the cleanest version. All signal sources start at time 0, blockers are walls, and the answer is the largest arrival time over the targets.
- **Variants:**
  - [#238 Compute distance to nearest taxi in grid](problems/238-compute-distance-to-nearest-taxi-in-grid.md) *(inferred)* — **Differs:** returns a distance for **every** cell (nearest taxi), not the max over targets. Cells nobody reaches stay -1. **Same concept, different output.**
  - [#93 Choose One Blocker Removal for the Fastest Grid Signals](problems/093-choose-one-blocker-removal-for-the-fastest-grid-signals.md) *(inferred)* — **Differs:** you may remove one blocker before the signals start, and you want the best resulting time. Re-run the #131 BFS once per candidate blocker and keep the strict minimum; row-major order handles the tie-break. **Follow-up of #131.** A faster approach: BFS distances from the sources and from the targets, then evaluate each blocker in O(1).

#### Single-source BFS by layers on a general graph — BFS order = distance order, so use it for ranking or for reconstructing paths
- **Anchor:** [#156 Find shortest relationship path using BFS](problems/156-find-shortest-relationship-path-using-bfs.md) *(inferred)* — a plain unweighted shortest path on an adjacency list. Drill "mark on enqueue" here.
- **Variants:**
  - [#41 Recommend top-K movies from similarity graph](problems/041-recommend-top-k-movies-from-similarity-graph.md) — **Differs:** you need the top-K nodes ranked by (distance, -rating, id), not one target. Process the BFS one layer at a time and sort or heap each layer by the remaining keys. You can stop once you have K. **Same concept + ranking.**
  - [#388 Enumerate Every Shortest Dictionary Transformation Chain](problems/388-enumerate-every-shortest-dictionary-transformation-chain.md) — **Differs:** enumerate **all** shortest word-ladder chains. Run BFS once to get each node's distance, keep every edge that goes from layer d to layer d+1 (the shortest-path DAG), then backtrack from the target. **Follow-up of #156** (one path → every path).

#### Transitive "beats" closure — a node's rank is fixed when it is comparable with every other node
- **Anchor:** [#262 Find Players with Uniquely Determined Rankings](problems/262-find-players-with-uniquely-determined-rankings.md) — full statement. Compute who reaches whom (bitset Floyd–Warshall or DFS). A player whose `above + below == n-1` has a fixed rank.
- **Variants:**
  - [#179 Determine All Players with Fixed Rankings](problems/179-determine-all-players-with-fixed-rankings.md) *(inferred)* — **Differs:** the same question. The card's method is a post-order DFS that ORs the children's descendant bitmasks (the DAG is processed in reverse topological order). **Near-duplicate of #262.**

#### Dependency-graph DFS — resolve(x) = combine(resolve(dep) for dep in deps(x)), memoised, with a "visiting" mark to catch cycles
- **Anchor:** [#142 Expand Recursive Key-Value Placeholders in a Template](problems/142-expand-recursive-key-value-placeholders-in-a-template.md) *(inferred)* — template expansion. Keys are nodes, and `%KEY%` inside a value is an edge. Memoise each resolved string and detect cycles with a three-state (unvisited / visiting / done) mark.
- **Variants:**
  - [#335 Solve matrix groups and recipe inventory](problems/335-solve-matrix-groups-and-recipe-inventory.md) *(inferred)* — **Differs:** part 2 resolves recipes into ingredients, drawing on inventory first and recursing for the shortfall. The DFS is the same; the extra state is the consumed stock. **Same concept, different setting.**
  - [#489 Solve graph and linked list tasks](problems/489-solve-graph-and-linked-list-tasks.md) *(inferred)* — **Differs:** part 1 asks for all transitive prerequisites of one task (a reachability set via DFS, minus the task itself). Parts 2–3 are Dijkstra and a linked list. **Same concept, simplest form.**

#### Bipartite matching — the two sides are different kinds of thing, each can be used once, maximise the pairs
- **Anchor:** [#54 Match people to questions using tags and priorities](problems/054-match-people-to-questions-using-tags-and-priorities.md) *(inferred)* — people ↔ questions by tag. Kuhn's augmenting-path DFS, run in priority order.
- **Variants:**
  - [#444 Min boards to cover roof holes](problems/444-min-boards-to-cover-roof-holes.md) *(inferred)* — **Differs:** looks like greedy covering, but rows and columns are the two vertex sets and each hole is an edge. The fewest boards is a minimum vertex cover, which equals the maximum matching by König's theorem. **Same concept, disguised.**

#### Word as a path in a labelled graph — walk the graph while the labels match the next character
- **Anchor:** [#355 Determine Whether a Word Exists in a Graph](problems/355-determine-whether-a-word-exists-in-a-graph.md) *(inferred)* — Word Search on an adjacency list: backtracking DFS with an on-path set (mark on the way in, unmark on the way out).
- **Variants:**
  - [#63 Count Prefix-Matching Simple Paths in a Labeled Graph](problems/063-count-prefix-matching-simple-paths-in-a-labeled-graph.md) *(inferred)* — **Differs:** **count** the simple paths for every non-empty prefix. Backtracking would enumerate too many paths, so use DP over subsets, `dp[mask][v]` (popcount(mask) = length matched). **Follow-up of #355** (decide → count).

### Other Graph BFS / DFS problems
- [#2 Reachability Between Stations in a Timed Train Schedule](problems/002-reachability-between-stations-in-a-timed-train-schedule.md) — Earliest-arrival over a timetable. Sort the trains by departure, keep the earliest arrival time at each station, and board a train only if departure ≥ arrival time there. → really Shortest Path (a time-respecting scan in the style of Dijkstra).
- [#15 Mouse-to-Cheese Grid Path That Maximizes the Minimum Distance to a Cat](problems/015-mouse-to-cheese-grid-path-that-maximizes-the-minimum-distance-to-a-cat.md) — Maximise the minimum distance to the cat. Each cell's safety is fixed (Manhattan distance), so this is a widest/bottleneck path: max-heap Dijkstra, or buckets by safety. → really Shortest Path (minimax family, see #200).
- [#28 Arrange Crops into Connected Regions in Rectangular and Two-Square Gardens](problems/028-arrange-crops-into-connected-regions-in-rectangular-and-two-square-gardens.md) — A constructive question. Fill the cells in snake (boustrophedon) order and give each crop the next `count[i]` cells; consecutive cells in that order touch, so each region is connected. The two-square follow-up needs a Hamiltonian-like walk of the shape.
- [#61 Validate parent array forms a tree](problems/061-validate-parent-array-forms-a-tree.md) — Exactly one `-1` root, then a DFS/BFS from the root must reach all n nodes. That one check rules out both cycles and disconnected parts.
- [#65 Blind Maze Escape: Shortest Command Sequence That Exits From Every Start Cell](problems/065-blind-maze-escape-shortest-command-sequence-that-exits-from-every-start-cell.md) — BFS whose state is the **set** of cells the robot could be on (a bitmask, N ≤ 29). The goal is the empty set, which means every start has escaped. Explore moves in a fixed order for deterministic tie-breaking.
- [#145 Determine Reporting Relationships](problems/145-determine-reporting-relationships.md) — `add_peer` merges peer groups (Union-Find), and `add_manager` sets one parent pointer for the whole group. `is_manager` walks up the parent chain. → really Union-Find + tree.
- [#285 Compute decayed power levels in a graph](problems/285-compute-decayed-power-levels-in-a-graph.md) *(inferred)* — Power decays by d per edge and you want the strongest arrival. Run a multi-source Dijkstra on a max-heap. → really Shortest Path.
- [#417 Clone Connected Graph Nodes without Sharing Original Objects](problems/417-clone-connected-graph-nodes-without-sharing-original-objects.md) — Clone a graph. Use a hashmap from each original node to its copy as the visited set, and create the copy **before** recursing into neighbours so that cycles terminate.
- [#470 Return All Minimum-Height Roots of an Undirected Tree](problems/470-return-all-minimum-height-roots-of-an-undirected-tree.md) — Minimum-height trees: peel leaves layer by layer (Kahn's algorithm on an undirected tree, degree == 1). The last 1–2 nodes left are the centres. → really Topological Sort-style peeling.

---

## Tree Traversal / BST

**Recognise it when:**
- "level by level", "right side view", "zigzag", "per depth": BFS that processes one level at a time (`for _ in range(len(q))`).
- "height", "balanced", "longest path", "diameter", "count of …" in a subtree: post-order, where each node returns a summary to its parent.
- "root-to-leaf", "path sum", "path from root": pre-order, passing an accumulator **down**.
- "BST", "sorted order", "k-th smallest", "range", "closest", "min difference": an in-order traversal yields sorted values. Prune with the BST ordering.
- "common manager / ancestor", "distance between two nodes": LCA.
- Given two traversals, or "the root is the max": rebuild by recursing on index ranges.

**Core idea:** Almost every tree problem is one recursion where you choose (a) what goes **down** as arguments (depth, running sum, bounds) and (b) what comes **up** as the return value (height, size, best single branch). A global answer that bends through a node, such as a diameter or a longest univalue path, combines the two child returns at that node but returns only one branch upward. A BST adds one fact: an in-order walk is sorted, and you can skip any subtree whose range cannot contain the answer.

**Skeleton:**
```python
def solve(root):
    best = 0
    def post(node, down_info):              # down_info: depth / bound / acc
        nonlocal best
        if not node:
            return BASE                     # e.g. 0 height, (True, 0)
        L = post(node.left,  step(down_info, node))
        R = post(node.right, step(down_info, node))
        best = max(best, combine_through(node, L, R))   # bends at node
        return up_value(node, L, R)          # one branch only
    post(root, INIT)
    return best
# level order: q=[root]; while q: level=[...q]; q=[children of level]
```

**Pitfalls:**
- Returning the "through-node" value (left + right) to the parent. A parent can extend only **one** branch.
- Treating an internal node as a leaf in path-sum problems. A leaf has **both** children null, so a prefix that ends at an internal node does not count.
- Deep, skewed trees (10^4–10^5 nodes) overflow Python's recursion stack. Use iterative post-order, or process the BFS order in reverse.
- BST checks against only the parent's value instead of the (lo, hi) bounds inherited from all ancestors. Also, duplicate keys break "strictly less" assumptions.

### Clusters

#### Level-order BFS — snapshot the queue length, process exactly that many nodes, and you have one level
- **Anchor:** [#346 Group Binary-Tree Values by Left-to-Right Level](problems/346-group-binary-tree-values-by-left-to-right-level.md) — the base template: one list per level, left to right.
- **Variants:**
  - [#115 Find right-side view of binary tree](problems/115-find-right-side-view-of-binary-tree.md) — **Differs:** keep only the last node of each level. (DFS alternative: visit right child first and record the first node you see at each new depth.) **Same concept, reduced output.**
  - [#269 Implement zigzag level-order traversal](problems/269-implement-zigzag-level-order-traversal.md) — **Differs:** reverse every other level, either after collecting it or by appending to a deque from alternating ends. **Follow-up of #346.**
  - [#248 Solve tree, graph, sliding-window problems](problems/248-solve-tree-graph-sliding-window-problems.md) — **Differs:** the tree part is zigzag, plus independent graph-cycle and sliding-window parts. **Near-duplicate of #269.**

#### Post-order "return a summary" — each call returns height/length/size, and the global best combines the two children
- **Anchor:** [#372 Test Height Balance throughout a Binary Tree](problems/372-test-height-balance-throughout-a-binary-tree.md) — height-balanced check. Return the height, or a sentinel such as -1 on failure, so the whole check is O(n) rather than O(n²).
- **Variants:**
  - [#374 Measure the Longest Root-to-Leaf Node Path](problems/374-measure-the-longest-root-to-leaf-node-path.md) — **Differs:** just return the height, with nothing to combine. The simplest form. **Same concept, simpler.**
  - [#282 Find the Longest Consecutive Path in a Binary Tree](problems/282-find-the-longest-consecutive-path-in-a-binary-tree.md) — **Differs:** return the longest consecutive chain starting at this node. A child continues the chain only when `child.val == node.val + 1`, and the best length is tracked globally. **Same concept.**
  - [#354 Find the Longest Path of Equal-Valued Tree Nodes](problems/354-find-the-longest-path-of-equal-valued-tree-nodes.md) *(inferred)* — **Differs:** diameter-style. A child contributes only when its value equals the node's. The answer at a node is `L + R` (the path bends through it), but it returns `max(L, R)` to its parent. Use reversed BFS order for a stack-safe post-order. **Same concept + bend.**
  - [#215 Compute distance-sum from every tree node](problems/215-compute-distance-sum-from-every-tree-node.md) *(inferred)* — **Differs:** sum of distances from **every** node. A post-order pass computes subtree sizes and the sums below each node. A pre-order pass then moves the root to each child: `ans[c] = ans[p] - size[c] + (n - size[c])`. **Follow-up** (one root → all roots, called rerooting).
  - [#425 Count a Complete Binary Tree without Visiting Every Node](problems/425-count-a-complete-binary-tree-without-visiting-every-node.md) — **Differs:** count nodes in less than O(n). If the left and right heights of a complete tree match, that subtree is perfect and has 2^h - 1 nodes; otherwise recurse. O(log² n). **Same concept, uses the complete-tree shape.**

#### Post-order rebuild — recurse into the children first, re-attach what they return, then decide this node
- **Anchor:** [#427 Mirror Binary-Tree Child Links through the Original Root](problems/427-mirror-binary-tree-child-links-through-the-original-root.md) — invert the tree: swap the children's links after recursing (or before; either works). Teaches "the return value is the new subtree".
- **Variants:**
  - [#24 Repeatedly Delete Leaves Matching a Target Value From a Binary Tree](problems/024-repeatedly-delete-leaves-matching-a-target-value-from-a-binary-tree.md) *(inferred)* — **Differs:** delete target-valued leaves repeatedly. Post-order lets a parent that becomes a leaf be removed in the same pass. Return `None` to its parent. **Same concept.**
  - [#371 Flatten Existing Tree Nodes into a Preorder Right Chain](problems/371-flatten-existing-tree-nodes-into-a-preorder-right-chain.md) — **Differs:** flatten to a pre-order right chain in O(1) extra space. Morris-style: splice the left subtree in between the node and its right child, and hook the left subtree's rightmost node to the old right child. **Same concept + space constraint.**
  - [#8 Merge Two Named Trees: First Tree's Names and Order, Second Tree's Values](problems/008-merge-two-named-trees-first-trees-names-and-order-second-trees-values.md) — **Differs:** two trees. Match same-name children by their order of appearance (a queue per name), recurse on each matched pair, then append the second tree's unmatched leftovers. **Same concept, two inputs.**

#### Root-to-leaf accumulators — pass the running sum or path down, and check at true leaves
- **Anchor:** [#389 Find Whether a Complete Root Path Has a Target Sum](problems/389-find-whether-a-complete-root-path-has-a-target-sum.md) — does any root-to-leaf path sum to the target? Negative values mean you cannot prune early.
- **Variants:**
  - [#275 Collect Every Target-Sum Root-to-Leaf Value Path](problems/275-collect-every-target-sum-root-to-leaf-value-path.md) — **Differs:** collect **all** such paths. Backtrack with a shared path list (append, recurse, pop) and copy it when you reach a valid leaf. **Follow-up of #389** (decide → enumerate).

#### Build a tree from a sequence — choose the root, split the index range, recurse
- **Anchor:** [#305 Reconstruct a Tree from Preorder and Inorder Values](problems/305-reconstruct-a-tree-from-preorder-and-inorder-values.md) — preorder + inorder. The next preorder value is the root, and its inorder index splits the range into left and right. Use a hashmap from value to index for O(n).
- **Variants:**
  - [#373 Reconstruct a Tree from Inorder and Postorder Values](problems/373-reconstruct-a-tree-from-inorder-and-postorder-values.md) — **Differs:** inorder + postorder. Take roots from the **end** of postorder and build the **right** subtree first. **Mirror of #305.**
  - [#518 Construct the Unique Maximum-Root Binary Tree](problems/518-construct-the-unique-maximum-root-binary-tree.md) — **Differs:** the root is the max of the range. Recursing gives O(n²); a monotonic decreasing stack gives O(n). **Same concept, different root rule.**
  - [#375 Build a Balanced Tree from an Ascending Linked List](problems/375-build-a-balanced-tree-from-an-ascending-linked-list.md) — **Differs:** a sorted linked list gives no random access. Recurse on a count range and advance a shared list pointer in in-order (left, then node, then right). **Same concept + linked list.**

#### BST in-order and ordering — an in-order walk is sorted, and the ordering prunes subtrees
- **Anchor:** [#413 Traverse Binary-Tree Values in Left-Root-Right Order](problems/413-traverse-binary-tree-values-in-left-root-right-order.md) — in-order traversal, recursive and with an explicit stack. Every other problem in this cluster reuses the iterative stack loop.
- **Variants:**
  - [#30 Return all binary search tree keys inside an inclusive range](problems/030-return-all-binary-search-tree-keys-inside-an-inclusive-range.md) — **Differs:** report only keys in [lo, hi]. Skip the left subtree when `node < lo` and the right when `node > hi`. **Same concept + pruning.**
  - [#516 Measure the Smallest Gap Between BST Node Values](problems/516-measure-the-smallest-gap-between-bst-node-values.md) — **Differs:** the minimum gap is between in-order neighbours, so track `prev`. **Same concept.**
  - [#242 Find mode in a trinary search tree](problems/242-find-mode-in-a-trinary-search-tree.md) — **Differs:** a ternary tree. In-order is left, node, middle (the equal values), right. Equal values come out consecutively, so count run lengths. **Same concept, different tree shape.**
  - [#561 Find Two Distinct BST Nodes Summing to a Target](problems/561-find-two-distinct-bst-nodes-summing-to-a-target.md) — **Differs:** two distinct nodes that sum to k. Use a hash set during any traversal, or in-order into a list plus two pointers (or two BST iterators for O(h) space). **Same concept.**
  - [#162 Delete a Node From a Search Tree](problems/162-delete-a-node-from-a-search-tree.md) — **Differs:** **modify** the tree. Deleting a leaf or a node with one child just splices it out. With two children, copy in the in-order successor (the leftmost node of the right subtree) and delete that. **Same concept, mutating.**

#### Lowest common ancestor — the first node where the targets' ancestor chains meet
- **Anchor:** [#19 Find the nearest common manager of K employees in a reporting tree](problems/019-find-the-nearest-common-manager-of-k-employees-in-a-reporting-tree.md) — K employees in an n-ary, possibly very deep tree. Run an iterative traversal that counts listed employees per subtree; the deepest node whose count is K is the answer.
- **Variants:**
  - [#428 Find Original-Node Common Ancestors in a Search Tree](problems/428-find-original-node-common-ancestors-in-a-search-tree.md) — **Differs:** a BST with 2 nodes. Walk down from the root; the first node with `p ≤ node ≤ q` is the LCA. O(h), no recursion. **Special case of #19.**
  - [#359 Find cheapest common ancestor in a tree](problems/359-find-cheapest-common-ancestor-in-a-tree.md) *(inferred)* — **Differs:** parent pointers plus a cost per node. Find the LCA by equalising depths, then walk from the LCA up to the root keeping the strictly cheapest node. **Follow-up of #19.**
  - [#312 Solve Quickselect, Tree Distance, and Prefix Substrings](problems/312-solve-quickselect-tree-distance-and-prefix-substrings.md) — **Differs:** part 2 asks for the distance between u and v in an edge-list tree. Run BFS from u, or use `depth[u] + depth[v] - 2·depth[lca]`. Parts 1 and 3 are quickselect and string counting. **Same concept, applied.**

### Other Tree Traversal / BST problems
- [#229 Search a Pattern Across the Leaf Text of a Binary Tree](problems/229-search-a-pattern-across-the-leaf-text-of-a-binary-tree.md) *(inferred)* — Visit the leaves left to right with a stack and feed their characters into one KMP automaton whose state carries across leaves, which catches matches that span boundaries. → really String matching (KMP) on a traversal.
- [#309 Boolean Expression Tree with Leaf Flips](problems/309-boolean-expression-tree-with-leaf-flips.md) *(inferred)* — Evaluate the Boolean tree once in post-order and cache each node's value. On a leaf flip, recompute up the parent pointers and stop as soon as a value stops changing.
- [#517 Test for an Exact Descendant Subtree Match](problems/517-test-for-an-exact-descendant-subtree-match.md) — For each node, test whether it is the same tree as `subRoot` (O(m·n)), or serialise both trees with null markers and search for one string in the other.
- [#539 Place a Binary Tree in Its Prescribed String Grid](problems/539-place-a-binary-tree-in-its-prescribed-string-grid.md) — Compute the height h first, which fixes the grid size. Then DFS with a (row, col) pair and a child offset of `2^(h-r-1)`.

---

## Shortest Path

**Recognise it when:**
- "fewest steps", "minimum hops", and every edge costs the same: BFS, not Dijkstra.
- "minimum cost / time", "weighted", "delay": Dijkstra with a heap. Weights must be non-negative.
- "minimise the **maximum** height / edge cost along the path" or "smallest threshold that allows a path": a minimax (bottleneck) path. Use Dijkstra with `max` in place of `+`, or binary search on the threshold with BFS as the check.
- Costs are only 0 or 1 ("going against the direction costs 1"): 0-1 BFS with a deque.
- "blocked / broken / dangerous nodes": delete them before searching, or put a counter in the state.
- "meeting point", "A and B both travel to …": run one Dijkstra per source, plus one from the destination on the **reversed** graph.

**Core idea:** Dijkstra settles nodes in increasing order of distance. Once a node leaves the heap its value is final, provided a path's cost never decreases as you extend it. That holds for `+` with non-negative weights and also for `max`, which is why the minimax problems reuse the same loop. When the cost is several criteria compared lexicographically (dangers, then steps), the "distance" becomes a tuple.

**Skeleton:**
```python
import heapq
def dijkstra(src, adj, combine=lambda d, w: d + w):   # combine=max for minimax
    best = {src: 0}
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > best.get(u, float('inf')):
            continue                           # stale entry
        for v, w in adj[u]:
            nd = combine(d, w)
            if nd < best.get(v, float('inf')):
                best[v] = nd
                heapq.heappush(pq, (nd, v))
    return best
```

**Pitfalls:**
- Forgetting the stale-entry check `if d > best[u]: continue`, which makes Dijkstra slow on dense graphs.
- In grid minimax, the start cell's own value counts. Initialise with `grid[start]`, not 0.
- For "visit as few dangerous stops as possible", a plain visited set is wrong. Compare the (dangers, steps) tuple, or store the best value per node and allow revisiting when it improves.
- Using Dijkstra where weights are uniform (slower and more code) or 0/1 (a deque is O(V+E)).

### Clusters

#### BFS with forbidden nodes — remove the blocked nodes, then run plain BFS
- **Anchor:** [#130 Compute shortest paths with blocked nodes](problems/130-compute-shortest-paths-with-blocked-nodes.md) — the full statement covers directed and undirected graphs. Blocked nodes are treated as absent, and a blocked start or end returns -1.
- **Variants:**
  - [#221 Find shortest path with blocked nodes](problems/221-find-shortest-path-with-blocked-nodes.md) — **Differs:** the same task. The follow-ups are bidirectional BFS to save space, and blocked nodes that are passable at extra cost, which makes the weights non-uniform and calls for Dijkstra. **Near-duplicate of #130.**
  - [#97 Minimum Path Node Count with an Optional Broken Vertex](problems/097-minimum-path-node-count-with-an-optional-broken-vertex.md) *(inferred)* — **Differs:** counts **vertices**, not edges (`dist[start] = 1`). It also has endpoint rules for a broken start or end, and part 2 allows passing through the broken vertex. **Follow-up of #130.**
  - [#160 Compute shortest delivery route with dangerous stops](problems/160-compute-shortest-delivery-route-with-dangerous-stops.md) — **Differs:** first minimise how many dangerous stops you visit, then minimise steps. Use a lexicographic (dangers, steps) cost with Dijkstra, or 0-1 BFS on dangers with BFS order breaking ties. The edges come from consecutive stops on each route. **Follow-up of #130** (forbidden → penalised).
  - [#166 Find Paths Across a Weighted Binary Grid](problems/166-find-paths-across-a-weighted-binary-grid.md) *(inferred)* — **Differs:** many top-row sources (multi-source BFS). Part 2 enumerates simple paths (backtracking), and part 3 adds positive cell costs, so it becomes multi-source Dijkstra. **Same concept, three escalations.**

#### Minimax / bottleneck path — the path's cost is the max element on it; minimise that max
- **Anchor:** [#200 Minimize maximum height along a grid path](problems/200-minimize-maximum-height-along-a-grid-path.md) *(inferred)* — Dijkstra on a grid with `max(current, h[nbr])`. The value is final when the target is popped.
- **Variants:**
  - [#360 Find minimum threshold enabling grid path](problems/360-find-minimum-threshold-enabling-grid-path.md) *(inferred)* — **Differs:** phrased as "the smallest threshold T such that a path exists". It is the same answer: either the #200 Dijkstra, or binary search on T with a BFS feasibility check (or Union-Find over cells sorted by height). **Near-duplicate of #200.**
  - [#185 Compute minimax grid path and network delay](problems/185-compute-minimax-grid-path-and-network-delay.md) *(inferred)* — **Differs:** part 1 is #200 again. Part 2 is network delay: ordinary Dijkstra from the source, and the answer is the max over all distances (-1 if any node is unreachable). **Near-duplicate + classic Dijkstra.**
  - [#80 Find A Threshold-Limited Path With Minimum Required Safety](problems/080-find-a-threshold-limited-path-with-minimum-required-safety.md) *(inferred)* — **Differs:** an edge-weighted general graph. First drop the edges above the threshold, then run minimax Dijkstra over the remaining edge costs. **Same concept, different setting.**

### Other Shortest Path problems
- [#265 Minimize travel time with optional meeting point](problems/265-minimize-travel-time-with-optional-meeting-point.md) *(inferred)* — Three independent legs: Dijkstra from A, from B, and from dest on the **reversed** graph. Then take the minimum over m of `dA[m] + dB[m] + dD[m]`, breaking ties by the smallest m. Driving separately is just m = dest, so it needs no special case.
- [#306 Minimize Direction Violations in a Directed Road Network](problems/306-minimize-direction-violations-in-a-directed-road-network.md) *(inferred)* — Add a reverse arc of cost 1 for every road, alongside the forward arc of cost 0. 0-1 BFS: weight-0 neighbours go to the front of the deque and weight-1 neighbours to the back.

---

## Union-Find

**Recognise it when:**
- "after each addition, how many groups / islands": edges or cells **arrive online** and you only ever merge.
- "earliest time everyone is connected": sort events by time and union until components == 1.
- "points within distance r form a cluster" with transitive chains: union every close pair. To avoid O(n²) comparisons, hash points into grid cells of side r.
- "are A and B in the same group" asked many times over a static or growing relation.
- "each index is assigned once, skip the ones already filled": DSU as a "next free slot" pointer.

**Core idea:** Each set is a tree whose root names it. `find` follows parents to the root, and path compression flattens the path. `union` attaches the smaller tree under the larger. Together these make each operation nearly O(1). Keep a running `components` count that drops by one on every **successful** union, so you never have to recount. The catch is that DSU cannot delete edges.

**Skeleton:**
```python
parent = list(range(n)); size = [1] * n; comps = n
def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]   # path halving
        x = parent[x]
    return x
def union(a, b):
    global comps
    ra, rb = find(a), find(b)
    if ra == rb: return False
    if size[ra] < size[rb]: ra, rb = rb, ra
    parent[rb] = ra; size[ra] += size[rb]; comps -= 1
    return True
```

**Pitfalls:**
- Adding the same land cell twice. If it is already land, do nothing; otherwise the count goes up by one too many.
- Incrementing the count when a cell becomes land but forgetting to decrement once per successful union with each of its up to 4 neighbours.
- **Removals** (unfriend) break DSU. Rebuild after each removal, or go offline: segment tree over time with a rollback DSU, or process in reverse time if the removals happen first.
- Distance checks with floats. Compare `dx*dx + dy*dy <= r*r` in integers.

### Clusters

#### Online island count — DSU over cell ids `r*C + c`, with the count maintained as cells are added
- **Anchor:** [#1 Count Islands in a Grid and Track the Count as Land Cells Are Added](problems/001-count-islands-in-a-grid-and-track-the-count-as-land-cells-are-added.md) — the full statement with up to 200k additions. A new land cell counts +1, then each successful union with a land neighbour counts -1.
- **Variants:**
  - [#288 Track Island Counts as Land Is Added](problems/288-track-island-counts-as-land-is-added.md) — **Differs:** starts from a non-empty grid. Seed the DSU with a sweep over the initial land, union neighbours, then apply the additions. Duplicates are no-ops. **Near-duplicate of #1.**

#### Earliest full connectivity over timed events — sort by time, union, stop at components == 1
- **Anchor:** [#18 Earliest Time a Friendship Network Is Fully Connected with Friend and Unfriend Events](problems/018-earliest-time-a-friendship-network-is-fully-connected-with-friend-and-unfriend-events.md) — the full statement, with friend **and** unfriend events. An unfriend can only split groups, so it can never be the first fully connected moment, but it does invalidate the DSU. With n ≤ 1000 and 2000 events, re-checking connectivity (BFS) after each friend event fits within the limits.
- **Variants:**
  - [#398 Find Earliest Fully Connected Time](problems/398-find-earliest-fully-connected-time.md) *(inferred)* — **Differs:** the same question at a scale where re-checking is too slow. Go offline: each edge is alive over an interval of time indices. Insert those intervals into a segment tree, DFS the tree with a rollback DSU (union by size, no path compression), and take the first leaf where comps == 1. **Follow-up of #18.**

#### Radius clusters of points — connect points within r, count the components
- **Anchor:** [#109 Count Clusters of 2D Points Within a Radius](problems/109-count-clusters-of-2d-points-within-a-radius.md) *(inferred)* — DSU plus spatial hashing into cells of side r. Compare each point only with points in its own and the 8 neighbouring cells.
- **Variants:**
  - [#180 Count Connected Clusters of Two-Dimensional Points](problems/180-count-connected-clusters-of-two-dimensional-points.md) *(inferred)* — **Differs:** spells out the edge cases: duplicate coordinates, r = 0 (use cell side 1), and squared distances that need overflow care. **Near-duplicate of #109.**

### Other Union-Find problems
- [#133 Apply Range Overwrite Queries](problems/133-apply-range-overwrite-queries.md) — Process the overwrite queries **in reverse**: the last write to an index is final. A DSU "next unfilled index" pointer skips cells already finalised, so each index is written once. → really a range-assignment trick (alternatives: a sorted set of free indices, or a lazy segment tree).

---

## Topological Sort

**Recognise it when:**
- "prerequisites", "depends on", "must happen before", "build order", "enable features".
- "the earliest round / semester each item can be done": Kahn's algorithm level by level, so the BFS layer is the round.
- "the smallest label first when several are ready" or "a deterministic order": Kahn's with a **min-heap** in place of the queue.
- "detect a circular dependency", "is this configuration valid": cycle detection. Either the output has fewer than n items, or a DFS meets a node marked "visiting" (gray).

**Core idea:** A node can go next once everything pointing into it has been emitted. Kahn's algorithm tracks in-degrees and repeatedly releases the nodes whose in-degree is 0. If nodes remain unreleased, they lie on or behind a cycle. The DFS version emits nodes in reverse post-order and finds cycles through back edges to gray nodes.

**Skeleton:**
```python
import heapq
def topo(n, edges):                      # edge u -> v : u before v
    adj = [[] for _ in range(n)]; indeg = [0] * n
    for u, v in edges:
        adj[u].append(v); indeg[v] += 1
    ready = [i for i in range(n) if indeg[i] == 0]
    heapq.heapify(ready)                 # FIFO deque if order is free
    out = []
    while ready:
        u = heapq.heappop(ready); out.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0: heapq.heappush(ready, v)
    return out if len(out) == n else []  # [] => cycle
```

**Pitfalls:**
- Edge direction: "a requires b" means the edge is **b → a**. Getting it backwards produces the reverse order without any error.
- Duplicate prerequisite pairs. Either deduplicate them or count every copy in both the in-degree and the adjacency list, but do it consistently.
- References to IDs that are not in the catalog. Validate them separately from the cycle check (#293).
- For rounds, snapshot the ready set per level. Do not pop into a single flat queue.

### Clusters

#### Layered Kahn's algorithm / cycle validation — release nodes whose in-degree is 0, layer by layer, and report a cycle if anything is left
- **Anchor:** [#6 Group prerequisite-linked courses into the earliest possible rounds](problems/006-group-prerequisite-linked-courses-into-the-earliest-possible-rounds.md) — full statement. Each course goes into its earliest round (the BFS layer), and a cycle returns []. Covers duplicates and deterministic output.
- **Variants:**
  - [#293 Validate course catalog dependencies](problems/293-validate-course-catalog-dependencies.md) — **Differs:** two failure modes. First collect the missing course IDs, then build the graph only over existing courses and detect cycles. **Same concept + validation.**
  - [#57 Solve checksum and dependency debugging tasks](problems/057-solve-checksum-and-dependency-debugging-tasks.md) *(inferred)* — **Differs:** framed as debugging existing feature-enable code. The fix is a DFS with three colours (gray = on the current stack), which catches cycles the buggy code missed. Part 1 is a mod-36 checksum. **Same concept, DFS version.**

#### Lexicographically smallest topological order — Kahn's with a min-heap
- **Anchor:** [#67 Find Feature Activation Order](problems/067-find-feature-activation-order.md) *(inferred)* — feature activation order: a min-heap of ready features, with a cycle meaning no full order exists.
- **Variants:**
  - [#353 Deterministic Task Execution Order](problems/353-deterministic-task-execution-order.md) *(inferred)* — **Differs:** tasks in place of features; the smallest-label tie-break is identical. **Near-duplicate of #67.**

---

## Trie

**Recognise it when:**
- "prefix", "autocomplete", "starts with", "typeahead" over many queries against one dictionary.
- "top-k suggestions for a prefix": a trie with cached best candidates at each node.
- "longest matching token at each position" or "replace dictionary words in text": walk the trie forward from each position and remember the last terminal node.
- "stream of characters, detect when the recent suffix is a word": a trie of **reversed** words, walked backwards from the newest character.
- A one-off prefix filter over a list may not need a trie at all. Sorting plus binary search, or a linear scan, can be the better answer.

**Core idea:** Each trie node is a prefix, so words that share a prefix share a path. Walking a prefix costs O(len(prefix)) no matter how big the dictionary is, and the node you land on roots every word with that prefix. Augment nodes with extra data (a terminal count, the top-k words, subtree sizes) so queries can stop at that node.

**Skeleton:**
```python
class Node:
    __slots__ = ("kids", "end")
    def __init__(self): self.kids = {}; self.end = 0   # count, not bool
def insert(root, w):
    cur = root
    for ch in w:
        cur = cur.kids.setdefault(ch, Node())
    cur.end += 1
def walk(root, s):                    # node for prefix s, or None
    cur = root
    for ch in s:
        cur = cur.kids.get(ch)
        if cur is None: return None
    return cur
```

**Pitfalls:**
- Confusing "is a prefix" with "is a word". Search needs the `end` flag, while startsWith does not.
- Duplicate words. Store a count so duplicates survive, or deduplicate deliberately.
- An empty prefix matches everything, and case sensitivity matters.
- Top-k by weight: rescanning the subtree on every query is O(subtree). Cache the top-k at each node and update along the insert path.

### Clusters

#### Prefix lookup — walk to the prefix node, then read the answer there or collect from its subtree
- **Anchor:** [#284 Implement Trie Insert and Exact-Word Search](problems/284-implement-trie-insert-and-exact-word-search.md) — insert plus exact search at scale (10^6 characters). Learn the terminal flag here.
- **Variants:**
  - [#154 Build Prefix Lookup with a Trie](problems/154-build-prefix-lookup-with-a-trie.md) *(inferred)* — **Differs:** returns every word under the prefix. DFS the subtree in sorted child order, with an end-count so duplicates survive. **Follow-up of #284.**
  - [#195 Return dictionary words matching a prefix](problems/195-return-dictionary-words-matching-a-prefix.md) — **Differs:** a single query over a list. A linear `startswith` scan is optimal, and a trie only pays off with many queries. **Same concept, possibly no trie needed.**
  - [#358 Return Words Matching a Typed Prefix](problems/358-return-words-matching-a-typed-prefix.md) — **Differs:** "as the user types". Sort the words once, then binary search the range `[prefix, prefix + '￿')`. Mention the trie as the alternative. **Same concept, different setting** (→ partly Binary Search).
  - [#49 Design autocomplete with Trie](problems/049-design-autocomplete-with-trie.md) — **Differs:** autocomplete with weights, supporting insert, update, delete and top-k. Store the top-k (or a heap) at every node along the insert path and repair it on update and delete. **Follow-up of #154** (all matches → best k, with mutations).

#### Trie walk over text — from a position, follow the text through the trie and remember the last word end seen
- **Anchor:** [#91 Implement Longest-Match Text Replacement](problems/091-implement-longest-match-text-replacement.md) — longest-match replacement. At each position, walk forward and remember the last terminal node. Replace and jump past the match, or copy one character and move on.
- **Variants:**
  - [#361 Detect and remove matched words in a char stream](problems/361-detect-and-remove-matched-words-in-a-char-stream.md) *(inferred)* — **Differs:** online stream with removals. Insert words **reversed** and, after each new character, walk backwards through the buffer to find suffix matches. Removing a matched word pops it from a stack buffer. **Same concept, mirrored direction.**

---

## Linked List

**Recognise it when:**
- "reverse", "in groups of k", "reorder first-last-alternating": pointer rewiring with prev/cur/next.
- "remove the n-th from the end", "middle", "cycle": two pointers with a gap, or fast and slow pointers.
- "remove all matching" or "remove duplicates", where the head itself may be deleted: a sentinel (dummy) head.
- "O(1) extra space" together with "sort": bottom-up merge sort over the links.

**Core idea:** You only ever change `next` pointers. A dummy node in front of the head removes the head special case. Every rewiring step should save `nxt = cur.next` **before** overwriting it. Most medium list problems combine three primitives: find the middle, reverse a segment, and merge or weave two lists.

**Skeleton:**
```python
def reverse(head, stop=None):          # reverse [head, stop)
    prev, cur = stop, head
    while cur is not stop:
        nxt = cur.next
        cur.next = prev
        prev, cur = cur, nxt
    return prev                        # new head
def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    return slow
# dummy = ListNode(0, head); prev = dummy; ...; return dummy.next
```

**Pitfalls:**
- Losing the rest of the list by overwriting `cur.next` before saving it.
- Not reconnecting the tail of a reversed segment to what follows it (k-group, reorder).
- Off-by-one in the n-th-from-end gap. Start both pointers at the dummy and advance the fast one n+1 times.
- Recursive reversal uses O(n) stack. Say so when the question asks about space.

### Clusters

#### Pointer reversal — prev/cur/next, then splice segments
- **Anchor:** [#506 Reverse Linked-Node Order by Iteration and Recursion](problems/506-reverse-linked-node-order-by-iteration-and-recursion.md) — reverse the whole list, iteratively and recursively. Every other problem in this cluster builds on it.
- **Variants:**
  - [#251 Reverse Complete Groups of Linked Nodes](problems/251-reverse-complete-groups-of-linked-nodes.md) — **Differs:** reverse each **complete** group of k and leave a short tail alone. First check that k nodes remain, reverse that segment, then reconnect the previous group's tail to the new head. **Follow-up of #506.**
  - [#418 Reorder Existing Nodes from Alternating List Ends](problems/418-reorder-existing-nodes-from-alternating-list-ends.md) — **Differs:** L0, Ln, L1, Ln-1, … Find the middle, reverse the second half, then weave the two halves together. **Follow-up of #506** (plus middle and merge).

#### Sentinel deletion — a dummy head, and `prev.next = prev.next.next` when the next node must go
- **Anchor:** [#422 Remove Every Matching Node from a Linked Chain](problems/422-remove-every-matching-node-from-a-linked-chain.md) — remove every node with a target value, including runs at the head.
- **Variants:**
  - [#370 Keep One Representative of Each Sorted List Value](problems/370-keep-one-representative-of-each-sorted-list-value.md) — **Differs:** the list is sorted and you keep one node per value run, so skip while `cur.next.val == cur.val`. Here the head is never deleted, so no dummy is needed. **Same concept.**
  - [#176 Remove a Linked Node by Its Distance from the Tail](problems/176-remove-a-linked-node-by-its-distance-from-the-tail.md) — **Differs:** the position is counted from the tail. Fast pointer n+1 ahead of slow, both starting at the dummy, gives one pass. **Same concept + two pointers.**

### Other Linked List problems
- [#419 Sort a Linked Chain with Constant-Workspace Merge Passes](problems/419-sort-a-linked-chain-with-constant-workspace-merge-passes.md) — Bottom-up merge sort: merge runs of width 1, 2, 4, … using split and merge helpers. O(1) extra space, unlike recursive top-down merge sort. → also Sorting.

---

## Cross-pattern links
- **Binary search on the answer + BFS/DSU feasibility:** #200, #360, #185, #80. Binary-search the threshold T and BFS over cells ≤ T, or sort cells and union until start and target connect. Minimax Dijkstra is the one-pass alternative.
- **Bottleneck / widest path (max-heap Dijkstra):** #15 (maximise the minimum safety) and #285 (strongest decayed power) are the mirror images of the minimax cluster.
- **Time-ordered scans:** #2 (sort trains, earliest arrival), #18 / #398 (sort events plus DSU, or a segment tree over time, an interval structure). These link to the Intervals / Sorting sections.
- **Heaps inside graph algorithms:** #67 / #353 (min-heap Kahn's), #41 (top-K by BFS layer), #49 (top-k cached per trie node).
- **Bitmask DP / state search:** #63 (subset DP over simple paths), #65 (BFS over sets of possible positions), #179 / #262 (bitset transitive closure, DP on a DAG).
- **Tree DP:** #215 (rerooting), #354 (diameter-style), #309 (incremental re-evaluation up ancestor pointers).
- **Backtracking on graphs and trees:** #388 (all shortest ladders over the BFS DAG), #275 (all path sums), #355 (word in graph), #166 part 2 (enumerate simple paths).
- **Union-Find ↔ BFS/DFS are interchangeable for static connectivity:** #90, #129, #109 / #180, #145. Prefer DSU when edges arrive online, and BFS/DFS when you also need distances or paths.
- **Matching disguised as greedy:** #444 (König: minimum vertex cover = maximum matching), #54.
- **Linked list ↔ tree:** #375 (sorted list → balanced BST through in-order simulation), #371 (tree → list in O(1) space).
- **String algorithms on a traversal:** #229 (KMP state carried across leaves), #361 (reversed trie over a stream), #91 (greedy longest match).
- **Multi-part problems that leave the family:** #124 part 1 (prefix sum + hashmap, subarrays summing to k), #312 part 1 (quickselect), #248 part 3 (sliding window), #335 part 1 (2-D block sums / prefix sums), #57 part 1 (checksum arithmetic), #17 part 2 (multiset counting).
- **Reverse-time processing:** #133 (last write wins, so go backwards with a DSU "next free" pointer). The same trick turns deletions into unions in offline connectivity problems.

## Must-do anchors (graphs & trees)
1. **#1 Count Islands in a Grid and Track the Count as Land Cells Are Added** — Grid flood fill **and** online DSU in one problem. Covers grid indexing, component counting and the running count.
2. **#131 Find the Time for Grid Signals to Reach Every Target** — Multi-source BFS with walls and the unreachable/empty edge cases. Unlocks #238 and #93.
3. **#200 Minimize maximum height along a grid path** — Dijkstra with a custom combine (`max`), plus the binary-search + BFS alternative. Unlocks #360, #185, #80 and #15.
4. **#6 Group prerequisite-linked courses into the earliest possible rounds** — Layered Kahn's algorithm with cycle detection and duplicate edges. Swap in a heap for #67 and #353.
5. **#19 Find the nearest common manager of K employees in a reporting tree** — LCA generalised to K nodes in a deep n-ary tree, done iteratively. #428 and #359 are its special cases.
6. **#354 Find the Longest Path of Equal-Valued Tree Nodes** — Post-order "return one branch, combine two at the node" (the diameter template), with stack-safe ordering.
7. **#18 Earliest Time a Friendship Network Is Fully Connected with Friend and Unfriend Events** — Sort events, then union until connected, with the deletion twist that shows where DSU stops working (#398).
8. **#388 Enumerate Every Shortest Dictionary Transformation Chain** — BFS distances, then the shortest-path DAG, then backtracking: the hardest BFS variant, which covers #156 and #41 along the way.
9. **#305 Reconstruct a Tree from Preorder and Inorder Values** — Rebuild a tree from traversals with index ranges and a value→index map. Mirrors to #373 and #518.
10. **#30 Return all binary search tree keys inside an inclusive range** — BST in-order with pruning. The same loop solves #516, #561 and #242.
11. **#49 Design autocomplete with Trie** — Trie with per-node augmentation (top-k) and mutations. Covers #284 and #154 as subsets.
12. **#251 Reverse Complete Groups of Linked Nodes** — Reverse in k-groups with a dummy head and segment reconnection. Covers #506, #418 and the sentinel cluster.
