# Implement frequency + distance top‑K queries
> Google · Technical Screen · medium · Pattern: Heap / Top-K, Hashing / Counting, Design / Data Structure
> Source: https://prachub.com/interview-questions/implement-frequency-plus-distance-top-k-queries

You will implement solutions for two coding interview questions.

## Question 1: Return the top‑K points by frequency (with distance tie‑break)
You are given an array `points` of 2D integer points, where each point is represented as `[x, y]`. The array may contain duplicates (the same `[x, y]` can appear multiple times).

Define:
- `freq(p)` = number of times point `p` appears in the array.
- `dist(p)` = squared Euclidean distance to the origin, `x^2 + y^2`.

Return **`k` distinct points** sorted by the following priority:
1. Higher frequency first (`freq` descending)
2. If frequencies tie, smaller distance first (`dist` ascending)
3. If still tied, sort by `x` ascending, then `y` ascending

### Input
- `points`: list of length `n`, each element `[x, y]`
- `k`: integer, `1 <= k <= (# of distinct points)`

### Output
- A list of `k` distinct points following the ranking above.

### Constraints (typical interview assumptions)
- `1 <= n <= 2 * 10^5`
- `-10^4 <= x, y <= 10^4`

---

## Question 2: Time-based key-value store with “closest timestamp” lookup
Design a data structure supporting the following operations:

- `set(key, value, timestamp)`: store the string `value` for string `key` at integer `timestamp`.
  - Assume timestamps for the same `key` are inserted in **non-decreasing** order.
- `getClosest(key, timestamp) -> value or ""`:
  - If `key` has no stored values, return `""`.
  - Otherwise, return the `value` whose stored timestamp is **closest** to the query `timestamp`.
  - If there is a tie (equal distance to two timestamps), return the value with the **smaller** timestamp.

### Example
If for key `"a"` you stored timestamps `[2, 10, 15]` with values `["x", "y", "z"]`:
- `getClosest("a", 11)` returns `"y"` (10 is closest)
- `getClosest("a", 14)` returns `"z"` (15 is closest)
- `getClosest("a", 12)` returns `"y"` (10 and 15 are equally far; choose smaller timestamp)

### What to discuss
- Time and space complexity of your approach
- How you would improve a “naive” solution (e.g., linear scan) to a more optimal one

### Constraints (typical interview assumptions)
- Up to `2 * 10^5` total operations
- Keys and values are strings; timestamps are integers within typical 32-bit range

<details><summary>Hints (spoiler)</summary>

1. First count how many times each point appears. After that, each distinct point only needs to be ranked once.
2. Python can sort tuples directly, so think about building a sort key like `(-frequency, distance, x, y)`.
</details>
