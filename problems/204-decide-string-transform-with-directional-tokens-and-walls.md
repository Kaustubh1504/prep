# Decide string transform with directional tokens and walls
> Google · Technical Screen · medium · Pattern: Two Pointers
> Source: https://prachub.com/interview-questions/decide-string-transform-with-directional-tokens-and-walls

# Decide string transform with directional tokens and walls

You are given two equal-length strings start and target of length n, each consisting only of the characters 'L', 'R', '.', and 'X'. A dot '.' represents an empty slot; 'X' represents an immovable wall; 'L' and 'R' are tokens that may move across empty slots subject to these rules:
(
1) An 'L' token may move any number of positions left into '.', but may never move right, pass through another token, or pass through an 'X'.
(
2) An 'R' token may move any number of positions right into '.', but may never move left, pass through another token, or pass through an 'X'.
(
3) Only one token can occupy a position at any time. Determine whether target can be obtained from start by a sequence of valid moves. If yes, return true; otherwise, return false. Design an algorithm that runs in O(n) time and O(
1) extra space beyond a few pointers/counters. Explain your invariants, prove correctness informally, analyze time and space complexity, and walk through a few tricky edge cases (e.g., mismatched wall layouts, blocks separated by walls, consecutive tokens with no gaps).

### Clarifying Questions to Ask
- Clarify input sizes, value ranges, mutability, return format, and tie-breaking.
- State the target time and space complexity before coding.
- Call out edge cases such as empty inputs, duplicates, invalid values, overflow, and boundary sizes.

### What a Strong Answer Covers
- A clear algorithm with the right data structures and enough pseudocode or code-level detail to implement it.
- A correctness argument that explains why the algorithm covers all required cases.
- Time and space complexity, plus at least one alternative approach when relevant.
- Focused tests for normal cases, edge cases, and failure modes.

### Follow-up Questions
- How would the approach change if the input were streaming or too large for memory?
- What invariants would you assert in production code?
- Which tests would catch off-by-one, duplicate, or tie-breaking bugs?

<details><summary>Hints (spoiler)</summary>

1. Strip the dots conceptually: the ordered sequence of non-dot characters (tokens and walls) must be identical in both strings — moves can never reorder them or change the count.
2. Use two pointers, one per string, each skipping '.' cells, and compare the k-th non-dot character of start against the k-th of target.
3. Direction constraints become index comparisons: an 'L' may only move left so its start index must be >= its target index; an 'R' may only move right so start index must be <= target index; an 'X' wall must keep the exact same index.
</details>
