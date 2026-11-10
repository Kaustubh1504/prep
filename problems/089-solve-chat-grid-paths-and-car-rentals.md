# Solve chat, grid paths, and car rentals
> Google · Technical Screen · medium · Pattern: Intervals / Sweep Line, Heap / Top-K, Dynamic Programming
> Source: https://prachub.com/interview-questions/solve-chat-grid-paths-and-car-rentals

You are given three independent programming tasks. For each, describe and implement an efficient algorithm, and be prepared to analyze its time and space complexity.

---

### Q1. Find top-K most active chat users

You are given a log of chat messages from a messaging application.

**Input**:
- An array `messages` of length `n`, where each element `messages[i]` is the `user_id` (string or integer) of the sender of the i-th message.
- An integer `k` (1 ≤ k ≤ number of distinct users).

**Output**:
- Return a list of `k` user IDs corresponding to the users who have sent the most messages.

**Details & requirements**:
- The "activity" of a user is defined as the number of messages they have sent (i.e., their frequency in `messages`).
- If there are fewer than `k` distinct users, return all distinct users.
- If multiple users have the same frequency, you may break ties arbitrarily, or (for determinism) sort tied users by `user_id` in ascending order.
- Aim for an algorithm that is more efficient than sorting all users by count when `k` is much smaller than the number of distinct users.

Design and implement a function, for example:
- `List<UserId> topKActiveUsers(List<UserId> messages, int k)`

Also explain:
- At least two different approaches (e.g., based on sorting, heaps, or selection algorithms).
- The time and space complexity of each approach.

---

### Q2. Count paths in a 2D grid with constrained moves

You have a 2D grid with `m` rows and `n` columns. Index rows from top to bottom as `0..m-1` and columns from left to right as `0..n-1`.

- The **start** cell is the bottom-left corner: `(m-1, 0)`.
- The **end** cell is the bottom-right corner: `(m-1, n-1)`.

From any cell `(r, c)`, you may move **only** to the next column to the right, in one of up to three ways (if within bounds):
- Right-up: `(r-1, c+1)`
- Right: `(r, c+1)`
- Right-down: `(r+1, c+1)`

You cannot move left or stay in the same column. All cells are passable (no obstacles).

**Task**:
- Given integers `m` and `n`, compute the total number of distinct paths from the start cell `(m-1, 0)` to the end cell `(m-1, n-1)` using only the allowed moves.

**Requirements**:
- Implement a function such as `long countPaths(int m, int n)`.
- The result may be large; assume it fits in a 64-bit integer, or, if you prefer, you may return the count modulo a large prime (e.g., 1,000,000,007) — specify which convention you are using.
- First design a straightforward dynamic programming solution using O(m·n) time and O(m·n) space.
- Then describe how to optimize the space usage (e.g., to O(m)) while keeping the same time complexity, and explain why the optimization is correct.

---

### Q3. Minimum cars needed for rentals and assignment

You work at a car rental company. You are given a list of rental bookings, each with a pickup and return time.

**Input**:
- An array of `R` rental records. Each record has:
  - `rental_id`: a unique identifier (e.g., integer or string).
  - `pickup_time`: an integer start time.
  - `return_time`: an integer end time, with `pickup_time < return_time`.

Assume times are on a single timeline (e.g., minutes from some epoch). A car can be reassigned immediately after it is returned, i.e., if one rental ends at time `t` and another starts at time `t`, the same car can serve both.

**Tasks**:
1. **Capacity**: Compute the **minimum number of cars** required so that all rentals can be fulfilled without time conflicts on any single car.
2. **Assignment**: Produce one valid assignment of rentals to cars that uses exactly that minimum number of cars.

**Output**:
- An integer `C` = minimal number of cars needed.
- A mapping from each `rental_id` to a `car_id` in the range `1..C`, such that no two rentals assigned to the same `car_id` overlap in time.

**Requirements & clarifications**:
- Overlap definition: two rentals with intervals `[s1, e1)` and `[s2, e2)` overlap if their time intervals intersect with non-empty duration. Using half-open intervals, if `e1 == s2` they do **not** overlap.
- Aim for an algorithm that is efficient for up to, say, 10^5 rental records.
- Discuss a naive approach and then an optimized approach (for example, using a min-heap/priority queue keyed by the earliest return time to track currently in-use cars).
- Analyze the time and space complexity of your final solution.
