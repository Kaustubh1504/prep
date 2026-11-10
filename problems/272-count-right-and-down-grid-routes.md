# Count Right-and-Down Grid Routes
> Google · Other · medium · Pattern: Dynamic Programming, Math / Number Theory
> Source: https://prachub.com/interview-questions/count-right-and-down-grid-routes

### Problem

A rectangular grid contains `row_count` rows and `column_count` columns. Starting in its upper-left cell, count the routes that finish in its lower-right cell. A move advances by exactly one cell, either to the right or downward.

Return the number of distinct routes, rather than a particular route. Different orders of moves count separately. The supplied dimensions guarantee a result no larger than `2 * 10^9`.

### Examples

**Example 1**

```text
Input: row_count = 4, column_count = 3
Output: 10
```

Each route has three downward moves and two rightward moves. There are ten possible orders for those moves.

**Example 2**

```text
Input: row_count = 1, column_count = 5
Output: 1
```

With a single row, the only route moves right four times.

### Constraints

- `1 <= row_count <= 100`
- `1 <= column_count <= 100`
- The route count for the supplied grid is at most `2 * 10^9`.
