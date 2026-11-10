# Enumerate Reusable-Value Target Combinations
> Google · Other · medium · Pattern: Backtracking
> Source: https://prachub.com/interview-questions/enumerate-reusable-value-target-combinations

### Problem

Given the array `choices` of distinct integers and the integer `goal`, return every unique combination of values from `choices` whose sum is `goal`. You may use a value any number of times.

Two combinations are different when some value appears a different number of times. Rearranging the same selected values does not create a new combination. The returned combinations may appear in any order, and their values have no required presentation order.

### Examples

**Example 1**

```text
Input: choices = [3, 4, 7], goal = 11
Output: [[3, 4, 4], [7, 4]]
```

The first combination uses `4` twice. The second could equally be written as `[4, 7]`. These are the only two combinations reaching eleven.

**Example 2**

```text
Input: choices = [4, 6, 9], goal = 5
Output: []
```

No permitted selection, including repeated values, can reach five.

### Constraints & Assumptions

- There are between 1 and 30 candidate values.
- Each candidate value is from 2 through 40, inclusive, and no two candidate values are equal.
- The target `goal` is from 1 through 40, inclusive.
- Each input is guaranteed to have fewer than 150 unique combinations reaching the target.
- Values may be reused without a per-value limit. Every returned combination must sum exactly to the target.
- Return every distinct combination once. There is no required ordering or mandated algorithm.

### Clarifying Questions to Ask

- Can one input value be selected repeatedly? Yes, even though the input candidate array itself contains no duplicates.
- Do `[3, 4, 4]` and `[4, 3, 4]` count as separate answers? No; they have the same multiplicities and represent one combination.

```hint Choose a representation for a combination
The identity of an answer depends on how often each value appears. A search should avoid exploring every rearrangement of the same selection.
```

### What a Strong Answer Covers

- A complete method that supports unlimited reuse of a candidate value.
- A way to avoid duplicate combinations without losing different multiplicities.
- A termination argument based on the positive candidate values.
- Honest bounds for search work, recursion depth, and the storage needed for returned combinations.

### Follow-up Questions

- If only the number of combinations were needed, how could dynamic programming avoid generating all the combinations? Explain how the update order prevents counting rearrangements separately.
