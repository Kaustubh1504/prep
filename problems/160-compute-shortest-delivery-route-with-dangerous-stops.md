# Compute shortest delivery route with dangerous stops
> Google · Onsite · medium · Pattern: Shortest Path, Graph BFS / DFS
> Source: https://prachub.com/interview-questions/compute-shortest-delivery-route-with-dangerous-stops

## Delivery Route Planning With Dangerous Stops

You are given delivery stops (nodes) and a set of routes. Each route is a list of stops, and you can travel between **adjacent stops in the same route** (treat travel as an unweighted edge).

### Input
- `N`: number of stops labeled `0..N-1`.
- `routes`: a list of routes, where each route is a list like `[a, b, c, ...]` meaning edges `(a,b)`, `(b,c)`, ...
- `source`: starting stop.
- `target`: destination stop.
- `dangerous`: a set of stops considered dangerous.

### Part 1
Find the **minimum number of steps** from `source` to `target` **without visiting any dangerous stop**.
- If `source` or `target` is dangerous, treat that as invalid (return `-1`).
- Return `-1` if no such path exists.

### Part 2
Now you **may** pass through dangerous stops.
Among all paths from `source` to `target`:
1. Minimize the **number of dangerous stops visited** (count visits to dangerous nodes; clarify whether `source/target` count if they are dangerous).
2. Subject to (1), minimize the **number of steps**.

Return the minimum steps for the best path under the above ordering (or return both metrics if preferred—clarify with interviewer).

### Follow-up
Explain how you would change your `visited` structure to correctly handle Part 2 (e.g., when the same stop can be reached with fewer dangerous stops or fewer steps).

<details><summary>Hints (spoiler)</summary>

1. Convert each route into graph edges by connecting consecutive stops.
2. Because every edge has the same weight, breadth-first search is the right tool once you ignore dangerous stops.
</details>
