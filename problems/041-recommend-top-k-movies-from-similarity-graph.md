# Recommend top-K movies from similarity graph
> Google · Onsite · medium · Pattern: Graph BFS / DFS
> Source: https://prachub.com/interview-questions/recommend-top-k-movies-from-similarity-graph

## Movie Recommendation: Top K

You are building a simple movie recommendation feature.

### Input
- A set of movies `0..(M-1)`.
- An **undirected** similarity graph `adj`, where `adj[i]` lists movies similar to movie `i`.
- An array `rating[i]` (or `score[i]`) for each movie.
- A starting movie `start` that the user liked.
- A set `watched` of movies the user has already watched.
- An integer `K`.

### Output
Return a list of up to `K` **recommended movie IDs** that the user has **not watched**.

### Ranking rules
1. Prefer movies with **smaller graph distance** (fewer similarity hops) from `start`.
2. If distances tie, prefer **higher `rating`**.
3. If still tied, break ties by **smaller movie ID**.

### Notes / constraints
- The graph can be large; avoid revisiting nodes.
- If fewer than `K` unwatched movies are reachable, return all reachable unwatched movies.

### Follow-up (production thinking)
What potential issues might arise when deploying this in production (e.g., caching, concurrency, hot keys, stale data), and how would you mitigate them?

<details><summary>Hints (spoiler)</summary>

1. Use BFS because every edge has the same cost, so BFS gives the shortest hop distance.
2. Process one BFS layer at a time. All movies found in the same layer have the same distance, so you only need to sort that layer by rating and movie ID.
</details>

<details><summary>Approach (spoiler)</summary>

The solution runs a **layered BFS** from `start`, exploiting the fact that BFS visits nodes in non-decreasing order of graph distance — which directly satisfies ranking rule 1 (closer movies first).

**Setup.** It guards the trivial cases (`k <= 0` or an out-of-range `start`) and builds `watched_set` for O(1) eligibility checks. A `visited` boolean array prevents revisiting nodes, which is essential because the graph may contain repeated/duplicate edges.

**Layer-by-layer traversal.** Instead of a flat BFS, the loop processes one *distance layer* at a time: it snapshots `level_size = len(q)` and dequeues exactly that many nodes. For each node it:
- adds it to `level_candidates` if it is eligible (`node != start` and not in `watched_set`), and
- pushes each unvisited neighbor, marking it visited on enqueue.

**Ranking within a layer.** All movies in one layer share the same distance, so ties are broken locally by sorting `level_candidates` with key `(-rating[movie], movie)` — higher rating first, then smaller ID (rules 2 and 3). These sorted candidates are appended to `answer`. Because layers are processed in increasing-distance order, concatenating them yields the globally correct order.

**Early stop.** The `while` checks `len(answer) < k` at the top of each layer, so it stops expanding once enough recommendations are collected, and `answer[:k]` trims any overflow from the final layer. Unreachable movies are never enqueued, so they're naturally excluded; if fewer than `k` are reachable, all of them are returned in order.

This is correct because BFS layering encodes distance and per-layer sorting encodes the secondary tie-breaks exactly as the problem specifies.

**Time:** O(V + E + V log V) · **Space:** O(V)
</details>
