# Find All Distinct Four-Value Target Groups
> Google · Other · medium · Pattern: Two Pointers, Backtracking
> Source: https://prachub.com/interview-questions/find-all-distinct-four-value-target-groups

### Problem

Given the integer array `values` and integer `goal`, return all distinct groups of four values whose sum equals `goal`, using four different positions from the array for each group.

Different position selections that yield the same four values describe one result. A repeated value is allowed within a group when the array contains enough occurrences. Return the groups in any order; no canonical arrangement of a group's values is required.

### Examples

**Example 1**

```text
Input: values = [-3, -1, 0, 2, 4, 5], goal = 5
Output: [[-3, -1, 4, 5], [-1, 0, 2, 4]]
```

Both groups sum to five, and no other choice produces a distinct qualifying group.

**Example 2**

```text
Input: values = [-6, -6, 3, 3, 3, 3], goal = -6
Output: [[-6, -6, 3, 3]]
```

Multiple selections of the positions holding `3` produce the same value group, so it appears once.

### Constraints & Assumptions

- The array has between 1 and 200 elements.
- Every array value is from -1,000,000,000 through 1,000,000,000.
- The target `goal` has those same inclusive bounds.
- All four positions used for one result must differ.
- Return an empty list if there are no qualifying groups, including when fewer than four positions exist.
- No output ordering or particular algorithm is prescribed.

### Clarifying Questions to Ask

- Should repeated index selections appear separately? No; results are unique groups of values.
- Can a group use four equal values? Yes, but only if at least four distinct positions supply them and their sum matches the target.

```hint Account for intermediate arithmetic
A sum of four permitted input values can exceed the range of a signed 32-bit integer, even though the target itself fits in that range.
```

### What a Strong Answer Covers

- A search that enumerates every qualifying four-value group and never reuses a position within one group.
- Duplicate handling at every selection level while retaining necessary repeated values.
- Safe arithmetic for four-value sums and any pruning bounds.
- A proof of completeness and explicit time, working-space, and output-space costs.

### Follow-up Questions

- How can minimum and maximum achievable sums prune a sorting-based search without losing answers?
- Which intermediate expressions need widening in a language with fixed-width integer arithmetic?
