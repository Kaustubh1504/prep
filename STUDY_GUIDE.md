# Google SWE Intern — Pattern Study Guide

373 real Google coding questions from PracHub, grouped by the concept that solves them. 254 have the original statement. 119 were locked, so their statements were reconstructed from PracHub's overview and community answers. Those are marked *(inferred)*.

**How this guide is meant to be used:** you are not trying to remember 373 solutions. You are trying to recognise about 25 patterns quickly and know how each one bends. Every pattern section gives you:

1. **Recognise it when:** the words in a problem statement that should trigger the pattern.
2. **Core idea + skeleton:** the reusable structure. You rebuild it each time; you don't memorise it.
3. **Clusters:** problems that are really the same problem. Solve the **anchor** properly. For each **variant**, practise only spotting *what changes* and *how the anchor adapts*.

---
## Contents

- [1–7. Recognition, constraints, getting unstuck, interview framework](#1-from-problem-statement-to-pattern)
- [8. Four-day plan](#8-four-day-plan)
- [NeetCode 150: hard problems](#neetcode-150-hard-problems)
- [Graphs & Trees](#graphs--trees)
  - [Graph BFS / DFS](#graph-bfs--dfs)
  - [Tree Traversal / BST](#tree-traversal--bst)
  - [Shortest Path](#shortest-path)
  - [Union-Find](#union-find)
  - [Topological Sort](#topological-sort)
  - [Trie](#trie)
  - [Linked List](#linked-list)
- [Intervals, Heaps & Design](#intervals-heaps--design)
  - [Intervals / Sweep Line](#intervals--sweep-line)
  - [Heap / Top-K](#heap--top-k)
  - [Design / Data Structure](#design--data-structure)
  - [Stack / Parsing](#stack--parsing)
  - [Monotonic Stack](#monotonic-stack)
  - [Segment Tree / Fenwick](#segment-tree--fenwick)
  - [Simulation](#simulation)
  - [Other (non-coding)](#other-non-coding)
- [Arrays & Strings](#arrays--strings)
  - [Sliding Window](#sliding-window)
  - [Two Pointers](#two-pointers)
  - [Binary Search](#binary-search)
  - [Prefix Sum](#prefix-sum)
  - [Hashing / Counting](#hashing--counting)
  - [String Processing](#string-processing)
  - [Sorting](#sorting)
- [DP, search & math](#dp-search--math)
  - [Dynamic Programming](#dynamic-programming)
  - [Backtracking](#backtracking)
  - [Greedy](#greedy)
  - [Math / Number Theory](#math--number-theory)
  - [Bit Manipulation](#bit-manipulation)
  - [Randomized / Probability](#randomized--probability)

---

## 1. From problem statement to pattern

Read the statement looking for these signals before thinking about code.

| If the problem says… | Think | First move |
|---|---|---|
| grid / cells / neighbours, "reachable", "number of regions" | Graph BFS/DFS | visited set + 4-direction loop |
| "shortest number of steps", unweighted | BFS | queue, level by level |
| weighted edges, "minimum cost/time", non-negative weights | Dijkstra | min-heap of (dist, node) |
| "minimise the maximum edge/height on a path" | Dijkstra on max, or binary search + BFS | the path cost is a max, not a sum |
| "earliest time everyone is connected", merging groups, online connectivity | Union-Find | sort events, union, track component count |
| prerequisites, dependencies, "valid order", detect cycle | Topological sort | in-degree + queue (Kahn) |
| prefix lookups, autocomplete, many words sharing starts | Trie | dict-of-children nodes |
| "minimum rooms / servers / cars at the same time" | Intervals + heap, or sweep | sort by start, min-heap of end times |
| merge / insert / overlap / free time across calendars | Interval merging | sort by start, extend or flush |
| "top k", "k-th largest", "most frequent", running median | Heap | size-k heap, or two heaps |
| "next greater / smaller", "visible people", spans | Monotonic stack | stack of indices waiting for an answer |
| longest/shortest **contiguous** subarray/substring with a condition | Sliding window | grow right, shrink left while invalid |
| sorted input, pairs/triples hitting a target, in-place rearrange | Two pointers | lo/hi moving inward, or read/write pointers |
| "subarray sum equals k" (negatives allowed), range sums | Prefix sum + hashmap | count of each prefix seen so far |
| sorted array + O(log n), or "smallest X such that it works" | Binary search | define `feasible(x)`, keep the invariant |
| "count the ways", "min/max cost to reach", overlapping choices | DP | state = what you need to know about the prefix |
| "all / every combination / permutation / arrangement", n ≤ 20 | Backtracking | choose → explore → unchoose |
| O(1) per operation, design a class/cache/iterator | Design | hashmap + a second structure (list, heap, DLL) |
| nested brackets, expressions, "evaluate", decode `3[ab]` | Stack | push on open, resolve on close |
| many range queries **with updates** | Fenwick / segment tree | point update, prefix query |

## 2. Constraints tell you the target complexity

Before coding, read the input size and work out the complexity budget. Assume about 10⁸ simple operations per second.

| Input size | Target | Usually means |
|---|---|---|
| n ≤ 10 | O(n!) | permutations, brute force |
| n ≤ 20 | O(2ⁿ · n) | bitmask DP, backtracking |
| n ≤ 500 | O(n³) | interval DP, Floyd–Warshall |
| n ≤ 5,000 | O(n²) | 2-D DP, all pairs |
| n ≤ 10⁵–10⁶ | O(n log n) or O(n) | sort, heap, window, hashing, binary search |
| values up to 10⁹–10¹⁸ | O(log V) iterations | binary search on the value / answer |
| q queries ≤ 10⁵ on static data | precompute, O(1)–O(log n) per query | prefix sums, sorting + bisect |
| q queries **with updates** | O(log n) per operation | Fenwick / segment tree, heap with lazy deletion |
| "O(1) per call" in a design problem | hashmap-based | hashmap + list index swap, or hashmap + doubly linked list |

## 3. When you're stuck (in roughly this order)

1. **Write the brute force out loud.** Then ask: what work is it repeating? That repeated work is where memoisation, a hashmap, or a sorted structure goes.
2. **Sort it.** Many interval, greedy and two-pointer problems become obvious once the input is sorted.
3. **Ask what is monotone.** If "works for X" implies "works for X+1", you can binary search the answer.
4. **Model it as a graph.** States are nodes and moves are edges. "Minimum moves" then means BFS.
5. **Reverse the process.** Removing cells is hard; adding them is Union-Find. Deleting is hard; inserting backwards is easy.
6. **Fix one dimension.** Loop over one index and solve the remaining 1-D problem with a window, heap or hashmap.
7. **Shrink the example.** Solve n = 1, 2, 3 by hand and look for the recurrence.

## 4. The 45-minute interview framework

Google interviewers score four things: communication, problem solving, coding, and verification. Practise all four, not just the solution.

| Minutes | Do | Say out loud |
|---|---|---|
| 0–5 | **Clarify.** Input size, value ranges, duplicates, empty input, output format, tie-breaking. | "Can the array be empty? Are values negative? If there's a tie, which one do you want?" |
| 5–10 | **Examples.** Work one normal and one edge case by hand. | "Let me check I understand with a small example…" |
| 10–15 | **Brute force, then optimise.** State the complexity of each. | "Naively it's O(n²) because… The repeated work is…, so I can use a… for O(n log n)." |
| 15–35 | **Code.** Use clean names and small helper functions. | Narrate the invariant: "the window always holds at most k distinct characters." |
| 35–42 | **Test by tracing.** Use your examples plus the edge cases from §5. | "Let me trace the empty case… the single-element case…" |
| 42–45 | **Complexity and follow-ups.** | "Time O(n log n), space O(n). If this were a stream, I'd…" |

You may not be able to run code in the interview. Practise in a plain editor and trace by hand.

## 5. Edge-case checklist (run through it before saying "done")

- Empty input, a single element, all elements equal
- Duplicates, and the tie-breaking rule
- Negative numbers and zero (these break sliding windows over sums; use prefix sums instead)
- Overflow, if the interviewer asks about Java or C++
- Off-by-one: inclusive vs exclusive ends, `lo < hi` vs `lo <= hi`, intervals touching at an endpoint
- Graphs: disconnected components, cycles, self-loops, an unreachable target (return −1?)
- Grids: 1×n and n×1, start equal to target, start blocked
- Trees: null root, a skewed tree (recursion depth), duplicate values
- Strings: case sensitivity, spaces, Unicode vs ASCII

## 6. How to study the clusters without memorising

- **Anchor (25–35 min):** attempt it timed. If you're stuck at 20 minutes, open the hints, then the approach. After solving, write a 3-line note in your own words: *cue → invariant → pitfall*.
- **Variants (3–5 min each):** read the statement only. Say what's different from the anchor and how your approach changes, then check the guide's **Differs** line. Code it only if your answer was wrong or vague.
- **Next morning:** rebuild the skeletons from the previous day from memory, about 2 minutes each. This is recall practice, not memorising solutions.
- **Final day:** do 2–3 timed mocks on problems you haven't seen, picked from different patterns, using the full 45-minute framework.

## 7. Inferred problems with uncertain details

These problems' statements were reconstructed with real guesswork about format or rules, mostly multi-part questions or ones with very short overviews. Use them to practise the concept. Don't trust the exact I/O, and don't be surprised if the real interview version differs.

- **Multi-part, with the parts guessed from a one-line overview:** #99, #110, #124, #170, #209, #234, #236, #263, #313, #335, #489
- **Input format or rules assumed:** #44, #54, #57, #63, #67, #69, #93, #126, #142, #143, #166, #167, #207, #239, #258, #260, #264, #280, #281, #285, #289, #309, #310, #317, #328, #329, #337, #398, #403, #484, #495
- **Interpretation choice that changes the problem:** #90 (undirected relation), #182 (direction rules), #185 (max cell value vs max height difference), #198 (cake shape), #210 (rule for which keys jam), #214 (daily recurrence), #218 (positive squares only), #265 (objective), #266 (circular day), #338 (meaning of "single modification"), #444 (full row/column boards → bipartite cover)
- **Near-duplicates deliberately made different:** #134 vs #82, #290 vs #261, #320 vs #487, #363 (Part 2 added)

---

## 8. Four-day plan

Each day: solve the **core anchors** timed, using §6. Then do the variant drills for each anchor's cluster: read the statement, say what's different, check the **Differs** line. Work on the **if time** anchors only after that. The section links below jump to each family's clusters.

| Day | Focus | Core anchors (solve properly) | If time |
|---|---|---|---|
| 1 | [Graphs & trees](#graphs--trees) | #1 islands + online DSU · #131 multi-source BFS · #200 minimise max height (Dijkstra / binary search + BFS) · #6 layered topological sort · #18 earliest full connectivity · #19 LCA of K nodes · #354 tree "diameter" template · #30 BST range | #305 rebuild tree from traversals · #49 autocomplete trie · #251 reverse k-group · #388 word ladder II |
| 2 | [Intervals, heaps & design](#intervals-heaps--design) | #35 min rooms · #240 rooms with delays · #45 min fleet + assignment · #214 cyclic tasks · #202 merge + complement gaps · #356 top-K frequent · #216 running median · #144 LRU cache · #13 next greater (circular) | #108 sweep emitting segments · #231 expression parsing · #52 weighted interval scheduling |
| 3 | [Arrays & strings](#arrays--strings) | #11 longest window · #268 minimum covering window · #139 lower/upper bound · #92 binary search on the answer · #473 prefix sum + first-seen map · #51 k-sum with two pointers · #26 window mean without top-k · #378 rotated minimum | #42 2-D difference array · #204 directional token transform · #255 linear-time consecutive run · #273 number validation |
| 4 | [DP & backtracking](#dp-search--math) + mocks | #20 coins +3 (asked 4×) · #73 one-replacement run · #459 circular take/skip · #412 decode ways · #507 largest square · #60 regex DP · #85 / #253 combination sum | #95 knapsack · #430 memoised DFS on a grid · #508 burst balloons · #296 N-queens · #377 bit counting. **Evening:** 2 timed 45-minute mocks on problems you haven't seen, from different families. |
| Interview morning | Warm-up | Rebuild 6 skeletons from memory (BFS, DSU, Dijkstra, sliding window, binary search on answer, memo DP), then one easy problem out loud | — |

**Fewer than 4 days?** Take the first 4–5 core anchors from each day. Merge Days 1 and 2 into one day and Days 3 and 4 into another, and keep the evening mocks.

**Weighting:** graphs and intervals are the most common families in this Google data, and intervals have the most near-duplicate variants. If you're short on time, protect Days 1 and 2.

### Gap fillers

The four-day plan concentrates on the highest-value families, which leaves out a few basics, plus Greedy, Math, Simulation and Sorting entirely. These are quick anchors, 15–20 minutes each, with variant drills as usual. Spread the quick set across Days 1–3 (2–3 a day, alongside that day's family) and do the rest on the morning of Day 4.

| Set | Focus | Quick anchors | If time |
|---|---|---|---|
| Gap fillers | Basics the four-day plan skips | #17 flood fill · #346 level-order BFS · #249 bracket matching · #130 BFS with forbidden nodes · #36 log processing with per-key state · #23 digit peeling · #414 one-pass stock trading · #477 sort, then scan | #463 min-stack / queue adaptors · #220 k-th largest under inserts · #67 smallest topological order · #422 sentinel deletion · #326 tokenise and rebuild strings · #272 grid path counting · #455 partition backtracking |

With the gap fillers, the plan reaches 25 of the 27 coding patterns and 63 of the 97 clusters. The two patterns left out are Segment Tree / Fenwick and Randomized: 4 problems between them, rare at intern level. Most of the remaining unvisited clusters are small and easy, and blind practice will show them to you.

---

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

---

# Intervals, Heaps & Design

Patterns in this section: Intervals / Sweep Line · Heap / Top-K · Design / Data Structure · Stack / Parsing · Monotonic Stack · Segment Tree / Fenwick · Simulation · Other (non-coding).

---

## Intervals / Sweep Line

**Recognise it when:**
- "minimum number of rooms / servers / cars / vehicles needed", "max meetings at once" → peak concurrency: +1/−1 sweep, or sort by start + min-heap of end times.
- "assign each meeting/request to a numbered room/car, lowest free number first" → two heaps: `free` ids and `busy` (end, id).
- "n rooms only; if none free, delay / reject" → same two heaps, plus a branch for "none free".
- "merge / union / free time / gaps / safe intervals / intersect two lists" → sort by start and merge with a running `cur_end`; gaps are the complement.
- "for every period, report who/how many are active" (exactly X at once, on-call timeline, skyline) → event sweep that outputs a segment between consecutive event times.
- "choose non-overlapping intervals to maximise profit / cover a range with fewest" → sort by end (DP + binary search) or by start (greedy reach).

**Core idea:** Only endpoints matter, because the set of active intervals only changes at a start or an end. Sort the endpoints and walk through them in time order, keeping a small amount of state: a counter, a heap of end times, or the end of the last merged block. Peak concurrency is a lower bound on resources, and greedily reusing any resource that is already free reaches it. That is why "min rooms" equals "max overlap".

**Skeleton:**
```python
# (a) Peak concurrency, half-open [s, e): ends sort before starts at equal t
events = [(s, +1) for s, e in iv] + [(e, -1) for s, e in iv]
events.sort()                      # (t, -1) < (t, +1)  -> touching intervals do not overlap
cur = best = 0
for t, d in events:
    cur += d; best = max(best, cur)

# (b) Resource assignment: lowest free id, busy keyed by release time
free, busy = list(range(n)), []    # free: min-heap of ids; busy: (end, id)
for s, e in sorted(iv):
    while busy and busy[0][0] <= s:
        heapq.heappush(free, heapq.heappop(busy)[1])
    if free: rid = heapq.heappop(free); heapq.heappush(busy, (e, rid))
    else:    ...                   # open new id / delay to busy[0] / reject (variant-specific)
```

**Pitfalls:**
- Tie order at equal timestamps: half-open `[s, e)` means process the end before the start (a car returned at t can go out at t). Closed `[a, b]` means touching intervals overlap or merge, so `<=` becomes `<`.
- After a delay, the meeting keeps its **duration** and starts at the room's free time: new end = `free_at + (e − s)`, not the original `e`.
- With two heaps, release **every** busy resource with `end <= start` before choosing one. Popping only the earliest one picks the wrong "lowest id".
- Wrap-around (circular day, midnight) and identity rules (same `job_id` shares a server) must be normalised **before** the sweep, not patched inside it.

### Room / car variant decoder (read this first)

| Variant | Resources | If none free | Return | Structure |
|---|---|---|---|---|
| Min rooms / servers | unlimited | open a new one | count | +1/−1 sweep or min-heap of ends |
| Min fleet + assignment | unlimited, numbered | open id `size` | count + id per request | `free` id heap + `busy` (end,id) heap |
| n rooms, delay | fixed n | wait for earliest `busy[0]`, keep duration | most-booked room (+ per-meeting room) | same two heaps + `count[]` |
| n cars, reject | fixed n | drop the request | most-used car | same two heaps, no delay branch |
| Circular day | unlimited | open new | count | split wrapping `[s, e)` into `[s, DAY)` + `[0, e)` then (a) |
| Same `job_id` overlaps | unlimited | open new | count | merge intervals per id first, then (a) |

### Clusters

#### Min rooms (peak concurrency): the base problem. Min resources = max number of intervals alive at one instant
- **Anchor:** [#35 Minimum Number of Rooms to Schedule Overlapping Meetings](problems/035-minimum-number-of-rooms-to-schedule-overlapping-meetings.md). Full statement, explicit half-open semantics, duplicates and back-to-back meetings, n up to 1e5. Solve it both ways (two sorted arrays, and the event sweep) so you own the tie rule.
- **Variants:**
  - [#31 Find Minimum Rooms Needed](problems/031-find-minimum-rooms-needed.md) *(inferred)*. **Differs:** nothing material. Same answer via separate sorted start and end arrays and an end pointer. **Near-duplicate of #35.**
  - [#100 Compute minimum rooms for time intervals](problems/100-compute-minimum-rooms-for-time-intervals.md). **Differs:** same as #35, hint uses the two-sorted-arrays form. **Near-duplicate of #35.**
  - [#101 Compute minimum number of rooms needed](problems/101-compute-minimum-number-of-rooms-needed.md). **Differs:** framed as start/end events. Here you must state "end before start at equal time". **Near-duplicate of #35.**
  - [#337 Solve meeting-room scheduling and shortest paths](problems/337-solve-meeting-room-scheduling-and-shortest-paths.md) *(inferred)*. **Differs:** Part 1 is #35 solved with a min-heap of end times. Part 2 is plain Dijkstra (→ really Graph). **Near-duplicate of #35** (Part 1).
  - [#263 Implement text wrapping, waitlist, and intervals](problems/263-implement-text-wrapping-waitlist-and-intervals.md) *(inferred)*. **Differs:** Part 3 is #35. Part 1 is greedy word wrap (split words longer than the width). Part 2 is a waitlist with O(1) join/leave/serve (hash map + doubly linked list), with a Fenwick tree for `position` (see #16). **Near-duplicate of #35** (Part 3).

#### Min rooms with a pre-processing twist: normalise the intervals, then run the base sweep
- **Anchor:** [#214 Compute minimum servers for cyclic tasks](problems/214-compute-minimum-servers-for-cyclic-tasks.md) *(inferred)*. Wrapping tasks (`e > 1440`) are split into `[s, 1440)` and `[0, e − 1440)`. After that it is #35 unchanged.
- **Variants:**
  - [#266 Compute minimum meeting rooms on circular day](problems/266-compute-minimum-meeting-rooms-on-circular-day.md) *(inferred)*. **Differs:** same circular split, written as `[start, day)` + `[0, end)`. Drop the empty piece when `end == 0`. **Near-duplicate of #214.**
  - [#68 Compute servers needed for daily recurring jobs](problems/068-compute-servers-needed-for-daily-recurring-jobs.md). **Differs:** need is per distinct active `job_id`, not per interval, so first merge the overlapping intervals of each job_id. Past-midnight parts are *truncated*, not wrapped. **Same concept, different setting.**

#### Min fleet + deterministic assignment: unlimited numbered resources; reuse the lowest free id, open a new id only when forced
- **Anchor:** [#45 Assign the Minimum Fleet to Rental Reservations](problems/045-assign-the-minimum-fleet-to-rental-reservations.md) *(inferred)*. Cleanest statement: sort by `(pickup, return, id)`, return `(fleet_size, assignment)`. The fleet size equals peak concurrency, and ids come from the `free` heap.
- **Variants:**
  - [#328 Minimum Cars for Rental Requests](problems/328-minimum-cars-for-rental-requests.md) *(inferred)*. **Differs:** ties broken by `request_id` string order, cars numbered from 0. Same two heaps. **Near-duplicate of #45.**
  - [#313 Solve Shortest Paths and Rental Allocation](problems/313-solve-shortest-paths-and-rental-allocation.md) *(inferred)*. **Differs:** Part 2 is #45 with ties `(start, end, input index)` and output in input order. Part 1 is shortest path through a required node: Dijkstra from src and from via (→ really Graph). **Near-duplicate of #45** (Part 2).
  - [#89 Solve chat, grid paths, and car rentals](problems/089-solve-chat-grid-paths-and-car-rentals.md). **Differs:** Q3 is #45 (min cars + assignment). Q1 is top-K most active chat users (count + heap, like #356). Q2 is grid path counting with DP. **Near-duplicate of #45** (Q3).

#### Fixed n resources, lowest-id free, what to do when none is free: two heaps plus a per-resource counter
- **Anchor:** [#240 Assign meetings to rooms with delays](problems/240-assign-meetings-to-rooms-with-delays.md) *(inferred)*. The canonical "Meeting Rooms III". Free rooms sit in an id heap and busy rooms in an `(end, id)` heap. If none is free, pop `busy[0]` and run the meeting from `end` to `end + duration`. Return the most-booked room (lowest id on ties).
- **Variants:**
  - [#487 Simulate meeting-room bookings and return busiest room](problems/487-simulate-meeting-room-bookings-and-return-busiest-room.md) *(inferred)*. **Differs:** identical rules and return value. **Near-duplicate of #240.**
  - [#320 Simulate room assignments for scheduled meetings](problems/320-simulate-room-assignments-for-scheduled-meetings.md) *(inferred)*. **Differs:** also returns `assignments[i]` (the room for each meeting in input order), so carry the original index through the sort. **Follow-up of #240.**
  - [#258 Busiest Rental Car](problems/258-busiest-rental-car.md) *(inferred)*. **Differs:** if no car is free the request is **rejected**, not delayed. Drop the delay branch, keep release + smallest free id + count. Requests are sorted by `(pickup, return, index)`. **Same concept, different setting.**
  - [#257 Schedule Priority Jobs with Cooldowns](problems/257-schedule-priority-jobs-with-cooldowns.md) *(inferred)*. **Differs:** same "ready heap + waiting heap keyed by when eligible" shape, but time is the *call counter*. The ready heap is ordered by `(-priority, insertion_seq)`, and a job goes back to waiting with `eligible_at = t + cooldown`. **Same concept, different setting** (two-heap release-then-pick).
  - Also see **#99 Solve Rooms and Top-K Streams** in Heap (its Part 1 is #240 again).

#### Merge / union / complement / intersection: sort by start, keep the end of the current block, emit blocks or gaps
- **Anchor:** [#202 Find safe travel intervals between planet influences](problems/202-find-safe-travel-intervals-between-planet-influences.md). Full statement. Turn each planet into `[c − r, c + r]`, sort, merge overlapping *and touching* blocks, and output the gaps, including the unbounded ones on both sides. This covers merge and complement in one problem.
- **Variants:**
  - [#307 Find Common Free Time Slots Across Calendars](problems/307-find-common-free-time-slots-across-calendars.md) *(inferred)*. **Differs:** busy intervals come from many calendars. Clip them to `[day_start, day_end)`, take the union, and the answer is the gaps. Half-open, so touching does not create a gap. **Same concept, different setting.**
  - [#141 Compute the Union of Two Sorted Interval Lists](problems/141-compute-the-union-of-two-sorted-interval-lists.md) *(inferred)*. **Differs:** the input is two already-sorted lists, so do the merge step of merge sort (two pointers) instead of sorting, keeping O(n + m). Closed intervals, so `s <= last_end` merges. **Same concept, different setting.**
  - [#74 Solve three coding problems](problems/074-solve-three-coding-problems.md). **Differs:** Part 3 is the *intersection* of two sorted disjoint lists. Two pointers, overlap = `[max(starts), min(ends)]`, advance the pointer whose interval ends first. Part 1 is the N-th license plate (index arithmetic: 1000 suffixes per prefix). Part 2 is counting Android unlock patterns (backtracking with a skip table). **Same concept, different setting** (Part 3).
  - [#105 Check an Interval Against Existing Intervals for Conflicts](problems/105-check-an-interval-against-existing-intervals-for-conflicts.md) *(inferred)*. **Differs:** a single query against unsorted data, so a linear `a < end and start < b` scan beats sorting. The follow-up (many queries) is to merge once and then binary search. **Same concept, different setting.**
  - [#260 Find Containing Range](problems/260-find-containing-range.md) *(inferred)*. **Differs:** ranges are disjoint, so after sorting by start the ends are sorted too. For each query, bisect for the last start `<= a` and check that its end is `>= b`. **Follow-up of #105** (preprocess for many queries).
  - [#464 Cover Sorted Unique Integers with Minimal Exact Ranges](problems/464-cover-sorted-unique-integers-with-minimal-exact-ranges.md). **Differs:** builds maximal ranges from sorted unique ints (break when `next != prev + 1`, beware overflow). → really Array scan. **Same concept, different setting.**

#### Sweep that outputs segments: between consecutive event times the active set is constant, so emit `[t_i, t_{i+1})` with that state
- **Anchor:** [#108 Intervals with Exactly X Concurrent Meetings](problems/108-intervals-with-exactly-x-concurrent-meetings.md) *(inferred)*. Group the deltas by distinct time. After applying all deltas at `t_i`, the count holds on `[t_i, t_{i+1})`. Emit when count == X, and merge with the previous output segment if adjacent.
- **Variants:**
  - [#167 Consolidate On-Call Rotation Segments](problems/167-consolidate-on-call-rotation-segments.md) *(inferred)*. **Differs:** the state is a multiset (Counter) of *names*, not a count, because one person can have overlapping segments. Emit `(start, end, sorted names)`, merge adjacent segments with the same set, and ignore empty segments. **Same concept, different setting.**
  - [#339 Compute city skyline outline](problems/339-compute-city-skyline-outline.md). **Differs:** the state is the *max* active height, so keep a max-heap with lazy deletion (pop entries whose right edge `<= x`). Emit a key point only when the max changes. Tie order at equal x matters: starts taller-first, ends before starts. **Follow-up of #108** (sweep + heap).

#### Selecting intervals: choose a subset under non-overlap or coverage
- **Anchor:** [#52 Choose Non-Overlapping Weighted Jobs to Maximize Total Profit](problems/052-choose-non-overlapping-weighted-jobs-to-maximize-total-profit.md). Weighted job scheduling: sort by end, `best[i] = max(best[i−1], p_i + best[j])`, where j is the last job ending `<= s_i` (found by bisect). This is the go-to "can't just count overlaps" problem.
- **Variants:**
  - [#209 Solve Three Array and Matrix Path Problems](problems/209-solve-three-array-and-matrix-path-problems.md) *(inferred)*. **Differs:** Part 2 is *fewest intervals covering `[left, right]`*. Sort by start, and each step extends the reach as far as possible among intervals starting `<= reach` (jump-game greedy, touching counts as covered). Part 1 is longest relaxed-descent path in a grid (memoised DFS on state `(cell, prev)`). Part 3 is Kadane. **Same concept, different setting** (Part 2).

### Other Intervals / Sweep Line problems
- [#333 Min deletions to avoid overlap in first k](problems/333-min-deletions-to-avoid-overlap-in-first-k.md) *(inferred)*. Delete values from `list2` so its first k share nothing with `list1[:k]`. Hash set of forbidden values plus one greedy scan. → really Hashing / Greedy.
- [#376 Maximize Profit with at Most Two Chronological Trades](problems/376-maximize-profit-with-at-most-two-chronological-trades.md). At most two non-overlapping stock trades, solved with a 4-state DP (buy1, sell1, buy2, sell2). → really Dynamic Programming.
- [#437 Compute Two-Rectangle Coverage from Eight Coordinates](problems/437-compute-two-rectangle-coverage-from-eight-coordinates.md). Union area of two rectangles = A + B − overlap, where overlap per axis is `max(0, min(e1, e2) − max(s1, s2))`. Same 1-D overlap formula as #105. → really Math / Geometry.

---

## Heap / Top-K

**Recognise it when:**
- "top k / k most frequent / k largest / k-th largest" (often with "stream", "live", "after each insert").
- "running median", "median after each number".
- "k smallest pairs/sums", "k largest subset sums": too many candidates to list, but each one has a few obvious "next" candidates (best-first frontier).
- "repeatedly pick the best option among those currently eligible" (capital, cooldown, free rooms) → heap of eligible items, fed from a sorted or waiting list.
- "median / k-th of several sorted arrays" → order statistic by value binary search or by merging, without materialising.

**Core idea:** A heap gives the current best in O(1) and an update in O(log n), with no full sort. For top-k over n items, keep a **size-k min-heap** (its root is the weakest survivor), giving O(n log k). For a median, two heaps split the data into a lower and an upper half whose tops are the middle elements. For a huge implicit candidate set, start from the best candidate and push only its successors when it is popped.

**Skeleton:**
```python
cnt = Counter(items)                      # top-k by frequency, ties by key
h = []
for key, c in cnt.items():
    heapq.heappush(h, (c, Neg(key)))      # weakest at root; Neg flips tie order
    if len(h) > k: heapq.heappop(h)
# or: heapq.nsmallest(k, cnt.items(), key=lambda kv: (-kv[1], kv[0]))

lo, hi = [], []                           # running median: lo = max-heap (negated)
def add(x):
    heapq.heappush(lo, -x); heapq.heappush(hi, -heapq.heappop(lo))
    if len(hi) > len(lo): heapq.heappush(lo, -heapq.heappop(hi))
```

**Pitfalls:**
- Tie-breaking inside a size-k *min*-heap is inverted: to keep the lexicographically smaller word on ties, the root must hold the *larger* word. `nsmallest` with key `(-count, word)` avoids the trap.
- Python only has min-heaps: negate numbers for a max-heap. Strings cannot be negated, so wrap them or use `nsmallest`.
- Streams with deletes or updates: use lazy deletion (skip stale entries on pop) instead of trying to remove from the middle of the heap.
- Even-count median: average the two tops exactly. Use `2*median` or integer/Fraction arithmetic when the spec says so (#216).

### Clusters

#### Top-K by frequency: count with a hash map, then select with sort / size-k heap / nsmallest
- **Anchor:** [#356 Return the Most Frequent Values in an Array](problems/356-return-the-most-frequent-values-in-an-array.md). Full statement, the plain "most frequent values" form. Count, then select k with a deterministic tie rule.
- **Variants:**
  - [#125 Find top/bottom-k words in list or stream](problems/125-find-top-bottom-k-words-in-list-or-stream.md). **Differs:** top-k *and* bottom-k (two orderings of the same counts), plus a streaming version where counts change. **Follow-up of #356.**
  - [#280 Most Active Users in a Live Communication Stream](problems/280-most-active-users-in-a-live-communication-stream.md) *(inferred)*. **Differs:** dedupe by `message_id` first, and a message counts once for each of `{sender, receiver}` (a set, so self-messages count once). A live `record` is O(1) and `top_k` uses `nsmallest`. **Same concept, different setting.**
  - [#44 Design a logger that returns top-K messages](problems/044-design-a-logger-that-returns-top-k-messages.md) *(inferred)*. **Differs:** queries over a time range `[start, end]`. Logs are time-sorted, so bisect the slice, count inside it, and take the top k with `(-count, message)`. **Follow-up of #356** (range-restricted).
  - [#50 Implement frequency + distance top‑K queries](problems/050-implement-frequency-plus-distance-top-k-queries.md). **Differs:** a multi-criteria key `(-freq, distance, x, y)` for points. Part 2 is a time-keyed store that returns the value at the nearest timestamp `<= t` (bisect). **Same concept, different setting.**
  - [#99 Solve Rooms and Top-K Streams](problems/099-solve-rooms-and-top-k-streams.md) *(inferred)*. **Differs:** Part 2 is streaming top-K words (counts hash map + bounded heap on each `top()`). Part 1 is most-booked meeting room, a **near-duplicate of #240** (Intervals). **Follow-up of #356** (Part 2).

#### Running median: two balanced heaps
- **Anchor:** [#216 Track the Running Median of an Integer Stream](problems/216-track-the-running-median-of-an-integer-stream.md). Full statement, outputs `2*median` to avoid floats. Invariant: `max(lo) <= min(hi)` and `len(lo) − len(hi)` is 0 or 1.
- **Variants:**
  - [#292 Maintain streaming median and loosemedian](problems/292-maintain-streaming-median-and-loosemedian.md). **Differs:** same two heaps, and the even-count median can be non-integer (3.5). Adds a "loose median" query that accepts any value between the two middle elements. **Near-duplicate of #216.**

#### k-th largest under inserts: size-k min-heap, root = answer
- **Anchor:** [#220 Maintain k-th largest in a stream](problems/220-maintain-k-th-largest-in-a-stream.md). Classic `KthLargest(k, nums).add(x)`. Push, pop while size > k, return the root. Duplicates count as separate elements.
- **Variants:**
  - [#443 Find top-k distinct elements](problems/443-find-top-k-distinct-elements.md) *(inferred)*. **Differs:** *distinct* values only. Keep a set of the values in the heap and skip duplicates. A value evicted from the heap may legitimately come back later. **Follow-up of #220.**
  - Also see **#264 Design structure for insert and k-th largest** in Design (k is a per-query argument, so a heap no longer works; use an order-statistic tree).

#### Order statistics across sorted inputs: find the median without merging everything
- **Anchor:** [#5 Median of All Values Across Several Sorted Integer Arrays](problems/005-median-of-all-values-across-several-sorted-integer-arrays.md). Full statement, k sorted arrays. Binary search on the *value* v: count the elements `<= v` with bisect in each array, giving O(k log(range) log n). A k-way heap merge up to rank N/2 is the simpler fallback.
- **Variants:**
  - [#364 Find median of merged RLE arrays](problems/364-find-median-of-merged-rle-arrays.md) *(inferred)*. **Differs:** the arrays are run-length encoded with huge frequencies. Two-pointer merge of the *runs*, tracking positions `[seen, seen + freq)` until you reach the runs holding ranks `(N−1)//2` and `N//2`. **Same concept, different setting.**

#### Best-first frontier: pop the current best, push only its successors
- **Anchor:** [#217 Find k pairs with smallest sums](problems/217-find-k-pairs-with-smallest-sums.md). k smallest pair sums from two sorted arrays. Seed `(a[i] + b[0], i, 0)` for each i, and after popping `(i, j)` push `(i, j + 1)`. Each pair is generated at most once.
- **Variants:**
  - [#158 Return top-k subset sums in descending order](problems/158-return-top-k-subset-sums-in-descending-order.md) *(inferred)*. **Differs:** the k largest subset sums = `best − (k smallest "loss" sums)` over sorted `|nums|`. Frontier moves from (sum, i): *add* `a[i+1]` or *replace* `a[i]` with `a[i+1]`, so every subset is reached once. **Same concept, different setting.**

### Other Heap / Top-K problems
- [#279 Grow Capital by Selecting Affordable Projects](problems/279-grow-capital-by-selecting-affordable-projects.md). IPO: sort projects by required capital. Each round, push every newly affordable project's profit into a max-heap and take the top, up to k times. Pattern: "unlock by sorted threshold, choose by heap".

---

## Design / Data Structure

**Recognise it when:**
- "implement class X with methods …, each in O(1) / O(log n)": you need two structures, one for lookup and one for order.
- "least recently used / evict", "random element uniformly", "undo/redo", "min at any time".
- "implement a stack using queues / a queue using stacks", "iterator that merges/filters".
- "game engine: board, turns, win check" → only the last move can create a win.
- "training phase, then queries" → move work into preprocessing (precompute the best answer per key).

**Core idea:** Write down every operation and its target complexity, then compose structures so that each operation touches only the cheap part. Typical pairs: a hash map for "find by key" plus a doubly linked list, array, heap, or sorted list for "find by order/rank/recency". The hash map often stores a pointer or index into the second structure so both stay in sync. State the invariant linking them and keep it true on every mutating method.

**Skeleton:**
```python
class Composite:
    def __init__(self):
        self.pos = {}            # key -> index/node in self.order (lookup side)
        self.order = []          # list / DLL / heap / SortedList (ordering side)
    def add(self, key):
        if key in self.pos: return False
        self.pos[key] = len(self.order); self.order.append(key); return True
    def remove(self, key):       # O(1) array delete: swap with last, fix index, pop
        i = self.pos.pop(key); last = self.order.pop()
        if i < len(self.order): self.order[i] = last; self.pos[last] = i
```

**Pitfalls:**
- Forgetting to update **both** structures on every path (evict, overwrite, delete-last-element case).
- Validation order in game/API classes: check everything (game over → turn → bounds → occupied) *before* mutating state, or a rejected move corrupts the board.
- Two-stack queue: move items from `in` to `out` **only when `out` is empty**, otherwise you break FIFO order. Amortised O(1), not worst-case.
- Tie rules (first-seen index, lowest id, lexicographic) are part of the spec. Encode them in the key from the start.

### Clusters

#### Next-word predictor: nested counts, precompute the argmax per word for O(1) queries
- **Anchor:** [#22 Predict the Most Frequent Next Word in Constant Time](problems/022-predict-the-most-frequent-next-word-in-constant-time.md) *(inferred)*. Store `word → {next: [freq, first_seen]}`. After training, keep each word's best successor (ties by smallest first-seen index), so `predict` is a single dictionary lookup.
- **Variants:**
  - [#196 Build a next-word frequency predictor](problems/196-build-a-next-word-frequency-predictor.md) *(inferred)*. **Differs:** built from sentences split on whitespace, and ties are broken lexicographically with the key `(-count, next)`. **Near-duplicate of #22.**

#### Tic-tac-toe, K players: check only lines through the latest move
- **Anchor:** [#46 Design Tic-Tac-Toe With K Players](problems/046-design-tic-tac-toe-with-k-players.md). Full statement. Store occupied cells in a dict keyed by `(r, c)` so huge boards stay cheap, and scan the 4 directions from the new mark.
- **Variants:**
  - [#478 Implement Multi-Player Tic-Tac-Toe](problems/478-implement-multi-player-tic-tac-toe.md) *(inferred)*. **Differs:** a fixed 3-in-a-row win on a configurable board, strict status codes for invalid moves, and `undo` through a move-history stack. **Near-duplicate of #46** (with undo).

#### Stack / queue adaptors and augmented stacks: get a new behaviour from a simple container plus extra state
- **Anchor:** [#463 Implement FIFO Operations with Two Stacks](problems/463-implement-fifo-operations-with-two-stacks.md). Queue with two stacks: push to `in`, and pop/peek from `out`, refilling it from `in` only when `out` is empty. This is the cleanest amortised-analysis question.
- **Variants:**
  - [#390 Maintain LIFO Behavior Using Only FIFO Queue Operations](problems/390-maintain-lifo-behavior-using-only-fifo-queue-operations.md). **Differs:** the mirror problem, a stack from queues. Rotate the queue after each push so the newest element sits at the front (one-queue version), or swap two queues. **Same concept, different setting.**
  - [#276 Maintain Stack Values and Historical Prefix Minima](problems/276-maintain-stack-values-and-historical-prefix-minima.md). **Differs:** min-stack. Store `(value, min_so_far)` per entry so `getMin` is O(1) after pops. **Same concept, different setting.**
  - [#334 Implement Batched Undo/Redo Layer](problems/334-implement-batched-undo-redo-layer.md). **Differs:** undo/redo with batches. Two stacks of batches, record a key's old value only on its *first* edit within a batch, and clear redo on a new commit. **Same concept, different setting.**

#### Hash map + ordering structure for O(1)-ish ops: lookup side and order side kept in sync
- **Anchor:** [#144 Implement an LRU cache](problems/144-implement-an-lru-cache-9.md). LRU: hash map key → DLL node, with sentinel head/tail. `get` moves the node to the front and `put` evicts the tail.
- **Variants:**
  - [#287 Design set with O(1) random access](problems/287-design-set-with-o-1-random-access.md). **Differs:** uniform `getRandom` needs an *array* for the order side. Delete by swapping with the last element and fixing that element's index in the map. **Same concept, different setting.**
  - [#69 Implement a Reusable Locker Allocation System](problems/069-implement-a-reusable-locker-allocation-system-2.md) *(inferred)*. **Differs:** the order side is a min-heap of free locker numbers (lowest available), plus two maps (`package → locker`, `locker → package`). The same "lowest free id" heap as the room problems (#240). **Same concept, different setting.**

#### Merging multiple sequences behind an API: k-way / round-robin pulling from iterators or queues
- **Anchor:** [#514 Implement Posting and Follow-Based Recent Tweet Feeds](problems/514-implement-posting-and-follow-based-recent-tweet-feeds.md). Full statement. Twitter feed: per-user tweet lists with a global timestamp, `getNewsFeed` does a k-way heap merge of the followees' latest tweets and stops at 10.
- **Variants:**
  - [#495 Implement iterator merging lists with filtering](problems/495-implement-iterator-merging-lists-with-filtering.md) *(inferred)*. **Differs:** round-robin instead of by-time. A deque of iterators, pull one element per turn, drop exhausted iterators, and skip blocked or already-`seen` ids without spending an extra turn. **Same concept, different setting.**
  - [#484 Find Shortest Queue with Few Calls](problems/484-find-shortest-queue-with-few-calls.md) *(inferred)*. **Differs:** only `is_empty()` / `poll()` are available. Poll all queues in lock-step rounds, and the first one empty in round d is the shortest. Minimises API calls. **Same concept, different setting.**

#### Ordered multiset under streaming inserts: sorted container / count-augmented tree for neighbour or rank queries
- **Anchor:** [#329 Streaming Points: Remove Any Pair Within a Distance](problems/329-streaming-points-remove-any-pair-within-a-distance.md) *(inferred)*. Keep unpaired points in a sorted list. The nearest point is the predecessor or the successor (bisect), compared against `d + EPS`.
- **Variants:**
  - [#264 Design structure for insert and k-th largest](problems/264-design-structure-for-insert-and-k-th-largest.md) *(inferred)*. **Differs:** a rank query (k-th largest with arbitrary k per call) instead of a neighbour query. Use a sparse segment tree or BIT over the value range with counts, and descend by counts (or use SortedList indexing). **Same concept, different setting.**

### Other Design / Data Structure problems
- [#319 Design a rolling hit counter API](problems/319-design-a-rolling-hit-counter-api.md) *(inferred)*. Rolling 5-minute hit counter: a deque of `[second, count]` buckets plus a running total, and expire buckets `<= t − 300` before each operation.
- [#213 Simulate an In-Memory Directory Tree with mkdir, ls, Append and Read](problems/213-simulate-an-in-memory-directory-tree-with-mkdir-ls-append-and-read.md). In-memory file system: a trie of dicts (dir → children, file → content). Parse the path, create missing directories, `ls` returns sorted names (a file path returns just that file).
- [#405 Design compressed vector and compute dot product](problems/405-design-compressed-vector-and-compute-dot-product.md) *(inferred)*. Compressed (RLE) vector dot product: two pointers over runs, consuming `min(remaining_a, remaining_b)` per step. The same run-walking as #364.
- [#244 Design server allocation for multi-type nodes](problems/244-design-server-allocation-for-multi-type-nodes.md). A collection of system-design prompts (task scheduler, message queue, code-notebook execution, CDC import into NoSQL). Focus on API design, storage and failure handling. → really System Design (non-coding).
- [#541 Reshape a Matrix while Preserving Row Order](problems/541-reshape-a-matrix-while-preserving-row-order.md). Reshape a matrix: map flat index `k → (k // c, k % c)`, and return the original if `r*c` does not match. → really Array / index math.
- [#554 Choose Three Values with the Largest Product](problems/554-choose-three-values-with-the-largest-product.md). Max product of three: the answer is `max(top3 product, top1 × two most negative)`, found in one pass or by sorting. → really Sorting / Greedy.

---

## Stack / Parsing

**Recognise it when:**
- "nested", "brackets", "parentheses", "depth", "decode `k[...]`", "expression like `add(1, mult(2,3))`".
- "postfix / RPN", "evaluate", "let / variable scope".
- "call stack logs `id:start:t`/`id:end:t`" → the stack of currently running functions.
- Recursion would work, but "nesting up to 1e5" → explicit stack to avoid recursion limits.

**Core idea:** Nesting is last-opened, first-closed, which is exactly LIFO. On an opener, push the context you are leaving (partial string, repeat count, current depth, the operator with the arguments gathered so far). On a closer, pop it and combine the finished inner result into it. Recursive descent is the same algorithm with the call stack doing the pushing. Pass a shared index so each character is read once.

**Skeleton:**
```python
stack, cur, num = [], [], 0          # generic "open/close" frame stack
for ch in s:
    if ch.isdigit():   num = num * 10 + int(ch)
    elif ch in '([{':  stack.append((cur, num)); cur, num = [], 0
    elif ch in ')]}':
        prev, k = stack.pop()
        cur = combine(prev, cur, k)  # e.g. prev + cur*k, or apply(op, args)
    else:              cur.append(ch)   # token / separator handling
```

**Pitfalls:**
- Multi-digit and negative numbers: flush the number when the first non-digit arrives, and remember to flush at end of input.
- Integer division "truncating toward zero" in Python is `int(a / b)` (or a sign-aware `//`), not `a // b`.
- Scopes (`let`): push a copy or a chained dict per scope, and pop it on close. Inner bindings shadow outer ones and must not leak out.
- Exclusive-time logs: the end timestamp is *inclusive* (`end − start + 1`). When a child starts, credit the parent up to `t − 1`.

### Clusters

#### Depth-weighted nested sum: track depth while traversing nesting
- **Anchor:** [#303 Compute a Depth-Weighted Sum of a Nested List](problems/303-compute-a-depth-weighted-sum-of-a-nested-list.md) *(inferred)*. Given as a nested list. Recursive `depth + 1`, then an iterative version with an explicit stack of `(sublist, depth)` for deep inputs.
- **Variants:**
  - [#178 Parse a Nested-List String and Compute Its Weighted Sum](problems/178-parse-a-nested-list-string-and-compute-its-weighted-sum.md) *(inferred)*. **Differs:** the input is a *string*, so no stack is needed, only a depth counter. Build numbers digit by digit and add `num × depth` at the first non-digit. **Same concept, different setting.**

#### Evaluate nested expressions: recursive descent, or an explicit stack of (op, args) frames
- **Anchor:** [#231 Solve Two Coding Interview Problems](problems/231-solve-two-coding-interview-problems.md). Full statement. Problem 1: `op(expr, expr)` grammar with a shared index. Problem 2: max bomb chain reaction (directed graph where i → j if j is within i's radius, BFS from each node; → really Graph).
- **Variants:**
  - [#310 Implement Employee Management and Expression Evaluation](problems/310-implement-employee-management-and-expression-evaluation.md) *(inferred)*. **Differs:** Part 2 is the same function-call evaluator with an explicit frame stack (depth up to 1e5) and negative ints. Part 1 is an org chart with `manager` / `reports` maps where removing an employee re-parents its reports. **Near-duplicate of #231** (Part 2).
  - [#184 Evaluate a Lisp-Style Expression Language with let, add and mult Scoping](problems/184-evaluate-a-lisp-style-expression-language-with-let-add-and-mult-scoping.md). **Differs:** Lisp `let/add/mult` adds variables, with lexical scope, shadowing and sequential rebinding. Keep a scope stack of dicts. **Follow-up of #231.**
  - [#380 Evaluate Postfix Arithmetic with Truncating Integer Division](problems/380-evaluate-postfix-arithmetic-with-truncating-integer-division.md). **Differs:** postfix needs no parsing of structure: push operands, and an operator pops right then left. Truncate division toward zero. **Same concept, different setting** (simplest form).

#### Bracket matching and nested decoding: push on open, resolve on close
- **Anchor:** [#249 Check Matching and Nested Brackets](problems/249-check-matching-and-nested-brackets.md). Valid brackets: push the expected closer and fail on a mismatch or a non-empty stack at the end. The base of everything in this section.
- **Variants:**
  - [#445 Decompress encoded string with nested repeats](problems/445-decompress-encoded-string-with-nested-repeats.md) *(inferred)*. **Differs:** the frames carry data: on `[` push `(text_so_far, k)`, and on `]` set `text = prev + text * k`. Output length can explode, so discuss it. **Follow-up of #249.**
  - [#341 Solve three coding interview problems](problems/341-solve-three-coding-interview-problems.md). **Differs:** Part 1 is the decode string from #445. Part 2 is max profit with jump decisions (1-D DP). Part 3 is counting connected land components (grid DFS/BFS; → really Graph). **Near-duplicate of #445** (Part 1).

### Other Stack / Parsing problems
- [#509 Separate Nested Function Calls into Exclusive Times](problems/509-separate-nested-function-calls-into-exclusive-times.md). Exclusive time of functions: a stack of running ids. On start, credit the top up to `t − 1`. On end, credit the popped id with `t − prev + 1` and set `prev = t + 1`. Interval-like logs, compare with #36.
- [#222 Parse strings and find meeting slots](problems/222-parse-strings-and-find-meeting-slots.md). Parse `@user` and a signed int per line with regex and sum per user. Then count users available per day and emit length-x windows of consecutive valid days. → really Hashing / Sliding window.
- [#542 Decide Whether Four Cards Can Form Twenty-Four](problems/542-decide-whether-four-cards-can-form-twenty-four.md). 24 game: try every pair, combine it with each operator, recurse on 3 then 2 values, and use an epsilon for division. → really Backtracking.

---

## Monotonic Stack

**Recognise it when:**
- "next / previous greater (or smaller) element", "first larger value to the right".
- "how many can X see", "visible", "blocked by someone taller".
- "largest rectangle", "span", "how far left/right until a smaller bar".
- "circular array" + next-greater → iterate `2n` indices with `i % n`.

**Core idea:** Keep a stack of indices whose answer is still unknown, in monotone order of value. A new element pops everything it "beats" and becomes the answer for each popped index, so every index is pushed and popped once (O(n)). Whatever remains on the stack at the end has no answer. For the rectangle problem, a popped bar's width is bounded by the new element on the right and the next stack element on the left.

**Skeleton:**
```python
ans = [-1] * n
st = []                                   # indices, values decreasing
for k in range(2 * n if circular else n):
    i = k % n
    while st and a[st[-1]] < a[i]:        # strict: equal values don't resolve
        ans[st.pop()] = a[i]
    if k < n: st.append(i)                # second pass only resolves
```

**Pitfalls:**
- Strict vs non-strict comparison decides how duplicates behave. Read "strictly larger" carefully.
- Circular arrays: push only during the first pass, or indices get answers from themselves.
- Histogram: add a sentinel 0 at the end (or flush the stack) so the remaining bars are measured.

### Clusters

#### Next-greater / next-smaller family: each index is resolved when a dominating value arrives
- **Anchor:** [#13 Find the first larger value for every element of a circular array](problems/013-find-the-first-larger-value-for-every-element-of-a-circular-array.md). Full statement, the pure next-strictly-greater over a circular array, with the two-pass trick and equal values popping nothing.
- **Variants:**
  - [#33 Count Visible People per Position When Only Someone Taller Than Both Blocks](problems/033-count-visible-people-per-position-when-only-someone-taller-than-both-blocks.md). **Differs:** count instead of finding one value. Each person sees everyone popped (shorter) plus the one who stops the pops. Run both directions and add, and handle equal heights per the unusual "taller than both" rule. **Same concept, different setting.**
  - [#297 Find the Largest Rectangle Under Histogram Bars](problems/297-find-the-largest-rectangle-under-histogram-bars.md). **Differs:** use next-*smaller* on both sides. When bar j is popped by i, its rectangle spans `(st[-1], i)`. Area = `h[j] × width`. **Same concept, different setting.**

### Other Monotonic Stack problems
- [#153 Find the Largest Monotone Increasing Number](problems/153-find-the-largest-monotone-increasing-number.md) *(inferred)*. Largest number `<= n` with non-decreasing digits: scan right to left, and on `d[i−1] > d[i]` decrement `d[i−1]` and mark where 9s start (the decrement cascades). → really Greedy / digits.
- [#172 Return Unique Three-Sum Value Triples](problems/172-return-unique-three-sum-value-triples.md). 3Sum unique triples: sort a copy, fix i (skip duplicates), then two pointers on the rest. → really Two Pointers / Sorting.

---

## Segment Tree / Fenwick

**Recognise it when:**
- "for each position, count later/earlier elements smaller/greater" (inversion-style counts).
- "position of an item in a line where items in the middle can be removed".
- "point update + prefix/range sum or count, many times" with n and q up to 1e5.
- "first index with property, then update it" → segment tree with descent.

**Core idea:** A Fenwick tree stores partial sums over power-of-two blocks, so both a point update and a prefix sum cost O(log n). To count "smaller later" elements, scan from the right and query the prefix over compressed values. To get a live position, put 1 at each active arrival index and query the prefix sum. A segment tree adds range min/max and "find first index ≥ x" by walking down the tree.

**Skeleton:**
```python
bit = [0] * (n + 1)
def update(i, d):            # 1-indexed
    while i <= n: bit[i] += d; i += i & -i
def query(i):                # sum of [1..i]
    s = 0
    while i > 0: s += bit[i]; i -= i & -i
    return s
# coordinate-compress values first: rank = {v: r for r, v in enumerate(sorted(set(a)), 1)}
```

**Pitfalls:**
- Off-by-one: a BIT is 1-indexed, so `query(rank − 1)` gives "strictly smaller" and `query(rank)` gives "≤".
- Compress the values before using them as indices (values up to 1e9).
- For "earliest party with size ≤ c" a BIT is not enough: you need a min-segment tree over arrival order (or sorted sets per size).

### Clusters

#### Fenwick prefix counts over an ordering: an active-marker BIT answers "how many before me"
- **Anchor:** [#479 Count Strictly Smaller Later Occurrences for Every Position](problems/479-count-strictly-smaller-later-occurrences-for-every-position.md). Count smaller after self. Scan right to left, query `rank − 1` and then add the current value's rank. The textbook BIT problem.
- **Variants:**
  - [#16 Design a restaurant waitlist system](problems/016-design-a-restaurant-waitlist-system.md). **Differs:** the BIT is over *arrival order*. Mark 1 per active party so `getPosition` is a prefix sum, and cancel sets it to 0. Seating "earliest party with size ≤ c" needs a second structure (segment tree of min size over arrival, then descend). **Same concept, different setting.** Simpler cousin: #263 Part 2.

---

## Simulation

**Recognise it when:**
- "given logs / events in time order, compute timeouts / sessions / tolls / duplicates".
- "message reappears only if more than N seconds since last *displayed*".
- "grid evolves each tick", "queue at a turnstile with priority rules", "spiral order".
- "file too large for memory" → stream in chunks, parallelise, combine.

**Core idea:** Do exactly what the spec says, but keep only the state you need: usually a hash map from entity to its last state (last checkpoint, last displayed time, open start). Most bugs are in boundary rules, so write those rules down as code comments before coding. When ticks are expensive, jump time to the next event, or turn the whole thing into BFS distances.

**Skeleton:**
```python
last = {}                                  # entity -> last relevant state
out = []
for ts, key, payload in events:            # sort first if order isn't guaranteed
    prev = last.get(key)
    if prev is None or rule(prev, ts, payload):
        out.append(emit(key, ts, prev))
        last[key] = ts                     # update only when the spec says so
# flush entities still "open" at end of log
```

**Pitfalls:**
- Strict vs non-strict boundaries (`> T` vs `>= T`, timeout exactly equal).
- Updating the state on suppressed events (in #152, hidden repeats must *not* reset the timer).
- Assuming the input is sorted or each id appears once: group, then sort per key.
- Entities still open at end of input (#36: calls with no end record use the last timestamp as `now`).

### Clusters

#### Log processing with a per-key state map: one pass (sometimes after grouping and sorting) with a hash map of the last state per entity
- **Anchor:** [#36 Detect timed-out RPC calls from paired start and end log records](problems/036-detect-timed-out-rpc-calls-from-paired-start-and-end-log-records.md). Full statement. Pair start/end per call id. Calls without an end use the final log timestamp. Strict timeout comparison, deterministic output order.
- **Variants:**
  - [#128 Count user sessions from logs](problems/128-count-user-sessions-from-logs.md). **Differs:** group timestamps per user and sort them (the input may be unsorted). A new session starts when the gap is `> T`. **Same concept, different setting.**
  - [#152 Filter Repeated Robot Status Messages](problems/152-filter-repeated-robot-status-messages.md) *(inferred)*. **Differs:** the state is the last *displayed* time per message, and you update it only when you display. **Same concept, different setting** (rate limiter / logger).
  - [#123 Calculate Highway Tolls from Ordered Checkpoint Logs](problems/123-calculate-highway-tolls-from-ordered-checkpoint-logs.md) *(inferred)*. **Differs:** the state is the last checkpoint per plate. The fee between checkpoints comes in O(1) from prefix sums `|prefix[c2] − prefix[c1]|`, and reversals still charge. **Same concept, different setting.**
  - [#207 Deduplicate and Order Batch and Streaming Logs](problems/207-deduplicate-and-order-batch-and-streaming-logs-2.md) *(inferred)*. **Differs:** the hash map holds the one valid version per message (first-seen or latest-seen policy), and a min-heap holds the order. Stale heap entries are skipped (lazy deletion), and both batch and streaming APIs are required. **Follow-up of #152** (heavier state).
  - [#187 Find shared objects across two log files](problems/187-find-shared-objects-across-two-log-files.md). **Differs:** two log files. Keep a per-object set of days/clients and intersect. The follow-up is external-memory (hash-partition both files by object id). **Same concept, different setting.**

### Other Simulation problems
- [#143 Infection Spread on a Grid (Cellular Automaton)](problems/143-infection-spread-on-a-grid-cellular-automaton.md) *(inferred)*. Infection on a grid: multi-source BFS gives each cell's infection tick instead of re-scanning the grid every tick. → really Graph BFS.
- [#181 Compute Turnstile Crossing Times](problems/181-compute-turnstile-crossing-times.md) *(inferred)*. Turnstile: separate enter and exit queues, the last-used direction decides priority, and time jumps to the next arrival when both queues are empty. O(n).
- [#239 Determine winner in stack-merging game](problems/239-determine-winner-in-stack-merging-game.md) *(inferred)*. Stack-merging game: memoised win/lose search over canonical states (a sorted tuple of `(top_colour, height)`). → really Game theory / DP.
- [#271 Read a Matrix Along Its Inward Spiral](problems/271-read-a-matrix-along-its-inward-spiral.md). Spiral matrix: shrink four boundaries, and guard the single-row/column cases so cells are not double-counted.
- [#340 Find maximum value in huge text file](problems/340-find-maximum-value-in-huge-text-file.md). Max value in a huge text file: stream line by line or in chunks (careful at chunk boundaries), take the max per chunk in parallel, then combine. Discuss I/O-bound vs CPU-bound.

---

## Other (non-coding)

### Other Other (non-coding) problems
- [#136 Troubleshoot CPU, latency, and DNS issues](problems/136-troubleshoot-cpu-latency-and-dns-issues.md). Linux troubleshooting: CPU (`top`, `mpstat`, `perf`), I/O (`iostat`, `iotop`), latency (`ping`, `mtr`, `tcpdump`), DNS (`dig`, `nslookup`, `/etc/resolv.conf`). Go layer by layer, from symptom to tool to hypothesis.

---

## Cross-pattern links
- **Intervals + Heap:** #240, #487, #320, #258, #45, #328, #313, #89, #99 (two heaps: free ids and busy-by-end), #337 (heap of end times), #339 (sweep + max-heap with lazy deletion), #257 (ready/waiting heaps on a call clock).
- **Heap + Hashing (top-k frequent):** #356, #125, #280, #44, #50, #99, #89 Q1. Count with a hash map, then select with a bounded heap or `nsmallest`.
- **Design + Linked List / Array / Heap:** #144 (LRU = hash map + DLL), #287 (hash + array swap-with-last), #69 (hash + min-heap of free ids, the same "lowest free id" idea as #240), #263 Part 2 (hash + DLL waitlist).
- **Design + Order statistics / Fenwick:** #264 (count tree, k-th largest) ↔ #220/#443 (heap when k is fixed). #16 and #263 Part 2 (BIT for live position) ↔ #479.
- **Design + k-way merge:** #514 (feed merge) ↔ #5 (median across k sorted arrays) ↔ #217 (frontier heap).
- **Run-length two-pointer walk:** #405 (RLE dot product) ↔ #364 (RLE median) ↔ #141 / #74 Part 3 (two-pointer interval merge or intersection).
- **Intervals + DP / Binary Search:** #52 (sort by end + bisect + DP). #260 and #105 follow-up (bisect on sorted disjoint ranges). #376 (state-machine DP, Dynamic Programming family).
- **Intervals + Greedy:** #209 Part 2 (min intervals to cover, jump-game greedy).
- **Stack + Intervals/Logs:** #509 (call-stack exclusive time) ↔ #36 (RPC start/end pairing).
- **Simulation + Graph BFS:** #143 (multi-source BFS). Also multi-part graph pieces in #313 and #337 (Dijkstra), #231 (bomb chain BFS), #341 Part 3 (islands).
- **Simulation + Heap (lazy deletion):** #207 ↔ #339 ↔ #257.

## Must-do anchors (intervals, heaps & design)
1. **#240 Assign meetings to rooms with delays**. Fixed rooms, lowest free id, delay with the same duration, count usage. Covers #487, #320, #99 P1 and, by dropping the delay branch, #258.
2. **#35 Minimum Number of Rooms to Schedule Overlapping Meetings**. Peak concurrency and the end-before-start tie rule. Unlocks #31, #100, #101, #337, #263 P3.
3. **#45 Assign the Minimum Fleet to Rental Reservations**. Min fleet with a concrete assignment (open a new id only when forced). Unlocks #328, #313 P2, #89 Q3.
4. **#214 Compute minimum servers for cyclic tasks**. Normalise wrap-around before sweeping. Unlocks #266 and the job_id merging of #68.
5. **#202 Find safe travel intervals between planet influences**. Sort + merge + complement gaps (touching rules). Unlocks #307, #141, #74 P3, #105.
6. **#108 Intervals with Exactly X Concurrent Meetings**. Sweep that emits segments with constant state. Unlocks #167 and is a step toward #339 skyline.
7. **#356 Return the Most Frequent Values in an Array**. Top-K frequent with deterministic ties. Unlocks #125, #280, #44, #50, #99 P2.
8. **#216 Track the Running Median of an Integer Stream**. Two-heap running median and its balance invariant (#292).
9. **#144 Implement an LRU cache**. LRU: the template for "hash map + ordering structure" designs (#287, #69).
10. **#13 Find the first larger value for every element of a circular array**. Monotonic stack with circular two-pass and strict comparisons. Unlocks #33, #297.
11. **#231 Solve Two Coding Interview Problems**. Recursive descent / frame stack for nested expressions. Unlocks #310, #184, #380, #445.
12. **#52 Choose Non-Overlapping Weighted Jobs to Maximize Total Profit**. Weighted interval scheduling (sort by end + bisect + DP), for when counting overlaps is not enough.

---

# Arrays & Strings

Seven patterns, 91 problems. Patterns are ordered by how often they show up in interviews. Each cluster gives one anchor to solve first, then explains what changes in each variant.

---

## Sliding Window

**Recognise it when:**
- "longest / shortest **contiguous** subarray or substring such that …" and the condition is **monotone** in the window: growing it can only make it "more invalid" (or "more valid").
- "at most K distinct", "no repeated characters", "contains all characters of T", "sum ≥ target with **positive** numbers".
- "for every window of size k, report …" (fixed window: mean, median, max, anagram signature).
- "two equal values within distance k" means a window of the last k indices.
- Negative numbers combined with a sum target means it is **not** a window. Use prefix sums + hashmap instead.

**Core idea:** Two indices `l ≤ r` mark the current window, and both only move forward. That works because the validity condition is monotone. If `[l, r]` is invalid for a "longest" query, every window `[l, r']` with `r' > r` is invalid too, so `l` can advance for good. Each element enters once and leaves once, which gives O(n). Keep a small summary of the window (a counter, a distinct count, a sum, heaps) that you can update in O(1) or O(log n) per add/remove.

**Skeleton:**
```python
def window(a):
    state, l, best = init(), 0, None
    for r, x in enumerate(a):
        add(state, x)                    # grow right
        while not valid(state):          # "longest": shrink until valid again
            remove(state, a[l]); l += 1
        best = better(best, r - l + 1)   # window [l, r] is the best one ending at r
    return best
# "shortest that satisfies": while valid(state): record, then remove(a[l]); l += 1
# fixed size k: add a[r]; if r >= k: remove(a[r-k]); if r >= k-1: record
```

**Pitfalls:**
- Using a window when values can be negative: a sum window is not monotone then.
- "Shortest" and "longest" put the record step in different places. For "shortest", record **inside** the shrink loop. For "longest", record **after** it.
- Counter bookkeeping: delete keys when their count hits 0, or `len(counter)` stops being the distinct count. In min-cover, track `formed` (how many requirements are met) rather than comparing whole dicts.
- Order statistics on a fixed window (drop the top k, median): heaps need lazy deletion keyed by index, or duplicates get removed wrongly.

### Clusters

#### Longest window with all-distinct elements: grow right, jump `l` past the last occurrence
- **Anchor:** [#11 Measure the Longest Segment of Distinct Characters](problems/011-measure-the-longest-segment-of-distinct-characters.md): the classic "longest window under a distinctness constraint". Keep `last_seen[value]` and set `l = max(l, last_seen[x] + 1)`.
- **Variants:**
  - [#21 O(1) Range Queries: Are All Elements of a Subarray Distinct?](problems/021-o-1-range-queries-are-all-elements-of-a-subarray-distinct.md): **follow-up of #11** (static window → many range queries). Store `bound[r]`, the smallest valid `l` for each right end, using the same scan as #11. Query `[l, r]` is distinct iff `l ≥ bound[r]`, which is O(1) per query.

#### Shortest window that satisfies an "at least" requirement: expand until valid, then shrink while still valid
- **Anchor:** [#268 Find minimum covering substring](problems/268-find-minimum-covering-substring.md): the most general form, covering multiplicities of required characters with a `need` counter and a `formed` count. Once you can do this one, the rest are simplifications.
- **Variants:**
  - [#424 Minimize a Positive-Array Target Window Length](problems/424-minimize-a-positive-array-target-window-length.md): **same concept, simpler state.** The state is just a running sum ≥ target (positives only). The card also mentions the O(n log n) prefix-sum + binary-search alternative.
  - [#82 Find shortest subarray with at least k distinct](problems/082-find-shortest-subarray-with-at-least-k-distinct.md) *(inferred)*: **same concept, different requirement.** "≥ k distinct" uses a frequency map + distinct counter instead of a `need` map. Shrink while distinct ≥ k.
  - [#134 Find shortest subarray with ≥k distinct integers](problems/134-find-shortest-subarray-with-k-distinct-integers.md) *(inferred)*: **near-duplicate of #82.** Same task. Watch the tie-break (strict `<` keeps the leftmost shortest window).

#### Fixed-size window + order statistics: drop the largest k values from each window's mean
- **Anchor:** [#26 Sliding-Window Mean After Removing the Largest K Values](problems/026-sliding-window-mean-after-removing-the-largest-k-values.md): full statement, lowest rank. Split each window into `low` (the w−k smallest) and `high` (the k largest), keep `sum(low)`, and rebalance across the boundary on every insert and delete.
- **Variants:**
  - [#261 Sliding Window Average After Dropping the Largest Values](problems/261-sliding-window-average-after-dropping-the-largest-values.md) *(inferred)*: **near-duplicate of #26.** The card uses a Fenwick tree over coordinate-compressed values (counts + sums), then asks for "the sum of the w−k smallest". This works offline when every value is known up front.
  - [#290 Compute sliding-window average excluding top k](problems/290-compute-sliding-window-average-excluding-top-k.md) *(inferred)*: **near-duplicate of #26.** Two heaps with **lazy deletion** (tag each entry with its stream index so duplicates stay distinct). This is the version you can write in Python without a sorted container.

#### Fixed-length window compared against a frequency signature (anagram / word multiset)
- **Anchor:** [#232 Check if all substrings are anagrams of words](problems/232-check-if-all-substrings-are-anagrams-of-words.md): a window length equals the word length, and the 26-count vector is the signature. Slide it with an O(1) update per step instead of re-counting.
- **Variants:**
  - [#295 Find Every Concatenation Starting Index](problems/295-find-every-concatenation-starting-index.md): **same concept, coarser tokens.** The window moves in steps of `word_len` and counts whole words. Run `word_len` separate passes (one per starting offset) and shrink when a word's count is exceeded.
  - [#247 Find fair split of a two-color necklace](problems/247-find-fair-split-of-a-two-color-necklace.md): **same concept, different setting.** Circular array. Two cuts give one person a contiguous arc, so slide a window of size n/2 around the circle and check that each colour count equals half its total.

#### Duplicate within an index radius: the window holds the last k indices
- **Anchor:** [#426 Detect Equal Values within an Index Radius](problems/426-detect-equal-values-within-an-index-radius.md): the simplest version. Keep a set or hashmap of the last k values (or `last_index[value]`).
- **Variants:**
  - [#460 Detect a Bounded-Index Pair with Near-Equal Values](problems/460-detect-a-bounded-index-pair-with-near-equal-values.md): **follow-up of #426** ("equal" becomes "|a−b| ≤ t"). A plain set is no longer enough. Use an ordered set (successor/predecessor lookup) or buckets of width t+1, which only need neighbour-bucket checks.

### Other Sliding Window problems
- [#338 Find longest increasing contiguous subarray](problems/338-find-longest-increasing-contiguous-subarray.md) *(inferred)*: longest strictly increasing run after changing one value. Precompute `left[i]` / `right[i]` run lengths and try bridging at each i. → really prefix/suffix arrays (DP-lite), not a moving window.

---

## Two Pointers

**Recognise it when:**
- The array is **sorted** (or you may sort it) and the question is about pairs, triples or quads hitting or near a target: "two sum on sorted", "closest 3-sum", "4-sum distinct".
- "in place, O(1) extra space": remove values, dedupe, merge into a buffer, reverse, rotate.
- Palindrome or symmetry checks, or reversing only some characters.
- Two sequences that must be matched in order: subsequence check, "can start become target if tokens only move left/right".
- Maximise something set by the two ends, where it is obvious which end to move (container with most water).

**Core idea:** Each pointer move rules out a whole set of candidates at once. In a sorted array, if `a[i] + a[j] > target`, then `j` cannot pair with anything at or after `i`, so `j--` is safe. Read/write pointers keep a different invariant: `a[:w]` is always the finished output, and `r` scans ahead. Matching pointers on two strings compare the k-th "real" token of each, which works because the moves never reorder tokens.

**Skeleton:**
```python
# opposite ends on sorted a
i, j = 0, len(a) - 1
while i < j:
    s = a[i] + a[j]
    if s == target: record(i, j); i += 1; j -= 1   # + skip duplicates if needed
    elif s < target: i += 1
    else: j -= 1

# read/write compaction
w = 0
for r in range(len(a)):
    if keep(a[r], a[:w]): a[w] = a[r]; w += 1
return w
```

**Pitfalls:**
- Skipping duplicates in k-sum: skip on the **outer** loops and after a match. Skipping before the first use drops valid answers.
- Merging into a buffer from the front overwrites unread data. Fill from the **back**.
- Rotate by k: take `k %= n` first. The reversal trick is reverse all, then reverse `[:k]`, then reverse `[k:]`.
- Matching with tokens and walls: comparing the non-dot sequences is necessary but not sufficient. The per-token position direction also has to be checked.

### Clusters

#### Inward pointers on a sorted range (k-sum family)
- **Anchor:** [#420 Return the Unique Sorted Target Pair as One-Based Indices](problems/420-return-the-unique-sorted-target-pair-as-one-based-indices.md): two-sum on a sorted array, the base move rule (sum too small → `i++`, too big → `j--`).
- **Variants:**
  - [#138 Choose the Closest Three-Position Sum](problems/138-choose-the-closest-three-position-sum.md): **follow-up of #420.** Sort, fix one index, run #420 on the suffix, and track `min |sum − target|` instead of equality.
  - [#51 Find All Distinct Four-Value Target Groups](problems/051-find-all-distinct-four-value-target-groups.md): **follow-up of #138.** Fix two indices (O(n³)), add duplicate skipping on all four positions, and watch for overflow in languages other than Python.
  - [#218 Find numbers with exactly two sum-of-squares forms](problems/218-find-numbers-with-exactly-two-sum-of-squares-forms.md) *(inferred)*: **same concept, implicit sorted array.** `a` runs from 1 up and `b` runs down from isqrt(n), so `a² + b²` is monotone in each pointer. Count the representations and keep the numbers that have exactly two.
  - [#62 Choose Vertical Sides for the Greatest Water Capacity](problems/062-choose-vertical-sides-for-the-greatest-water-capacity.md): **same concept, different objective.** Start at both ends and always move the **shorter** side. Moving the taller side can never increase `min(h) × width`.

#### In-place reverse/swap from both ends
- **Anchor:** [#472 Reverse the Original Printable-Character Array In Place](problems/472-reverse-the-original-printable-character-array-in-place.md): the bare swap-and-converge loop.
- **Variants:**
  - [#471 Reverse Only Vowel Occurrences in an ASCII String](problems/471-reverse-only-vowel-occurrences-in-an-ascii-string.md): **same loop with a filter.** Each pointer skips non-vowels before swapping.
  - [#347 Compare Normalized ASCII Phrase Symmetry](problems/347-compare-normalized-ascii-phrase-symmetry.md): **same loop, compare instead of swap.** Skip non-alphanumerics and compare case-folded characters.
  - [#457 Rotate the Original Array Right by a Nonnegative Count](problems/457-rotate-the-original-array-right-by-a-nonnegative-count.md): **same concept, applied three times.** Reversal-based rotate (reverse all, reverse the first k, reverse the rest). The card also compares the extra-buffer and cycle-permutation approaches.

#### Read/write pointer compaction and merging
- **Anchor:** [#189 Compact a Sorted Array into Its Distinct Prefix](problems/189-compact-a-sorted-array-into-its-distinct-prefix.md): the clearest "`a[:w]` is the answer so far" invariant (write when `a[r] != a[w-1]`).
- **Variants:**
  - [#322 Remove Chosen Values from an Array Prefix](problems/322-remove-chosen-values-from-an-array-prefix.md): **same concept.** The keep condition is `a[r] != val`, and order may change, so swapping with the end is also allowed.
  - [#274 Merge Sorted Values into an Existing Array Buffer](problems/274-merge-sorted-values-into-an-existing-array-buffer.md): **same concept, reversed direction.** Three pointers starting from the back of both arrays, so the spare capacity is filled before anything unread is overwritten.

#### Two sequences, one pointer each (in-order matching)
- **Anchor:** [#204 Decide string transform with directional tokens and walls](problems/204-decide-string-transform-with-directional-tokens-and-walls.md): compare the k-th non-dot character of start vs target, then check each token's move direction and that it never crosses a wall.
- **Variants:**
  - [#182 Can board states be transformed?](problems/182-can-board-states-be-transformed.md) *(inferred)*: **near-duplicate of #204.** Pieces never pass each other, so the sequences with blanks removed must match (that is all of Part 2). Part 1 adds the per-piece direction/position check.
  - [#76 Match Dictionary Words to a Swipe-Keyboard Gesture Path](problems/076-match-dictionary-words-to-a-swipe-keyboard-gesture-path.md): **same concept, different setting.** Subsequence check of each word against the path, with fixed first and last letters. A doubled letter may reuse the same path position (the word pointer advances without moving the path pointer).

### Other Two Pointers problems
- [#429 Find a Repeated Value without Modifying the Array](problems/429-find-a-repeated-value-without-modifying-the-array.md): n+1 values in 1..n without modifying the array. Treat `i → nums[i]` as a linked list and find the cycle entrance (Floyd), or binary search on the value with a count check. → really fast/slow pointers (or binary search on value).
- [#505 Build the Shortest Palindrome by Prepending Only](problems/505-build-the-shortest-palindrome-by-prepending-only.md): the longest palindromic prefix gives the answer. Find it with the KMP prefix function on `s + '#' + reverse(s)`. → really string matching (KMP).
- [#230 Simulate In-Place Cellular State Updates](problems/230-simulate-in-place-cellular-state-updates.md) *(inferred)*: in-place Game of Life. Store next-state in bit 1 and read only bit 0 during the pass. → really simulation / bit encoding.

---

## Binary Search

**Recognise it when:**
- The input is sorted and the constraint is "O(log n)": first/last occurrence, insertion point, search a sorted matrix.
- "minimise the maximum", "smallest speed / largest length that works", "at least k pieces": **binary search on the answer** with a monotone `feasible(x)`.
- There is no global order but each step can tell you which half holds the answer: peak element, rotated array, median of two sorted arrays (partition).
- A continuous monotone function where you need its crossing point: "horizontal cut splitting the area in half" means bisection on a real value.
- An expensive black-box oracle where "does this prefix contain the culprit?" is monotone in the prefix length.

**Core idea:** Keep an invariant on `lo`/`hi`, for example "answer ∈ [lo, hi]" or "`lo` is always feasible, `hi + 1` never is". Each step tests `mid` and throws away the half that cannot hold the answer. What justifies dropping a half is **monotonicity**, either of the array or of `feasible`. Decide up front whether you want the first True or the last True, and pick the matching midpoint rounding so the loop always shrinks.

**Skeleton:**
```python
def first_true(lo, hi, feasible):      # smallest x in [lo, hi] with feasible(x); hi must be feasible
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid): hi = mid       # mid might be the answer
        else: lo = mid + 1
    return lo
# last True: mid = (lo + hi + 1) // 2; if feasible(mid): lo = mid else: hi = mid - 1
# real-valued: for _ in range(100): mid = (lo+hi)/2; (lo, hi) = (lo, mid) if f(mid) else (mid, hi)
```

**Pitfalls:**
- Infinite loop from mixing `lo = mid` with a lower-rounded midpoint. "Last True" needs `(lo + hi + 1) // 2`.
- Wrong search bounds for answer search. They must bracket the answer, e.g. speed in `[1, max(piles)]`, and length in `[0, max]` where 0 means "impossible".
- Rotated or peak arrays with duplicates: when `a[mid] == a[hi]` you cannot tell which half to drop. Shrink `hi -= 1`, which makes the worst case O(n), and say so.
- Floating point: iterate a fixed number of times rather than `while hi - lo > eps` on huge coordinates, and use integer prefix sums where possible.

### Clusters

#### Boundary search on a sorted array (lower_bound / upper_bound)
- **Anchor:** [#139 First and Last Indices of a Value](problems/139-first-and-last-indices-of-a-value.md): write `lower_bound` once and call it twice (`lb(t)` and `lb(t+1) − 1`). That covers both boundary kinds.
- **Variants:**
  - [#205 Find the Sorted Insertion Index](problems/205-find-the-sorted-insertion-index.md): **sub-problem of #139.** The insertion index *is* `lower_bound`.
  - [#345 Search a Matrix with Ordered Row Boundaries](problems/345-search-a-matrix-with-ordered-row-boundaries.md): **same concept, 2D setting.** Each row starts after the previous row ends, so treat the matrix as one sorted array of length m·n (`r, c = divmod(mid, n)`).
  - [#510 Select the K Closest Sorted Values with Smaller-Value Ties](problems/510-select-the-k-closest-sorted-values-with-smaller-value-ties.md): **same concept, search the window start.** Binary search `left ∈ [0, n−k]` by comparing `x − a[mid]` with `a[mid+k] − x`. Ties go to the smaller value, so move left on `<=`. (A two-pointer shrink from both ends is the O(n) alternative.)

#### Binary search without a sorted array (slope / rotation tells you which half to keep)
- **Anchor:** [#349 Return Any Strict Peak Index in Logarithmic Time](problems/349-return-any-strict-peak-index-in-logarithmic-time.md): the cleanest "local evidence decides the half" problem. If `a[mid] < a[mid+1]`, a peak exists to the right.
- **Variants:**
  - [#378 Locate a Rotated Minimum despite Duplicate Ambiguity](problems/378-locate-a-rotated-minimum-despite-duplicate-ambiguity.md): **same concept, harder invariant.** Compare `a[mid]` with `a[hi]` to find the min of a rotated array. Duplicates make `a[mid] == a[hi]` ambiguous, so shrink `hi` and accept the O(n) worst case.

#### Binary search on the answer with a monotone feasibility check
- **Anchor:** [#92 Solve Banana Speed and Interval Merge](problems/092-solve-banana-speed-and-interval-merge.md): Koko eating bananas. The textbook "smallest speed that finishes in h hours", with `feasible = Σ ceil(p / k) ≤ h`. (Part 2 is merge intervals, see Cross-pattern links.)
- **Variants:**
  - [#226 Maximize the Equal Wood Segment Length](problems/226-maximize-the-equal-wood-segment-length.md) *(inferred)*: **same concept, mirrored.** Find the **largest** length L with `Σ w // L ≥ k`, so it is last-True with the upper midpoint and returns 0 if infeasible.
  - [#366 Find longest duplicated substring](problems/366-find-longest-duplicated-substring.md): **same concept, string setting.** "A duplicate of length L exists" is monotone (L works means L−1 works). Binary search L and check with a Rabin-Karp rolling hash + set. The card's linear alternative is a suffix array or suffix automaton.

#### Real-valued bisection on an area function (horizontal cut)
- **Anchor:** [#409 Find horizontal cut balancing square areas](problems/409-find-horizontal-cut-balancing-square-areas.md): full statement. `F(y)` (area above the cut) is continuous and monotone, so bisect y. Overlapping squares are counted with multiplicity.
- **Variants:**
  - [#259 Find a Horizontal Cut That Bisects Rectangle Area](problems/259-find-a-horizontal-cut-that-bisects-rectangle-area.md) *(inferred)*: **near-duplicate of #409** with disjoint rectangles and n = 2·10⁵. Same bisection. An exact alternative sweeps the y-events, because `areaBelow` is piecewise linear with slope equal to the total width crossing that height.
  - [#198 Find where to cut cake into equal areas](problems/198-find-where-to-cut-cake-into-equal-areas.md) *(inferred)*: **same concept, 1D and exact.** The rectangles sit side by side, so build prefix area sums, binary search the rectangle where the cumulative area reaches the target, then solve a linear equation inside it.

#### Black-box oracle: binary search over prefixes to locate culprits
- **Anchor:** [#403 Find conflicting pair using black-box run()](problems/403-find-conflicting-pair-using-black-box-run.md) *(inferred)*: chosen over #174 because it is the base case with one bad pair. "Prefix fails" is monotone, so binary search the smallest failing prefix to get the later culprit. Then binary search the start of the window for the earlier one. That costs about 2·log n calls.
- **Variants:**
  - [#174 Minimize calls to find all bad test pairs](problems/174-minimize-calls-to-find-all-bad-test-pairs.md): **follow-up of #403** (one pair → all k pairs). Process tests right to left, partition the suffix into internally compatible groups, and binary search inside each group that conflicts with v. Discuss the call count in terms of n and k.

### Other Binary Search problems
- [#27 Locate the Middle Value Across Two Sorted Inputs](problems/027-locate-the-middle-value-across-two-sorted-inputs.md): median of two sorted arrays. Binary search the **partition** of the shorter array so that the left halves hold ⌈(m+n)/2⌉ elements and `maxLeft ≤ minRight`. Handle empty arrays with ±∞ sentinels.

---

## Prefix Sum

**Recognise it when:**
- Many range-sum or range-count queries on a **static** array or grid ("immutable", "O(1) per query").
- Many range **updates**, read once at the end ("apply rectangle increments, return the final grid"): use a difference array.
- "subarray with sum k", "equal number of 0s and 1s", "endpoints satisfy X and maximise the sum", **with negatives allowed**: prefix sum + hashmap.
- "is the range [l, r] free of property P?": count the bad positions in a prefix and check `bad[r] − bad[l] == 0`.
- "remove one element / cut once so the sides balance": you need left and right totals in O(1).

**Core idea:** `P[i] = a[0] + … + a[i−1]`, so `sum(l..r) = P[r+1] − P[l]`. A range question becomes a question about two prefix values. Fix the right end `r` and look up the best or matching **earlier** prefix in a hashmap (first index for "longest", min prefix for "max sum", counts for "number of"). A difference array is the inverse: mark `+v` at the start and `−v` just after the end, then prefix-sum once.

**Skeleton:**
```python
P = [0]
for x in a: P.append(P[-1] + x)              # sum(l..r) = P[r+1] - P[l]

seen = {0: -1}                               # key -> earliest index (or min prefix / count)
run = 0
for i, x in enumerate(a):
    run += transform(x)                      # e.g. +1 / -1 for balance problems
    if run - target in seen: best = max(best, i - seen[run - target])
    seen.setdefault(run, i)                  # keep earliest for "longest"
# 2D: S[r+1][c+1] = g[r][c] + S[r][c+1] + S[r+1][c] - S[r][c]
```

**Pitfalls:**
- Off-by-one: use a length-(n+1) prefix with `P[0] = 0`, and in 2D pad both a row and a column. Difference arrays need size n+1 (or (n+1)²) for the `r2+1` / `c2+1` marks.
- Seed the hashmap (`{0: -1}`) or subarrays starting at index 0 are missed.
- Updating the map **before** querying at the same index lets an empty subarray match itself.
- Range-flag queries: decide whether the break at index `l` counts. It is `bad[r] − bad[l]`, not `bad[l−1]`.

### Clusters

#### Static range-sum queries (precompute once, O(1) per query)
- **Anchor:** [#468 Preprocess Immutable Inclusive Array Range Sums](problems/468-preprocess-immutable-inclusive-array-range-sums.md): 1D `P[r+1] − P[l]`, the foundation for everything else here.
- **Variants:**
  - [#383 Answer Immutable Rectangle Sums in Constant Query Time](problems/383-answer-immutable-rectangle-sums-in-constant-query-time.md): **follow-up of #468** (1D → 2D). Build the padded inclusion-exclusion table and answer each query with 4 lookups.

#### 2D difference array (many rectangle updates, one read)
- **Anchor:** [#42 Count Overlapping Rectangle Updates on a Grid](problems/042-count-overlapping-rectangle-updates-on-a-grid.md): full statement with 10⁵ updates. Four corner marks per rectangle, then a 2D prefix pass.
- **Variants:**
  - [#227 Count Rectangle Coverage on a Grid](problems/227-count-rectangle-coverage-on-a-grid.md) *(inferred)*: **near-duplicate of #42**, with stress on edge rectangles (the (n+1)×(n+1) buffer), duplicate updates and not mutating the input.

#### Prefix count of "bad" boundaries, then O(1) range check
- **Anchor:** [#199 Answer parity-alternation range queries](problems/199-answer-parity-alternation-range-queries.md) *(inferred)*: mark index i bad if `a[i−1]` and `a[i]` have the same parity. A range alternates iff `bad[r] − bad[l] == 0`.
- **Variants:**
  - [#363 Answer range queries for alternating parity subarrays](problems/363-answer-range-queries-for-alternating-parity-subarrays.md) *(inferred)*: **follow-up of #199** (static → point updates). Changing one value affects at most two flags, so keep the flags in a Fenwick tree, or a sorted set of bad indices, instead of a plain prefix array.

#### Prefix sum + hashmap keyed on a value (look back for the best partner)
- **Anchor:** [#473 Find the Longest Balanced Binary Segment](problems/473-find-the-longest-balanced-binary-segment.md): map 0 → −1, track the running balance, and store the **first** index of each balance. The longest gap between equal balances is the answer.
- **Variants:**
  - [#283 Maximize Boundary-Difference Subarray Sum](problems/283-maximize-boundary-difference-subarray-sum.md): **same concept, key is the array value.** The endpoints must satisfy `a[i] = a[j] ± k`. For each value, keep the **minimum** prefix sum seen before an index holding it, and maximise `P[j+1] − minP[a[j] ± k]`.
  - [#78 Solve Two Array Optimization Problems](problems/078-solve-two-array-optimization-problems-2.md): **same concept, two parts.** Part 2 (equal endpoints, maximise sum) is **#283 with k = 0**. Part 1 (remove one link, then split evenly) is essentially #235. The O(1)-space follow-up gives up the hashmap for O(n²).
  - [#235 Check pivot after removing one element](problems/235-check-pivot-after-removing-one-element.md) *(inferred)*: **same concept, the lookup key is the removed value.** For pivot p with sums L and R, the removed element must equal `L − R` (to its left) or `R − L` (to its right), so keep a hash set of values seen on each side while scanning.

---

## Hashing / Counting

**Recognise it when:**
- "contains duplicate", "intersection", "has a partner with value x+k or 2x": O(1) membership checks.
- "group the items that are equivalent under …": build a **canonical key** (sorted letters, shift-normalised offsets, midpoint+length).
- "linear time", while sorting would be O(n log n): longest consecutive run, first missing positive.
- "mapping must be one-to-one": two dictionaries, or a dictionary plus a used-set.
- Multiset reasoning: "reconstruct from a doubled array", bulls & cows (min of counts).

**Core idea:** A hashmap swaps the "have I seen this?" scan (O(n)) for an O(1) lookup, so nested loops become single passes. Many grouping problems come down to one question: **what key do all equivalent items share?** Once the key is right, `defaultdict(list)` does the rest. When the problem asks for O(1) extra space, the array itself (index = value) or a voting argument (Boyer-Moore) stands in for the map.

**Skeleton:**
```python
from collections import Counter, defaultdict
groups = defaultdict(list)
for item in items:
    groups[canonical_key(item)].append(item)   # equivalence classes

cnt = Counter(a)
for x in sorted(cnt, key=order):               # process in a safe order
    need = partner(x)                          # x + k, 2 * x, ...
    if cnt[need] < cnt[x]: return False
    cnt[need] -= cnt[x]
```

**Pitfalls:**
- Self-pairing when the partner equals the value (k = 0 in k-diff, x = 0 in the doubled array). These need `count ≥ 2`, not just presence.
- One-to-one mapping checked in only one direction ("ab" → "aa" passes a single map).
- Counting a number twice for one digit (e.g. 11 contains digit 1 once for grouping purposes). Use a set of digits.
- Hash keys built from floats or tuples of floats (use integer sums or doubled midpoints in geometry).

### Clusters

#### Group by a shared digit (fix the shared attribute instead of enumerating subsets)
- **Anchor:** [#186 Find largest digit-sharing subset](problems/186-find-largest-digit-sharing-subset.md): the simplest form. For each digit 0–9, count the numbers containing it, and the max is the answer.
- **Variants:**
  - [#169 Find largest subset sharing a common digit](problems/169-find-largest-subset-sharing-a-common-digit-3.md): **near-duplicate of #186**, with the "11 counts once" pitfall stated explicitly.
  - [#83 Find largest group of two-digit numbers sharing digits](problems/083-find-largest-group-of-two-digit-numbers-sharing-digits.md): **same input, different definition of group.** Sharing is **transitive** here (a shares with b, b with c), so the answer is the largest connected component. → really union-find / graph components (10 digit nodes make it tiny).

#### Set membership in one pass
- **Anchor:** [#461 Detect Whether Any Integer Value Repeats](problems/461-detect-whether-any-integer-value-repeats.md): the bare "seen set" pattern.
- **Variants:**
  - [#538 Return Distinct Values Shared by Two Arrays](problems/538-return-distinct-values-shared-by-two-arrays.md): **same concept, two inputs.** Build a set from one array and probe with the other, returning distinct values.
  - [#255 Measure the Longest Consecutive Value Run in Linear Time](problems/255-measure-the-longest-consecutive-value-run-in-linear-time.md): **same concept, smarter start condition.** Only start counting a run at x when `x − 1 ∉ set`, which makes the whole thing O(n).

#### Partner lookup in a counter (x pairs with x+k or 2x)
- **Anchor:** [#515 Count Distinct Value Pairs with a Fixed Gap](problems/515-count-distinct-value-pairs-with-a-fixed-gap.md): k-diff pairs. For k > 0, count distinct x with x+k present. For k = 0, count values with frequency ≥ 2.
- **Variants:**
  - [#241 Reconstruct original array from doubled shuffle](problems/241-reconstruct-original-array-from-doubled-shuffle.md) *(inferred)*: **same concept plus a greedy order.** Process values by increasing |x|, because the smallest |x| left must be an original. Pair it with 2x and decrement counts. Zero needs an even count.

#### Canonical key / bijection
- **Anchor:** [#467 Group Strings Equivalent under Uniform Alphabet Shifts](problems/467-group-strings-equivalent-under-uniform-alphabet-shifts.md): the key is the tuple of `(c − s[0]) mod 26`, so all shifts of a string share it.
- **Variants:**
  - [#458 Check a One-to-One ASCII Character Substitution](problems/458-check-a-one-to-one-ascii-character-substitution.md): **same concept, enforce a bijection.** Map s→t and t→s (or compare first-occurrence index patterns, which is a canonical key per string).
  - [#53 Largest-Area Rectangle From a Point Set When Sides Need Not Be Axis-Aligned](problems/053-largest-area-rectangle-from-a-point-set-when-sides-need-not-be-axis-aligned.md): **same concept, geometric key.** Two point pairs are the diagonals of a rectangle iff they have the same midpoint and length. Key = `(x1+x2, y1+y2, dist²)`, then compute areas within each bucket.

### Other Hashing / Counting problems
- [#7 Smallest Missing Positive Integer in Linear Time and Constant Extra Space](problems/007-smallest-missing-positive-integer-in-linear-time-and-constant-extra-space.md): the answer lies in [1, n+1]. Use the array as the presence table by cyclically placing v at index v−1, then scan for the first mismatch (O(1) space).
- [#456 Recover a Guaranteed More-Than-Half Majority](problems/456-recover-a-guaranteed-more-than-half-majority.md): Boyer-Moore voting. Cancel pairs of different values, and the guaranteed majority survives (O(1) space instead of a counter).
- [#513 Count Position Matches and Remaining Digit Matches](problems/513-count-position-matches-and-remaining-digit-matches.md): bulls & cows. Bulls are position matches. Cows are `Σ min(countS[d], countG[d])` over the **non-bull** digits.

---

## String Processing

**Recognise it when:**
- The task is to "convert / format / validate / compare" a string under a precise spec: version strings, numbers, identifiers, Roman numerals.
- Splitting on a delimiter, then comparing or rebuilding tokens (words, dotted revisions).
- Output position is a deterministic function of input position: zigzag rows, chunks of 2k, every k-th character.
- Generating the next term by run-length description (count-and-say).
- Interactive or matching problems over fixed-length words where the per-position match count is the signal.

**Core idea:** Most of these are a **single left-to-right scan with a small amount of state** (current token, a few flags, a lookahead of one). The algorithm is easy and correctness is in the edge cases, so state the grammar or rules first, then code it as a loop or a tiny state machine. Build output in a list and `''.join` at the end, because string `+=` in a loop is O(n²) in many languages.

**Skeleton:**
```python
out, i, n = [], 0, len(s)
while i < n:
    if is_delim(s[i]): i += 1; continue
    j = i
    while j < n and not is_delim(s[j]): j += 1   # token = s[i:j]
    out.append(handle(s[i:j]))
    i = j
return ''.join(out)        # or compare token lists pairwise, padding with defaults
```

**Pitfalls:**
- Leading, trailing and repeated delimiters produce empty tokens. Use `split()` without arguments, or skip explicitly.
- Version compare: treat missing parts as 0 and compare as **ints**, not strings ("1.01" == "1.001").
- Validation grammars (signs, ".", "e"): each flag (`seen_digit`, `seen_dot`, `seen_exp`) has its own rules, and a digit is required after `e`.
- Zigzag with 1 row, chunking where the last chunk is short, and 1-letter inputs: the classic off-by-ones.

### Clusters

#### Tokenise on spaces/delimiters, then rebuild or compare
- **Anchor:** [#326 Reverse Word Order and Normalize ASCII Spaces](problems/326-reverse-word-order-and-normalize-ascii-spaces.md): split, reverse and join, plus the O(1)-space in-place follow-up (reverse the whole string, then reverse each word).
- **Variants:**
  - [#270 Measure the Final Word Before Trailing Spaces](problems/270-measure-the-final-word-before-trailing-spaces.md): **sub-problem.** Scan from the end, skip trailing spaces, count letters until the next space.
  - [#436 Compare Dotted Revision Values with Missing Zeros](problems/436-compare-dotted-revision-values-with-missing-zeros.md): **same concept, compare tokens.** Split on '.', compare the int values pairwise, pad the shorter list with zeros.
  - [#194 Convert Valid Snake Case to Lower Camel Case](problems/194-convert-valid-snake-case-to-lower-camel-case.md): **same concept, transform tokens.** Underscore means capitalise the next letter, done in one pass with a flag.

#### Scan with grammar / lookahead (parse or validate)
- **Anchor:** [#273 Validate a Signed Decimal and Exponent Spelling](problems/273-validate-a-signed-decimal-and-exponent-spelling.md): valid number. The fullest grammar (sign, digits, dot, exponent) and the best test of careful state handling.
- **Variants:**
  - [#75 Evaluate a Guaranteed-Valid Roman Numeral](problems/075-evaluate-a-guaranteed-valid-roman-numeral.md): **same concept, one-char lookahead.** If `value(s[i]) < value(s[i+1])`, subtract, otherwise add.
  - [#236 Implement string formatting and request tracking tasks](problems/236-implement-string-formatting-and-request-tracking-tasks.md) *(inferred)*: **same concept, formatting direction.** Split the sign, integer and fraction parts, strip leading zeros, group in threes from the right, and drop "−0". (Other parts: rotation-mapping validation and request tracking, see Cross-pattern links.)
  - [#480 Recognize the Three Valid Capitalization Patterns](problems/480-recognize-the-three-valid-capitalization-patterns.md): **same concept, tiny grammar.** Three allowed patterns. Count the uppercase letters and check whether only the first is uppercase.

#### Index-mapped construction / chunked simulation
- **Anchor:** [#117 Read a Down-and-Up Character Layout by Row](problems/117-read-a-down-and-up-character-layout-by-row.md): zigzag. The row index bounces 0→R−1→0, so append each char to `rows[r]`. Alternatively use the cycle length 2R−2 to compute positions directly.
- **Variants:**
  - [#483 Reverse the First Part of Each Two-Block String Chunk](problems/483-reverse-the-first-part-of-each-two-block-string-chunk.md): **same concept, chunk stepping.** `for i in range(0, n, 2k)`, reverse `s[i:i+k]`.
  - [#29 Implement Checksums and Feature Rollout Evaluation](problems/029-implement-checksums-and-feature-rollout-evaluation.md): **same concept, chunk stepping + business logic.** Checksum over steps of k with a char→weight map. The second part is dependency evaluation (→ topological sort).
  - [#177 Generate the nth Run-Count Sequence Term](problems/177-generate-the-nth-run-count-sequence-term.md): **same concept, run-length scan.** Each term is the run-length description of the previous one. Iterate n−1 times with a run counter.

### Other String Processing problems
- [#59 Find the Shared Starting String](problems/059-find-the-shared-starting-string.md): longest common prefix. Vertical scan character by character (or compare only the min and max strings in sorted order).
- [#157 Find secret word with match-count feedback](problems/157-find-secret-word-with-match-count-feedback.md): guess the word. After feedback k, keep only candidates with exactly k matches to the guess. Pick the next guess to minimise the largest feedback bucket. → really minimax / interactive search.
- [#317 Find best-matching binary pattern with wildcards](problems/317-find-best-matching-binary-pattern-with-wildcards.md) *(inferred)*: wildcard binary patterns compiled to `(mask, value)`, so a match is `s & mask == value`. Check rules in priority order (length desc, index asc). → really bit manipulation (a trie for scale).

---

## Sorting

**Recognise it when:**
- The answer depends on rank or order, not original position: "at least h items ≥ h" (h-index).
- "the smallest segment that, once sorted, fixes the whole array": compare against the sorted order.
- Matching two sets of points on a line: sort both, and optimal pairings don't cross.
- Sorting is the O(n log n) alternative to hashing, at the cost of losing original indices (decorate them as `(value, index)`).

**Core idea:** Sorting gives a structural guarantee (monotone order, non-crossing matches, i-th largest at position i) that turns a search into a linear scan. Often it is the clean O(n log n) baseline, and the follow-up is to drop it: counting sort for bounded values (h-index buckets), or running max/min scans that find the same boundary as sorting does.

**Skeleton:**
```python
order = sorted(range(n), key=lambda i: (a[i], i))   # keep original indices
b = sorted(a, reverse=True)
h = 0
while h < n and b[h] >= h + 1: h += 1              # threshold scan on sorted data
# counting-sort variant when values are bounded by n: buckets[min(v, n)] += 1
```

**Pitfalls:**
- Sorting loses indices. If the answer is indices, sort `(value, index)` pairs.
- Tie-breaking rules (lexicographically smallest pair) often make a sort-based approach awkward, and a hash scan is cleaner.
- Mentioning O(n log n) without the O(n) follow-up when values are bounded.

### Clusters

#### Sort (or simulate sorting), then scan for a boundary
- **Anchor:** [#477 Find the Largest Supported Citation Threshold](problems/477-find-the-largest-supported-citation-threshold.md): h-index. Sort descending and find the last position with `b[i] ≥ i+1`. The O(n) follow-up uses counting buckets capped at n.
- **Variants:**
  - [#540 Measure the Smallest Segment that Needs Sorting](problems/540-measure-the-smallest-segment-that-needs-sorting.md): **same concept.** Compare with a sorted copy and take the first/last mismatch (O(n log n)). The O(n) version scans left→right with a running max to find the right boundary, and right→left with a running min to find the left boundary.
  - [#126 Maximize 1D deliveries within distance and minimize total distance](problems/126-maximize-1d-deliveries-within-distance-and-minimize-total-distance.md) *(inferred)*: **same concept, sorted order unlocks DP.** Sort both lists. Crossing pairs can be uncrossed, so an optimal matching is order-preserving, which gives an LCS-style DP on `(count, −distance)`. → really DP after sorting.

### Other Sorting problems
- [#127 Return the Lexicographically Smallest Two-Sum Index Pair](problems/127-return-the-lexicographically-smallest-two-sum-index-pair.md): lexicographically smallest two-sum index pair. Smallest i first, so for each i you need the smallest j > i with the complement value. Precompute `value → sorted indices` or scan from the right with a hashmap. → really hashing. Sorting is the comparison baseline that loses indices.

---

## Cross-pattern links
- **Sliding window + heap / Fenwick / ordered set:** #26, #261, #290 (top-k excluded mean), #460 (window + ordered set or buckets).
- **Sliding window + hashing:** #232, #295 (frequency signatures), #268, #82, #134 (need/distinct counters), #11 (last-seen map).
- **Sliding window → offline precomputation:** #21 (turn the window's left bound into an O(1) range-query table).
- **Prefix sum + binary search:** #424 (alternative O(n log n) solution for the shortest positive-sum window), #198 (prefix areas + binary search the rectangle).
- **Prefix sum + hashmap:** #473, #283, #78, #235.
- **Prefix sum → Fenwick / segment tree** when updates appear: #363 (and #261 uses a Fenwick tree for order statistics).
- **Binary search + greedy feasibility:** #92, #226. **Binary search + Rabin-Karp rolling hash:** #366. **Binary search + group testing:** #403, #174. **Binary search + sweep line:** #259 (exact alternative). #92 part 2 is **merge intervals** (Intervals / Sweep Line).
- **Two pointers + sorting:** #138, #51 (sort first). **Two pointers + linked-list cycle detection:** #429 (Floyd). **Two pointers + KMP:** #505.
- **Hashing + graph / union-find:** #83. **Hashing + greedy:** #241. **Hashing + geometry:** #53.
- **Sorting + DP:** #126. **Sorting vs hashing trade-off:** #127.
- **String processing + topological sort / design:** #29 (feature dependencies), #236 (request tracking, 180° rotation mapping). **String + bit masks / trie:** #317. **String + minimax:** #157.
- **In-place state encoding:** #230 (two bits per cell, the same trick as #7's "array as hash table").

## Must-do anchors (arrays & strings)
1. **#268 Find minimum covering substring**: shortest window with a counter and `formed`. It covers every "shortest window satisfying X" problem.
2. **#11 Measure the Longest Segment of Distinct Characters**: longest window with a last-seen jump. It is the base of #21 and every "longest valid window" problem.
3. **#92 Solve Banana Speed and Interval Merge**: binary search on the answer with a feasibility function, and it includes merge intervals as a bonus.
4. **#139 First and Last Indices of a Value**: write `lower_bound` correctly once. It covers #205, #345 and #510.
5. **#473 Find the Longest Balanced Binary Segment**: prefix + first-seen hashmap. It is the template for every "subarray with sum/balance property" problem with negatives.
6. **#51 Find All Distinct Four-Value Target Groups**: sort, then fix outer indices, then two pointers, with duplicate skipping. It covers #420 and #138.
7. **#26 Sliding-Window Mean After Removing the Largest K Values**: fixed window + two-group order statistics. It is the hardest common window follow-up (#261, #290).
8. **#42 Count Overlapping Rectangle Updates on a Grid**: 2D difference array + 2D prefix. It covers #227, #383 and #468.
9. **#378 Locate a Rotated Minimum despite Duplicate Ambiguity**: binary search without sortedness, plus the duplicate ambiguity argument. It covers #349.
10. **#204 Decide string transform with directional tokens and walls**: invariant-based two-sequence matching. It covers #182 and #76.
11. **#255 Measure the Longest Consecutive Value Run in Linear Time**: hashing for O(n) where sorting is the obvious first idea. It pairs with #7 for "linear time, beat the sort".
12. **#273 Validate a Signed Decimal and Exponent Spelling**: grammar-driven validation. It trains the edge-case discipline that every string problem (#436, #75, #236) needs.

---

# DP, search & math

Covers Dynamic Programming, Backtracking, Greedy, Math / Number Theory, Bit Manipulation and Randomized / Probability (81 problems). Use it this way: solve the **anchor** of each cluster, then for each variant just say out loud what changes. If you can explain that change, you've got the variant covered.

---

## Dynamic Programming

**Recognise it when:**
- "Count the number of ways…", "minimum cost / maximum score to reach…", "is it possible to…" where each step makes one of a few choices and different paths end up in the same subproblem.
- A brute-force recursion branches 2–3 ways per element and n is 10^3–10^5, which is too big to enumerate but fine for O(n) to O(n²) states.
- Two strings/sequences compared character by character ("match", "transform", "subsequence count", "interleave").
- "Remove/burst/merge items and the neighbours change": interval DP over `[l, r]`.
- Capacity/budget with items ("at most W", "exact quantities"): knapsack.
- Grid with moves only right/down (or always moving one column forward): grid DP. Moves in all 4 directions but strictly increasing values: memoised DFS (the increasing values make it a DAG).

**Core idea:** Ask *"what is the smallest summary of the prefix/subproblem that lets me make every future decision?"* That summary is the state (index; index + last choice; `(i, j)` in two strings; `(l, r)` of an interval; remaining capacity). The transition is "which choice did I make last?", and the recurrence combines the answers of smaller states. Correctness comes from optimal substructure, and speed comes from each state being computed once. Write it top-down with `@cache` first, then convert to a bottom-up table if you need the memory or speed.

**Skeleton:**
```python
from functools import cache

def solve(items):
    n = len(items)
    @cache
    def f(i, extra):                 # state = position + whatever the future needs to know
        if i == n:                   # base case: empty suffix
            return BASE
        best = WORST
        for choice in choices(i, extra):          # last/next decision
            if valid(i, extra, choice):
                best = combine(best, gain(i, choice) + f(nxt(i, choice), new_extra(extra, choice)))
        return best
    return f(0, START)
# bottom-up: fill dp in the order that makes every dependency ready; roll rows to cut memory
```

**Pitfalls:**
- A state that is too small: if the future depends on "previous element/colour/count", that has to be in the state (e.g. max-product needs both min and max; remove-boxes needs "how many equal boxes are attached").
- Iteration order in bottom-up: 0/1 knapsack must loop capacity **downwards** in 1-D. Interval DP must loop by increasing length.
- Off-by-one in base cases with "empty" prefixes (decode ways with `'0'`, regex with an empty pattern, `x*` matching zero chars).
- Overflow or "modulo 1e9+7" requirements. Apply the mod on every addition, not only at the end.

### Clusters

#### 1-D counting: ways to build a prefix — `dp[i] = sum of dp[i - len]` over every valid last piece
- **Anchor:** [#323 Count Ordered One-Step and Two-Step Climbs](problems/323-count-ordered-one-step-and-two-step-climbs.md) — the simplest case: the last step is 1 or 2, so `dp[i] = dp[i-1] + dp[i-2]`. Build the "what was the last piece?" habit here.
- **Variants:**
  - [#412 Count Complete Digit-to-Letter Decodings](problems/412-count-complete-digit-to-letter-decodings.md) — **Differs:** the last piece (1 or 2 digits) is only allowed if it decodes validly (`'0'` alone is invalid, `10–26` for pairs). Same recurrence with guards. Zeros are where people slip. **Same concept, different setting.**
  - [#397 Count Spellings Using Chemical Element Symbols](problems/397-count-spellings-using-chemical-element-symbols.md) — **Differs:** pieces are 1- or 2-letter element symbols looked up case-insensitively in a set. Same shape as #412, but the counts get huge, so use big ints (Python) and two rolling variables. **Near-duplicate of #412.**

#### 1-D take/skip: non-adjacent selection — state = "did I take the previous element?"
- **Anchor:** [#459 Maximize a Nonadjacent Selection around a Circle](problems/459-maximize-a-nonadjacent-selection-around-a-circle.md) — full statement, and it contains the linear case. Keep `take`/`skip` while scanning.
- **Variants:**
  - [#102 Maximize sum without choosing adjacent elements](problems/102-maximize-sum-without-choosing-adjacent-elements.md) *(inferred)* — **Differs:** linear array, no wrap-around. This is the subroutine #459 calls. Solve it first as a warm-up. **Same problem, simpler setting.**

#### 1-D "best run ending at i" (Kadane family) — track the best value that *ends exactly* at i, then take the max over i
- **Anchor:** [#73 Longest Non-Decreasing Subarray After One Replacement](problems/073-longest-non-decreasing-subarray-after-one-replacement.md) — full statement and the most-asked version. You build `left[i]` (run ending at i) and `right[i]` (run starting at i), then try replacing each position to join `left[i-1]` and `right[i+1]` when `nums[i-1] <= nums[i+1]`.
- **Variants:**
  - [#111 Find the Longest Non-Decreasing Subarray After One Replacement](problems/111-find-the-longest-non-decreasing-subarray-after-one-replacement.md) *(inferred)* — **Differs:** nothing material. Same task (replace ≤1 element, non-decreasing). **Near-duplicate of #73.**
  - [#112 Find the Longest Continuous Increasing Subsequence](problems/112-find-the-longest-continuous-increasing-subsequence.md) *(inferred)* — **Differs:** no replacement and *strictly* increasing. Only the single "run ending here" counter is needed. This is the base case of #73, so do it first if you're rusty.
  - [#379 Maximize Products over Contiguous Nonempty Segments](problems/379-maximize-products-over-contiguous-nonempty-segments.md) — **Differs:** product instead of length. A negative number flips min↔max, so the state must hold **both** the max and the min product ending at i. **Same concept, different setting.**

#### Grid path counting — `dp[r][c] = sum of dp[predecessors]`
- **Anchor:** [#272 Count Right-and-Down Grid Routes](problems/272-count-right-and-down-grid-routes.md) — classic right/down moves: `dp[r][c] = dp[r-1][c] + dp[r][c-1]`. Also equals `C(m+n-2, m-1)` (math shortcut).
- **Variants:**
  - [#39 Count Up-Right/Right/Down-Right Grid Paths Through Ordered Checkpoints](problems/039-count-up-right-right-down-right-grid-paths-through-ordered-checkpoints.md) — **Differs:** moves are up-right/right/down-right, so you process **column by column** (each column depends on 3 cells of the previous column). With ordered checkpoints, check the checkpoint columns strictly increase, then multiply the path counts of the segments between checkpoints, or zero out the non-checkpoint rows in checkpoint columns. Apply the mod. **Follow-up of #272.**

#### Grid "largest shape ending at cell" — the answer at (i, j) comes from its already-computed neighbours
- **Anchor:** [#507 Measure the Largest All-One Square Area](problems/507-measure-the-largest-all-one-square-area.md) — `side[i][j] = 1 + min(up, left, up-left)` when the cell is `'1'`. Learn why the min of three is correct. Rolling one row is enough.
- **Variants:**
  - [#147 Count same-color squares in a character grid](problems/147-count-same-color-squares-in-a-character-grid.md) — **Differs:** count squares rather than find the max, and cells must share a colour rather than be `'1'`. The count is the **sum** of all `side[i][j]` (a square of side s ending at (i, j) contains s squares ending there). Only extend when the neighbours have the same character. **Follow-up of #507.**
  - [#43 Find the Longest Straight Run of One Color](problems/043-find-the-longest-straight-run-of-one-color.md) *(inferred)* — **Differs:** straight lines instead of squares. Keep 4 counters per cell (left, up, up-left, up-right), and each extends its predecessor in that direction if the colour matches. **Same concept, different setting.**

#### Memoised DFS on a grid — longest path where the move rule makes the state space acyclic
- **Anchor:** [#430 Find the Longest Strictly Increasing Cardinal Matrix Path](problems/430-find-the-longest-strictly-increasing-cardinal-matrix-path.md) — a strictly increasing path can't revisit a cell, so `f(cell) = 1 + max f(bigger neighbour)` with memo, O(mn). No visited set needed.
- **Variants:**
  - [#155 Find the Longest Momentum-Aware Water Path](problems/155-find-the-longest-momentum-aware-water-path.md) — **Differs:** equal/downhill moves are allowed, so revisits are possible. Uphill depends on the height two cells back. State becomes `(prev, cur, visited_mask)` on a small grid (bitmask DP / DFS). **Same concept, harder state.**

#### Two-sequence / string DP — state `(i, j)` = "how much of each string have I consumed?"
- **Anchor:** [#416 Count Position-Distinct Subsequences Matching a Target](problems/416-count-position-distinct-subsequences-matching-a-target.md) — cleanest two-string DP: `dp[i][j] += dp[i-1][j-1]` when the characters match, plus always `dp[i-1][j]` (skip the source char). A 1-D roll needs `j` to go **descending**.
- **Variants:**
  - [#60 Match an Entire String with Dot and Star](problems/060-match-an-entire-string-with-dot-and-star.md) — **Differs:** boolean, and pattern `x*` gives two transitions: zero copies (`dp[i][j-2]`) or one more copy if `x` matches `s[i-1]` (`dp[i-1][j]`). Initialise row 0 for patterns like `a*b*`. **Same concept, harder transitions.**
  - [#476 Recognize Recursive Split-and-Swap String Transformations](problems/476-recognize-recursive-split-and-swap-string-transformations.md) — **Differs:** compares *substrings of equal length*, so state is `(i, j, len)` and you try every split point with and without swap. Memo plus a char-count prune. Effectively interval DP on two strings. **Same concept, different setting.**

#### Interval DP — `dp[l][r]` and "which element is handled *last* in this range?"
- **Anchor:** [#508 Maximize Coins from Bursting All Balloons](problems/508-maximize-coins-from-bursting-all-balloons.md) — think of the balloon burst **last** in `(l, r)`. Its neighbours are then the fixed boundaries `l` and `r`, so the subproblems separate. Pad with 1s and loop by increasing length.
- **Variants:**
  - [#482 Maximize the Score from Removing Equal-Color Runs](problems/482-maximize-the-score-from-removing-equal-color-runs.md) — **Differs:** the score depends on how many equal boxes are glued together, so the state is `(l, r, k)` with k = equal boxes attached to the right of r. Either remove the run now, or merge with an earlier equal box at `m` by clearing `(m+1, r-1)` first. **Same concept, extra dimension.**

#### Knapsack / subset — state = (items considered, remaining capacity/needs)
- **Anchor:** [#95 Optimize 0/1 to bounded knapsack DP](problems/095-optimize-0-1-to-bounded-knapsack-dp.md) — the textbook 0/1 knapsack `dp[i][w]`, the 1-D optimisation (descending w), reconstruction by walking back, and the bounded version (binary-split the copies or loop count).
- **Variants:**
  - [#519 Buy Exact Item Quantities Using Reusable Bundles](problems/519-buy-exact-item-quantities-using-reusable-bundles.md) — **Differs:** the "capacity" is a vector of needs, and bundles are unbounded. Memoise on the `tuple(needs)`. Transitions = apply any bundle that doesn't overshoot, or buy the rest at unit price. **Same concept, multi-dimensional capacity.**

#### Mod-3 token lanes (Google favourite, 4 copies) — split into independent residue classes, then greedy per lane
- **Anchor:** [#20 Maximize coins with tokens moving by +3](problems/020-maximize-coins-with-tokens-moving-by-plus3.md) — a +3 move keeps `index % 3`, so solve 3 independent chains. In a chain, tokens can't cross, and the leftmost token can sweep every coin to its right. → really Greedy / Math (mod-class decomposition), not DP.
- **Variants:**
  - [#146 Maximize coins collected by tokens jumping +3](problems/146-maximize-coins-collected-by-tokens-jumping-plus3.md) — **Differs:** same rules and wording. **Near-duplicate of #20.**
  - [#188 Compute max coins with 3-step token moves](problems/188-compute-max-coins-with-3-step-token-moves.md) — **Differs:** same rules. **Near-duplicate of #20.**
  - [#321 Maximize coins collected by 3-step pieces](problems/321-maximize-coins-collected-by-3-step-pieces.md) — **Differs:** "pieces" instead of tokens, and the card spells out compressing a lane into consecutive slots. **Near-duplicate of #20.**

### Other Dynamic Programming problems
- [#212 Find Maximum Envelope Nesting](problems/212-find-maximum-envelope-nesting.md) *(inferred)* — sort by width ascending and height **descending** on ties, then LIS on heights with binary search (patience sorting) in O(n log n). The descending tie-break prevents equal widths from nesting.
- [#72 Check Whether Two Ordered Sequences Can Be Merged](problems/072-check-whether-two-ordered-sequences-can-be-merged.md) — consecutive pairs from each sequence become edges, and the sequences can be merged iff the graph has no cycle. → really Graph (topological sort / cycle detection).
- [#94 Check if all substrings are dictionary words](problems/094-check-if-all-substrings-are-dictionary-words.md) — every substring of length ≥3 must be a dictionary word: enumerate the O(n²) substrings (or extend from each start with an early exit). → really String Processing (brute-force enumeration). The hints about subsequences don't fit the stated task.
- [#210 Find Dictionary Matches for a Jammed String](problems/210-find-dictionary-matches-for-a-jammed-string.md) *(inferred)* — run-length encode words into (skeleton, counts) and bucket by skeleton. A word matches if every one of its counts ≤ the query's count (adjust for the "stretch" rule). → really String Processing / Hashing.

---

## Backtracking

**Recognise it when:**
- "Return **all** combinations / permutations / subsets / partitions / boards", meaning the output itself is exponential.
- Small n (≤ 10–20), or a target sum with small candidates. Fill a fixed structure (9×9 Sudoku, n×n board).
- "No duplicate answers" while the input has duplicates means sort + skip equal siblings.
- Constraint satisfaction: place items so that no two conflict (queens, flowers, Sudoku digits).
- If it only asks for the *count* or *min/max*, check DP first. Backtracking is for *enumerating* or for very small inputs.

**Core idea:** Build the answer one decision at a time (choose), recurse on the rest (explore), then undo the decision (unchoose) so the same buffer is reused. Prune as early as possible: an invalid partial state means none of its completions can be valid, so cut it. To avoid duplicates, decide **what a level of recursion represents** (the next element to include, or the next position to fill) and never let two siblings make an identical choice.

**Skeleton:**
```python
def backtrack(start, path, state):
    if is_complete(state):
        out.append(path[:])            # copy!
        return
    for i in range(start, len(cands)):
        if i > start and cands[i] == cands[i-1]:
            continue                    # skip duplicate siblings (cands sorted)
        if not feasible(state, cands[i]):
            continue                    # or `break` if cands sorted and infeasible from here on
        path.append(cands[i]); apply(state, cands[i])      # choose
        backtrack(next_start(i), path, state)               # explore (i: reuse allowed, i+1: single use)
        path.pop(); undo(state, cands[i])                   # unchoose
```

**Pitfalls:**
- Appending `path` instead of `path[:]` means every answer ends up as the same mutated list.
- Mixing up the dedupe rules: `i > start` (skip equal *siblings*) vs a `used[]` check for permutations (`skip if nums[i]==nums[i-1] and not used[i-1]`).
- Reuse vs single use is the whole difference between combination-sum I and II: recurse with `i` vs `i+1`.
- Forgetting to undo state (row/col/box sets, counts), which silently corrupts other branches.

### Clusters

#### Pick from a candidate list (subsets / combinations / permutations) — one template, different recursion arguments and dedupe rules
- **Anchor:** [#85 Enumerate Reusable-Value Target Combinations](problems/085-enumerate-reusable-value-target-combinations.md) — combination sum with unlimited reuse. Recurse with `start=i` so values can repeat, and prune when the remainder < 0 (or `break` once sorted).
- **Variants:**
  - [#253 Enumerate Target Combinations with Single-Use Occurrences](problems/253-enumerate-target-combinations-with-single-use-occurrences.md) — **Differs:** each occurrence used once and the input has duplicates. Sort, recurse with `i+1`, skip `cands[i]==cands[i-1]` when `i>start`. **Follow-up of #85.**
  - [#454 Enumerate Every Fixed-Size Choice from a Range](problems/454-enumerate-every-fixed-size-choice-from-a-range.md) — **Differs:** no target. Stop at size k. Prune when there aren't enough numbers left (`n - i + 1 < k - len(path)`). **Same concept, simpler.**
  - [#496 Generate all subsets (handle duplicates)](problems/496-generate-all-subsets-handle-duplicates.md) *(inferred)* — **Differs:** record *every* node of the recursion tree, not only leaves. Same sorted-sibling skip as #253. **Same concept, different output.**
  - [#351 Generate Distinct Permutations with Repeated Values](problems/351-generate-distinct-permutations-with-repeated-values.md) — **Differs:** order matters, so there's no `start` index. Use `used[]` (or a counter of values) and skip equal values at the same depth. **Same concept, permutation version.**

#### Fill positions one at a time from per-position choices — depth = output position
- **Anchor:** [#250 Enumerate Telephone-Keypad Letter Choices](problems/250-enumerate-telephone-keypad-letter-choices.md) — each digit has a fixed letter set, depth = digit index, output size = product of the set sizes. The cleanest "fill slot k" example.
- **Variants:**
  - [#228 Generate Every Ordered Sum Using Ones and Twos](problems/228-generate-every-ordered-sum-using-ones-and-twos.md) *(inferred)* — **Differs:** the choices are `'1'`/`'2'`, limited by the remaining sum, and the length varies. Try `'1'` before `'2'` to get lexicographic order for free. The *count* of these strings is #323 (Fibonacci). **Same concept, different setting.**

#### Constraint placement on a board — place one item per row/cell and keep O(1) conflict sets
- **Anchor:** [#296 List All Nonattacking Queen Boards](problems/296-list-all-nonattacking-queen-boards.md) — N-queens: one queen per row, with sets for columns, `r-c` and `r+c` diagonals. The template for "place and check conflicts in O(1)".
- **Variants:**
  - [#110 Solve Flower Placement and Directory Deletion](problems/110-solve-flower-placement-and-directory-deletion.md) *(inferred)* — **Differs:** one flower per row with distinct columns, rocks block cells, and only *adjacent rows* can't be in adjacent columns (so only the previous row's column needs checking). Return the first valid placement. Part 2 (directory deletion) is a tree DFS / post-order delete. **Same concept, weaker constraint.**
  - [#252 Complete a Uniquely Solvable Sudoku Board in Place](problems/252-complete-a-uniquely-solvable-sudoku-board-in-place.md) — **Differs:** fill empty cells with digits 1–9 using row/col/box sets (box = `(r//3)*3 + c//3`). Stop at the first solution (return True up the stack). Pick the most-constrained cell first for speed. **Same concept, bigger board.**

#### Partition into valid groups — cut the input into pieces where each piece passes a check
- **Anchor:** [#455 Enumerate All Contiguous Palindrome Cut Choices](problems/455-enumerate-all-contiguous-palindrome-cut-choices.md) — choose the end of the next palindrome piece, recurse on the rest. Precompute `isPal[i][j]` with a DP so each check is O(1).
- **Variants:**
  - [#81 Determine if a 14-tile hand is winning](problems/081-determine-if-a-14-tile-hand-is-winning.md) — **Differs:** the input is a multiset (a tile count array 1–9), not a string. Pick the pair first, then repeatedly remove the *smallest* remaining tile as a triplet or a run. Always taking the smallest tile makes the search almost linear. **Same concept, multiset setting.**

---

## Greedy

**Recognise it when:**
- An exchange argument works: "if an optimal answer did X instead of the greedy choice, swapping it can't make things worse."
- Reachability or frontier questions: "can you reach the end", "furthest you can get".
- Single-pass optimisation over time series: "best buy/sell", "sum of every gain".
- Scheduling with counts or cooldowns: "most frequent first" (heap).
- Uniform item sizes in a knapsack-looking problem, where the knapsack becomes "take the most valuable first".

**Core idea:** Make the locally best choice and prove it's never worse than any alternative, usually with an exchange argument or an invariant like "the reachable set is a prefix". Greedy solutions are short. The proof is what the interviewer wants. If you can't argue it, fall back to DP.

**Skeleton:**
```python
def greedy(items):
    items.sort(key=priority)          # or use a heap for a changing "best next"
    state, answer = INIT, 0
    for x in items:                   # one pass; each step commits irrevocably
        if can_take(state, x):
            state = update(state, x)
            answer = improve(answer, x)
        elif must_stop(state, x):
            break
    return answer
```

**Pitfalls:**
- Picking a plausible greedy without a proof. Test it on a tiny counterexample (e.g. coin change with odd denominations).
- Tie-breaking and order details (task-scheduler label order, text-justification left-biased extra spaces, last line left-justified).
- Overflow with huge capacities/counts (#3 has capacity up to 1e9, so loop over item types, never over capacity units).

### Clusters

#### Stock trading in one pass — track the best earlier state, or add up every gain
- **Anchor:** [#414 Maximize One Chronological Stock Transaction](problems/414-maximize-one-chronological-stock-transaction.md) — one transaction: keep the minimum price so far and maximise `price - min_so_far`.
- **Variants:**
  - [#324 Maximize Repeated One-Share Stock Trading Profit](problems/324-maximize-repeated-one-share-stock-trading-profit.md) — **Differs:** unlimited transactions, so the answer is the sum of every positive `p[i]-p[i-1]` (each upswing is captured). With a fee, a cooldown or at most k trades, greedy fails and you need a DP state machine `hold/free[i][k]`. **Follow-up of #414.**

### Other Greedy problems
- [#120 Determine Whether the Last Array Index Is Reachable by Forward Jumps](problems/120-determine-whether-the-last-array-index-is-reachable-by-forward-jumps.md) — the reachable indices always form a prefix. Track `furthest = max(furthest, i + nums[i])` and fail if `i > furthest`.
- [#3 Maximum Value from Unit-Weight Items with Limited Copies Under a Capacity](problems/003-maximum-value-from-unit-weight-items-with-limited-copies-under-a-capacity.md) — every item weighs 1, so knapsack becomes "sort item types by value desc, take copies until capacity runs out". Exchange argument, and use 64-bit sums. Contrast with #95.
- [#96 Remove elements to avoid k-prefix duplicates](problems/096-remove-elements-to-avoid-k-prefix-duplicates.md) — keep the *earliest* k elements of listB that aren't in `set(listA[:k])`, delete forbidden ones seen before that, keep everything after. Follow-up: a sliding window union over the last d lists with a frequency map.
- [#148 Compute minimal transfers to settle group expenses](problems/148-compute-minimal-transfers-to-settle-group-expenses.md) — net each person's balance (in cents), then match debtors and creditors. Greedy matching gives ≤ n−1 transfers. The *true* minimum needs backtracking/bitmask DP over the non-zero balances (find zero-sum subgroups).
- [#254 Justify Greedy Lines to an Exact Width](problems/254-justify-greedy-lines-to-an-exact-width.md) — pack as many words per line as fit, spread spaces with the remainder going to the left gaps, and left-justify the last line. → really String / Simulation.
- [#281 Rearrange Tasks With Cooldown](problems/281-rearrange-tasks-with-cooldown.md) *(inferred)* — max-heap by remaining count plus a cooldown queue (or the formula `(maxCount-1)*(n+1) + #tasks with maxCount`). Watch the tie-break by label. → also Heap / Top-K.

---

## Math / Number Theory

**Recognise it when:**
- "Without converting to string", "without multiply/divide/mod", "within signed 32-bit": digit peeling and overflow guards.
- Huge bounds (n up to 1e9–1e18) with a simple property means there's a formula or digit DP, not iteration.
- Numbers given as digit lists/strings: column arithmetic with a carry.
- Primes, factors, gcd, "only prime factors 2, 3, 5", "trailing zeros".
- Points/slopes with "exact" means normalise with gcd instead of using floating point.

**Core idea:** Turn the property into arithmetic on digits or prime factors. `n % b` gives the last base-b digit and `n // b` drops it. Carries handle addition. Counting up to a huge N works one digit position at a time (high/cur/low split, or digit DP with a `tight` flag). Overflow is avoided by checking *before* you multiply or add (`res > (MAX - d) // 10`).

**Skeleton:**
```python
def digits_op(n, base=10):
    neg, n = n < 0, abs(n)
    acc = 0
    while n:
        n, d = divmod(n, base)          # peel least-significant digit
        if acc > (LIMIT - d) // base:   # overflow guard BEFORE acc*base + d
            return OVERFLOW
        acc = acc * base + d            # or: check property / accumulate per digit
    return -acc if neg else acc
```

**Pitfalls:**
- Negatives: Python's `%` and `//` round toward −∞. Use `abs()` or `math.fmod` / `int(a/b)` for truncation toward zero.
- INT_MIN edge cases (`-2^31 / -1`, `abs(-2^31)`, `pow(x, -2^31)`).
- One-based systems (spreadsheet columns have no zero digit, so subtract 1 before each divmod).
- Floating point slopes in geometry. Use reduced `(dy, dx)` with a sign convention.

### Clusters

#### Digit peeling — `n % 10` / `n // 10` to test or rebuild a number
- **Anchor:** [#23 Check a Decimal Integer for Symmetry](problems/023-check-a-decimal-integer-for-symmetry.md) — palindrome number. Negatives are false. Reverse only the second half (stop when `rev >= n`) to avoid overflow.
- **Variants:**
  - [#183 Check Digits and Combine Ranges](problems/183-check-digits-and-combine-ranges.md) — **Differs:** part 1 is the same palindrome check. Part 2 is merging overlapping ranges (sort by start, extend the end). **Near-duplicate of #23** plus an intervals task.
  - [#103 Reverse Decimal Digits Within Signed 32-Bit Limits](problems/103-reverse-decimal-digits-within-signed-32-bit-limits.md) — **Differs:** rebuild the full reversed number, and you must detect 32-bit overflow *before* `rev*10 + d` without 64-bit storage. **Follow-up of #23.**
  - [#87 Check Whether Digits Are Monotone Increasing](problems/087-check-whether-digits-are-monotone-increasing.md) *(inferred)* — **Differs:** reading right to left, the digits must be non-increasing. Start `prev = 10` as a sentinel. **Same concept.**
  - [#438 Reduce a Decimal Integer to One Digit](problems/438-reduce-a-decimal-integer-to-one-digit.md) — **Differs:** repeat the digit sum until one digit remains, or O(1) digital root `1 + (n-1) % 9` (0 → 0). **Same concept, plus a closed form.**
  - [#423 Recognize Digit-Square Sequences That Reach One](problems/423-recognize-digit-square-sequences-that-reach-one.md) — **Differs:** the sum of squared digits repeats, so you need cycle detection (seen set, or Floyd's fast/slow pointers). **Same concept, plus cycle detection.**

#### Column arithmetic on digit sequences — walk from the least significant end with a carry
- **Anchor:** [#173 Add two big integers from digit lists](problems/173-add-two-big-integers-from-digit-lists.md) — digit lists (or linked lists) LSB-first: sum digits plus carry, append `s % 10`, carry `s // 10`, and don't drop the final carry.
- **Variants:**
  - [#411 Add Two Binary Digit Strings](problems/411-add-two-binary-digit-strings.md) — **Differs:** base 2 and strings MSB-first, so iterate from the ends with two pointers. **Same concept, base 2.**
  - [#234 Solve several coding interview problems](problems/234-solve-several-coding-interview-problems.md) *(inferred)* — **Differs:** a multi-part set. One part is adding big numbers stored as strings (same as #173). Part 1 restores IP addresses (backtracking over four 1–3 digit segments, no leading zeros, ≤255). Other parts are ancestor-chain intersection and geometric overlap. **Same concept, mixed bag.**

#### Base conversion — repeated divmod by the base
- **Anchor:** [#481 Write an Integer Using Base Seven Digits](problems/481-write-an-integer-using-base-seven-digits.md) — base 7: divmod by 7, collect remainders, reverse, and add the sign only for negatives (0 → "0").
- **Variants:**
  - [#537 Decode Uppercase Spreadsheet Column Titles](problems/537-decode-uppercase-spreadsheet-column-titles.md) — **Differs:** the reverse direction (title → number: `acc = acc*26 + (ch-'A'+1)`), and it's *bijective* base 26 (A=1…Z=26, no zero digit). **Same concept, one-based digits.**

#### Prime factors — divide out the allowed primes, or count how many times a prime divides
- **Anchor:** [#466 Recognize Positive Numbers with Only Three Allowed Prime Factors](problems/466-recognize-positive-numbers-with-only-three-allowed-prime-factors.md) — divide out 2, 3, 5 while possible. The number is ugly iff what's left is 1 (n ≤ 0 → false).
- **Variants:**
  - [#465 Generate the One-Based Sequence of Ugly Numbers](problems/465-generate-the-one-based-sequence-of-ugly-numbers.md) — **Differs:** generate the nth ugly number instead of testing one. Use three pointers into the result list, each multiplying by 2/3/5, take the min and advance *every* pointer that ties (to avoid duplicates). **Follow-up of #466.**
  - [#469 Recognize Powers of Three without Iteration](problems/469-recognize-powers-of-three-without-iteration.md) — **Differs:** a single prime with no loop: the largest 32-bit power of 3 is 3^19 = 1162261467, so n > 0 and `3^19 % n == 0`. **Same concept, closed form.**
  - [#381 Count Decimal Zeros at the End of a Factorial](problems/381-count-decimal-zeros-at-the-end-of-a-factorial.md) — **Differs:** count factors of 5 in n! (`sum n // 5^k`) because 2s are always more plentiful. **Same concept, counting.**

#### Count over all numbers ≤ N by digit position — digit DP / positional counting
- **Anchor:** [#462 Count Decimal One Digits up to a Bound](problems/462-count-decimal-one-digits-up-to-a-bound.md) — for each position, split N into `high | cur | low` and add the contribution of a 1 there (`cur == 0`, `== 1`, `> 1` cases).
- **Variants:**
  - [#168 Count Good Numbers up to a Limit](problems/168-count-good-numbers-up-to-a-limit.md) — **Differs:** the property is structural (non-zero, unique digits, no valley), so you need full digit DP with state `(pos, tight, started, used_mask, last_two)`. N ≤ 1e18 but there are at most 9 usable digits. **Same concept, general digit DP.**

#### Doubling — build the answer from powers of two in O(log n)
- **Anchor:** [#223 Evaluate a Floating Base to an Integer Power](problems/223-evaluate-a-floating-base-to-an-integer-power.md) — fast exponentiation: square the base and halve the exponent, a negative exponent means `1/x`, and take care with `n = -2^31`.
- **Variants:**
  - [#294 Compute a Quotient Using Signed 32-Bit Operations](problems/294-compute-a-quotient-using-signed-32-bit-operations.md) — **Differs:** divide without `*` `/` `%`. Subtract the largest `divisor << k` that fits (or work in negatives to stay within 32 bits). The overflow case is `-2^31 / -1`. **Same concept, applied to division.**

### Other Math / Number Theory problems
- [#206 Select a Permutation by Its Lexicographic Rank](problems/206-select-a-permutation-by-its-lexicographic-rank.md) — factorial number system: with k zero-based, digit = `k // (n-1)!` picks from the remaining digits. O(n²) and no enumeration (compare #351).
- [#348 Count Collinear Points with Exact Integer Directions](problems/348-count-collinear-points-with-exact-integer-directions.md) — for each anchor point, hash the reduced direction `(dy/g, dx/g)` with a sign convention and handle duplicate points. Best count + 1. O(n²).
- [#382 Count Primes Strictly before an Integer Bound](problems/382-count-primes-strictly-before-an-integer-bound.md) — Sieve of Eratosthenes. Start marking at `p*p` and stop at `p*p >= n`. "Strictly less than n".
- [#415 Generate the First Rows of Pascal Coefficients](problems/415-generate-the-first-rows-of-pascal-coefficients.md) — each row comes from adjacent sums of the previous row. → really DP (1-D, row by row). `C(n, k)` connection.
- [#56 Determine validity after digit-constrained deletions](problems/056-determine-validity-after-digit-constrained-deletions.md) — every digit v must delete v earlier parentheses, and the remaining parentheses must be balanced. Scan left to right with a balance and a deletion budget, and spend deletions greedily on parentheses that hurt the balance. → really Greedy / Stack.

---

## Bit Manipulation

**Recognise it when:**
- "Every element appears twice/three times except one", "O(1) extra space".
- XOR of ranges or subarrays, "equal XOR". Prefix XOR works like prefix sums (`x ^ x = 0`).
- "Count set bits", "power of two", toggling flags, small sets (n ≤ 20) stored as a mask.
- Signed 32-bit details in Python: you need masking with `0xFFFFFFFF` and a sign fix.

**Core idea:** XOR is its own inverse and commutative, so pairs cancel and order doesn't matter. When things repeat k times, count each bit position mod k. `x & (x-1)` clears the lowest set bit and `x & -x` isolates it. Prefix XOR turns "XOR of a[i..j] == 0" into "prefix[i] == prefix[j+1]".

**Skeleton:**
```python
acc = 0
for x in nums: acc ^= x                      # pair cancellation
bits = [0]*32
for x in nums:
    for b in range(32): bits[b] += (x >> b) & 1   # per-bit counting (mod k)
while x: x &= x - 1; cnt += 1                # pop count by clearing lowest bit
sub = mask
while sub: visit(sub); sub = (sub - 1) & mask  # iterate submasks
```

**Pitfalls:**
- In Python, negative numbers have infinite sign bits. Mask to 32 bits and convert back (`r - (1<<32)` if bit 31 is set).
- Operator precedence: `x & 1 == 0` parses as `x & (1 == 0)`. Add parentheses.
- Reaching for bits when a hash set is clearer. Use bits when the problem asks for O(1) space.

### Clusters

#### XOR cancellation and per-bit counting — the shared idea is that matching occurrences cancel to 0
- **Anchor:** [#325 Recover the Value Left after Pair Cancellation](problems/325-recover-the-value-left-after-pair-cancellation.md) — every value appears twice except one. XOR everything and the pairs cancel.
- **Variants:**
  - [#377 Recover a Signed Value among Threefold Repetitions](problems/377-recover-a-signed-value-among-threefold-repetitions.md) — **Differs:** values appear **three** times, so XOR no longer cancels. Count each of the 32 bits mod 3 (or the `ones/twos` state machine), then sign-fix bit 31 in Python. **Follow-up of #325.**
  - [#170 Solve order-statistics and XOR-triplet problems](problems/170-solve-order-statistics-and-xor-triplet-problems.md) *(inferred)* — **Differs:** part 2 counts XOR triplets. `a == b` ⇔ the XOR of `arr[i..k]` is 0 ⇔ `prefix[i] == prefix[k+1]`, and each such pair gives `k - i` triplets (track count and index-sum per prefix value). Part 1 (count smaller to the right) → really Fenwick tree / merge sort. **Same concept, prefix-XOR setting.**

### Other Bit Manipulation problems
- [#421 Count Set Bits in a Positive Signed Integer](problems/421-count-set-bits-in-a-positive-signed-integer.md) — clear the lowest set bit until zero (`n & (n-1)`), and for repeated calls use a 256-entry byte table to sum 4 lookups.

---

## Randomized / Probability

**Recognise it when:**
- "Uniformly at random", "every permutation equally likely", "given only rand(a, b)".
- "Expected value", "minimise expected remaining candidates", weighted distributions.
- A stream of unknown length means reservoir sampling. Weighted pick means prefix sums plus binary search.

**Core idea:** Prove uniformity by counting. Each step must pick among the remaining options with equal probability, so the product of the probabilities is the same for every outcome. For expected-value problems, partition the outcomes by what you'd observe, then score each partition by its probability × its size.

**Skeleton:**
```python
import random
def reservoir(stream, k):               # generic: k uniform samples from a stream
    res = []
    for i, x in enumerate(stream):
        if i < k: res.append(x)
        else:
            j = random.randint(0, i)    # inclusive
            if j < k: res[j] = x
    return res
```

**Pitfalls:**
- Off-by-one in the random range (`randint` is inclusive). Drawing j from the *whole* array on every swap gives a biased shuffle (n^n outcomes aren't a multiple of n!).
- Floating point comparisons when choosing the best expected score. Compare fractions with a common denominator, or use a strict `<` with a stated tie-break.

### Other Randomized / Probability problems
- [#161 Shuffle array using random integer API](problems/161-shuffle-array-using-random-integer-api.md) — Fisher–Yates: for i from n−1 down to 1, swap `a[i]` with `a[rand(0, i)]`. Uniform because each position's choice is uniform over the remaining cards.
- [#289 Choose optimal guesses for green-only Wordle](problems/289-choose-optimal-guesses-for-green-only-wordle.md) *(inferred)* — for each candidate guess, group answers by green-feedback bitmask and score `Σ P(mask) · |bucket|`, then keep the min (lexicographic tie-break). → also Hashing / Bitmask.

---

## Cross-pattern links
- **Count vs enumerate:** #323 (count 1/2-step climbs → DP) and #228 (list them → backtracking) share the same recurrence. #412/#397 (count segmentations) vs #455 (list palindrome partitions, using a DP `isPal` table). When the problem only asks for a number, look for overlapping subproblems.
- **Memoised DFS = DP on a graph:** #430 (strictly increasing makes it a DAG, so memo on the cell). #155 adds `prev + visited bitmask` to the state. #72 is topological sort / cycle detection (Graph family).
- **Sort, then DP / binary search:** #212 envelopes = sort with a tie trick + LIS via `bisect` (Sorting / Binary Search family).
- **Greedy vs DP decision:** #414/#324 stock greedy breaks once you add a fee, cooldown or k trades (use a DP state machine). #3 (unit weights → greedy) vs #95 (arbitrary weights → knapsack DP). #148 greedy matching vs exact minimum by backtracking/bitmask DP.
- **Math meets DP:** #462 and #168 digit DP. #415 Pascal is DP and #272 grid paths = `C(m+n-2, m-1)`. #20 family is mod-class decomposition (Math) followed by a greedy sweep.
- **Bits meet Math:** #377 counts bits mod 3. #170 prefix XOR mirrors prefix-sum + hashmap counting (Prefix Sum / Hashing family), and its part 1 is Fenwick tree / merge-sort counting.
- **Factorial number system vs enumeration:** #206 jumps straight to the k-th permutation, while #351 enumerates all of them.
- **Outside the family:** #281 Heap / Top-K, #183 part 2 Intervals / Sweep Line, #94 and #210 String Processing / Hashing, #56 Stack / Parsing, #110 part 2 Tree DFS, #289 bitmask bucketing + Hashing, #234 mixes backtracking (IP restore) with big-int strings (#173).

## Must-do anchors (DP, search & math)
1. **#20 Maximize coins with tokens moving by +3** — Google's most repeated problem here (4 copies). Trains spotting invariants (mod classes) and decomposing into independent subproblems.
2. **#73 Longest Non-Decreasing Subarray After One Replacement** — asked twice. Trains the "run ending at i / starting at i" precomputation and joining across one change.
3. **#459 Maximize a Nonadjacent Selection around a Circle** — take/skip state DP, and turning a circle into two linear ranges.
4. **#412 Count Complete Digit-to-Letter Decodings** — counting-ways DP with validity guards and the classic zero edge cases.
5. **#95 Optimize 0/1 to bounded knapsack DP** — knapsack state, 1-D descending loop, reconstruction, bounded copies.
6. **#507 Measure the Largest All-One Square Area** — grid DP from neighbours. Extends directly to #147 (count) and #43 (lines).
7. **#60 Match an Entire String with Dot and Star** — two-string DP with tricky transitions and base rows.
8. **#430 Find the Longest Strictly Increasing Cardinal Matrix Path** — memoised DFS as DP on an implicit DAG.
9. **#508 Maximize Coins from Bursting All Balloons** — interval DP and the "last action splits the range" trick.
10. **#85 / #253 Combination sum (reuse vs single-use)** — the backtracking template, `i` vs `i+1`, sorted sibling dedupe (covers #454, #496, #351).
11. **#296 List All Nonattacking Queen Boards** — constraint placement with O(1) conflict sets (covers #252, #110).
12. **#377 Recover a Signed Value among Threefold Repetitions** — per-bit counting mod k plus Python sign handling (covers #325).

---

# NeetCode 150: hard problems

All 21 hard problems from NeetCode 150, mapped onto the patterns above. Solve them on LeetCode, which runs your code. **Near-duplicate** rows are practice for a PracHub problem you've already met. The rest add something the PracHub set covers thinly, and Reconstruct Itinerary (Eulerian path) is entirely new.

| Problem | Pattern | Closest PracHub | How it relates |
|---|---|---|---|
| [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) | Two Pointers | #62, #13 | Water above i = min(max left, max right) − h[i]. Two pointers: move the side whose running max is smaller, because that side's water level is already fixed. #62 also moves the shorter side inward, but it maximises one container instead of summing water per column. #13's monotonic stack gives a layer-by-layer alternative. |
| [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) | Sliding Window | #268 | **Near-duplicate of #268.** Need-counter plus a `formed` count: expand right until every requirement is met, then shrink left while it still holds, recording the best window. |
| [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) | Sliding Window | #26, #13 | Fixed window like #26, but only the maximum is needed. Keep a deque of indices whose values are decreasing: pop smaller values from the back before pushing, and pop expired indices from the front. The front is the window max, in O(n) total instead of heaps. |
| [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) | Monotonic Stack | #13, #33 | Uses #13's next-smaller machinery on **both** sides. Each bar's widest rectangle spans from its previous-smaller to its next-smaller index. An increasing stack finds both in one pass: popping a bar means its right boundary is found, and the new stack top is its left boundary. |
| [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) | Binary Search | #27, #5 | **Near-duplicate of #27.** Binary-search a cut in the shorter array so that both left parts together hold half the elements and max(left) ≤ min(right). Then the median comes from the four boundary values. O(log min(m, n)). |
| [Merge K Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) | Heap / Top-K | #5 | k-way merge, a sibling of #5's order statistics across sorted inputs. Keep a min-heap of (value, list index, node) holding each list's current head; pop the smallest and push its successor, O(N log k). Pairwise divide-and-conquer merging is the alternative without a heap. Add the list index as a tie-breaker, because nodes can't be compared. |
| [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/) | Linked List | #251, #506 | **Near-duplicate of #251.** Run #506's pointer-reversal loop on each full block of k nodes, reconnecting each block through a dummy head and the previous block's tail. Check that k nodes remain before reversing. |
| [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) | Tree Traversal / BST | #354, #372 | A post-order "return a summary" problem, like #372 and the #354 diameter template. Each node returns its best downward chain, clamped at 0 so negative branches are dropped. The answer is updated at every node with left + node + right. |
| [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) | Tree Traversal / BST | #305 | #305 rebuilds from two traversals and needs distinct values. Here a **single** preorder with null markers is enough, because the markers fix the shape. Deserialize recursively from an iterator. Level-order with nulls also works. |
| [Word Search II](https://leetcode.com/problems/word-search-ii/) | Trie | #91, #355 | #91 walks a trie along 1-D text. Here you DFS the grid **while** walking the trie: stop when no child matches, mark found words and delete exhausted branches so they aren't reported twice, and restore visited cells on backtrack. |
| [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) | Heap / Top-K | #216 | **Near-duplicate of #216.** Use a max-heap for the lower half and a min-heap for the upper half. After each insert, rebalance so the sizes differ by at most 1. |
| [N-Queens](https://leetcode.com/problems/n-queens/) | Backtracking | #296 | **Near-duplicate of #296.** Place one queen per row, with O(1) conflict checks using sets for columns, diagonals (r − c) and anti-diagonals (r + c). |
| [Word Ladder](https://leetcode.com/problems/word-ladder/) | Graph BFS / DFS | #388, #156 | The count-only version of #388. BFS by layers from the start word, using wildcard buckets (`h*t`) to find neighbours in O(L) lookups, and return the layer number when the end word is reached. No path reconstruction is needed. |
| [Reconstruct Itinerary](https://leetcode.com/problems/reconstruct-itinerary/) | Graph BFS / DFS | #142 | **A new concept not in the PracHub set: Eulerian path** (use every edge once). Hierholzer's algorithm: DFS that always takes the smallest remaining outgoing ticket (a sorted list or heap per airport). Append the airport only once its edges are used up, then reverse the result. |
| [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water/) | Shortest Path | #200, #360, #185 | **Same minimax path as #200**: a path's cost is its highest cell. Three ways to solve it: Dijkstra with `max` instead of `+`, binary search on the time plus a BFS reachability check, or Union-Find adding cells in increasing height until the corners connect. |
| [Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) | Topological Sort | #6, #67 | The new part is building the graph. Compare each adjacent pair of words: the first differing letters give one edge. If a longer word comes before its own prefix, the input is invalid. Then run Kahn's algorithm as in #6; a cycle means no valid order. Use a heap, as in #67, if the order must be deterministic. |
| [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/) | Dynamic Programming | #430 | **Near-duplicate of #430.** Memoised DFS: the strictly increasing rule makes the grid a DAG, so no visited set is needed. Each cell's answer is 1 plus the best answer among its larger neighbours. |
| [Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/) | Dynamic Programming | #416, #60 | Two-sequence DP like #416, but **counting** instead of optimising. dp[i][j] is the number of ways to form t[:j] from s[:i]. It always includes dp[i−1][j] (skip s[i−1]), plus dp[i−1][j−1] when the characters match (use it). Base case: dp[i][0] = 1. |
| [Burst Balloons](https://leetcode.com/problems/burst-balloons/) | Dynamic Programming | #508 | **Near-duplicate of #508.** Interval DP: pick which balloon in (l, r) is burst **last**. Its neighbours are then l and r, which splits the range into two independent subproblems. Pad the array with 1s at both ends. |
| [Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching/) | Dynamic Programming | #60 | **Near-duplicate of #60.** Two-string DP. When p[j] is followed by `*`, either skip the pair (zero copies) or consume one matching character of s and stay on the same pattern position. The base row handles patterns like `a*b*` matching an empty string. |
| [Minimum Interval to Include Each Query](https://leetcode.com/problems/minimum-interval-to-include-each-query/) | Intervals / Sweep Line | #260, #35 | Offline sweep: sort intervals by start and queries by value. For each query, push every interval with start ≤ q into a min-heap keyed by size, and pop those with end < q; the heap top is the answer. Related to #260's containing-range lookup, but this wants the *smallest* containing interval for many queries. Answer the queries in their original order. |
