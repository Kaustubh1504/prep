# Solve three coding interview problems
> Google · Onsite · medium · Pattern: Stack / Parsing, Graph BFS / DFS
> Source: https://prachub.com/interview-questions/solve-three-coding-interview-problems

You are given three independent coding questions.

## 1) Decode an encoded string
Given an encoded string `s`, decode it using the following rule:
- Patterns of the form `k[encoded_string]` mean that `encoded_string` is repeated exactly `k` times.
- `k` is a positive integer and may have multiple digits.
- Encoded strings may be nested.

**Example**: `s = "3[a2[c]]"` should decode to `"accaccacc"`.

**Task**: Return the decoded string.

**Assumptions/constraints** (you may state any reasonable ones in your solution):
- `s` contains only digits, letters, and brackets `[` `]`.
- The input is valid (balanced brackets, well-formed encoding).

---

## 2) Max profit with jump decisions
Given a 1D array `arr` of integers and starting at index `0`, you can make a decision at each index `i`:
- **Take**: gain profit `arr[i]`, then jump to index `i + 1 + arr[i]`.
- **Skip**: gain profit `0`, then move to index `i + 1`.

You may stop when your index is out of bounds (i.e., `i >= n`).

**Task**: Compute the maximum total profit achievable.

### Follow-up
How does your approach change if `arr` can contain **negative numbers**?
- If you **take** at index `i`, you still gain `arr[i]`, and you still move to index `i + 1 + arr[i]` (which could move backward if `arr[i] < 0`).
- Clarify any assumptions needed to ensure termination and handle potential cycles.

---

## 3) Count connected land components in a grid
Given an `m x n` grid of characters `'1'` and `'0'`:
- `'1'` represents land
- `'0'` represents water

Two land cells are connected if they are adjacent **horizontally or vertically** (4-directional adjacency).

**Task**: Return the number of connected components of land (i.e., the number of “islands”).

**Example**:
```
1 1 0
0 1 0
1 0 1
```
Answer: `3`.
