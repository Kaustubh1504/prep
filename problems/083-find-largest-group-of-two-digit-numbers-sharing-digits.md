# Find largest group of two-digit numbers sharing digits
> Google · Online Assessment · easy · Pattern: Hashing / Counting, Bit Manipulation
> Source: https://prachub.com/interview-questions/find-largest-group-of-two-digit-numbers-sharing-digits

You are given an integer array `A` of length `n` (`1 <= n <= 100`). Each element is a two-digit number (e.g., from 10 to 99). Two numbers are considered **connected** if they share **at least one digit** in common.

Examples of “share a digit”:

- `55` and `58` share digit `5`
- `25` and `45` share digit `5`
- `12` and `23` share digit `2`
- `55` and `66` share no digit

A **group** is any set of numbers that can be connected through this relation transitively (i.e., if `a` shares a digit with `b`, and `b` shares a digit with `c`, then `a`, `b`, `c` can be in the same group even if `a` and `c` don’t share a digit directly).

Task: Return the **maximum possible size** of a group (i.e., the size of the largest connected component under the “shares a digit” relation).

Output: an integer, the largest group size.

Clarifications:

- If `A` contains duplicate values, treat them as separate elements (they each contribute 1 to the group size).
- Sharing can be via either the tens digit or the ones digit.

<details><summary>Hints (spoiler)</summary>

1. Model each number as a node; add an edge between any two numbers that share a digit. The answer is the size of the largest connected component.
2. A two-digit number has only its tens and ones digit, so 'shares a digit' is just a non-empty intersection of two 2-element digit sets — an O(1) check.
3. Union-Find (Disjoint Set Union) makes the component sizes easy: union every connected pair, then count how many indices map to each root and take the max. A BFS/DFS over an adjacency list works too.
4. Watch the duplicate clarification: identical values still count as distinct elements, so they each add 1 to the component — union by index, not by value.
</details>
