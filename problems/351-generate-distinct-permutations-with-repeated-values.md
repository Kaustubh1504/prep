# Generate Distinct Permutations with Repeated Values
> Google · Other · medium · Pattern: Backtracking
> Source: https://prachub.com/interview-questions/generate-distinct-permutations-with-repeated-values

### Problem

Given the integer array `values`, which may contain repeated values, return all distinct permutations of the entire array.

Each permutation must preserve the number of occurrences of every input value. Arrays that differ only in which equal-valued input positions supplied their entries are the same permutation and must appear once. The returned collection may be in any order.

### Examples

**Example 1**

```text
Input: values = [2, 2, 5]
Output: [[2, 5, 2], [2, 2, 5], [5, 2, 2]]
```

There are three different value sequences, even though the two occurrences of `2` could be assigned positions in several ways.

**Example 2**

```text
Input: values = [-1, 0, -1, 0]
Output: [[-1, -1, 0, 0], [-1, 0, -1, 0], [-1, 0, 0, -1],
         [0, -1, -1, 0], [0, -1, 0, -1], [0, 0, -1, -1]]
```

These six arrays use both copies of each value. Their collection order is unrestricted.

### Constraints & Assumptions

- `1 <= values.length <= 8`
- Every value is an integer between -10 and 10, inclusive.
- Repeated values are allowed, and the input need not be sorted.
- Every result has the same length and value frequencies as the input.
- Return every distinct permutation exactly once. No collection ordering or particular algorithm is required.

### Clarifying Questions to Ask

- Are two permutations different when equal-valued occurrences exchange places? No; compare the resulting value sequences.
- Can the input contain only one distinct value? Yes; it then has exactly one distinct permutation.

```hint Distinguish value sequences from position choices
Exchanging two equal input occurrences does not change an output array. A complete enumeration should avoid presenting those exchanges as new results.
```

### What a Strong Answer Covers

- Preservation of every value's multiplicity in each returned array.
- Duplicate-free enumeration without omitting distinct value sequences.
- Restoration of counts or position-use state between recursive choices.
- Output-sensitive complexity and separate working-storage accounting.

### Follow-up Questions

- If an alternative implementation tracks individual positions, which equal-value choice rule prevents duplicate branches while still allowing every available copy to be used?
