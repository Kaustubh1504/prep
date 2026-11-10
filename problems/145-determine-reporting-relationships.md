# Determine Reporting Relationships
> Google · Technical Screen · medium · Pattern: Graph BFS / DFS, Union-Find
> Source: https://prachub.com/interview-questions/determine-reporting-relationships

Build an in-memory organization model that supports three operations on employee IDs:

1. `add_manager(a, b)`: employee `a` is the direct manager of employee `b`.
2. `add_peer(a, b)`: employees `a` and `b` share the same direct manager.
3. `is_manager(a, b)`: return whether employee `a` is a manager of employee `b`.

The answer should account for relationships that can be inferred from prior operations. For example, if `add_manager(m, x)` and `add_peer(x, y)` were previously recorded, then `is_manager(m, y)` should return `true`. You may assume the input is logically consistent and does not create invalid cycles in the org chart.

Explain how you would design the data structures and implement these operations efficiently.

<details><summary>Hints (spoiler)</summary>

1. `add_peer(a, b)` means `a` and `b` share one direct manager, but they are not interchangeable as managers. Group such employees with Union-Find.
2. Once a peer group learns its direct manager, every current member of that group gets the same parent pointer. To answer `is_manager(a, b)`, walk upward from `b` through parent pointers.
</details>
