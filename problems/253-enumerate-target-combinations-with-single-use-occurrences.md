# Enumerate Target Combinations with Single-Use Occurrences
> Google · Other · medium · Pattern: Backtracking
> Source: https://prachub.com/interview-questions/enumerate-target-combinations-with-single-use-occurrences

### Problem

Given the integer array `choices` and the integer `goal`, return every unique combination of values whose sum is `goal`. Each position in `choices` may contribute at most once to a combination.

The input may contain equal values at different positions. A combination may use several copies of a value when enough occurrences are available, but different position choices that produce the same value multiplicities describe only one answer. Neither the collection order nor the presentation order within a combination is prescribed.

### Examples

**Example 1**

```text
Input: choices = [1, 1, 2, 3, 4], goal = 5
Output: [[3, 1, 1], [4, 1], [2, 3]]
```

These are the three distinct combinations. The first uses the two separate occurrences of `1`.

**Example 2**

```text
Input: choices = [2, 2, 2, 5], goal = 4
Output: [[2, 2]]
```

Any two of the three positions holding `2` form the same value combination, which appears once.

### Constraints & Assumptions

- `1 <= choices.length <= 100`
- Every entry is an integer from 1 through 50, inclusive.
- `1 <= goal <= 30`
- A position can be used at most once within one combination. Equal-valued positions are separate available occurrences.
- Return all distinct value combinations exactly once, or an empty list when none exist.
- There is no promised upper bound on the number of answers beyond what follows from these input limits.
- No particular algorithm or result ordering is required.

### Clarifying Questions to Ask

- Does the one-use rule prohibit selecting the same value twice? No; two different positions may supply two equal values.
- Are `[1, 4]` and `[4, 1]` different combinations? No; rearranging the selected values does not change a combination.

```hint Distinguish copies from duplicates
Two equal input occurrences can both be needed in one answer, while exchanging which equal-valued positions were selected must not create a second copy of that answer.
```

### What a Strong Answer Covers

- A complete search that respects the available occurrences and uses each selected position only once.
- Duplicate handling that retains combinations needing repeated values.
- A proof of validity, completeness, uniqueness, and termination using the positive input values.
- Search-work and output-storage bounds that do not assume there are only a few valid combinations.

### Follow-up Questions

- In a sorting-based recursive search, why must duplicate skipping be relative to the current search depth?
- How does the positivity of the values justify stopping a branch?
