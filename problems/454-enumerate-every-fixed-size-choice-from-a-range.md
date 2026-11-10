# Enumerate Every Fixed-Size Choice from a Range
> Google · Other · medium · Pattern: Backtracking
> Source: https://prachub.com/interview-questions/enumerate-every-fixed-size-choice-from-a-range

### Problem

Return all distinct combinations of `k` different integers selected from the inclusive range 1 through `n`. A combination is a choice of members, so changing their order does not create a new combination. Include every such choice exactly once; the returned combinations may be listed in any order.

```cpp
vector<vector<int>> combine(int n, int k);
```

No particular ordering inside a combination is required to represent its members. Increasing order is a valid implementation choice, not an added input/output condition.

### Examples

```text
Input: n = 5, k = 3
One valid output: [[1,2,3],[1,2,4],[1,2,5],[1,3,4],[1,3,5],[1,4,5],[2,3,4],[2,3,5],[2,4,5],[3,4,5]]
```

```text
Input: n = 3, k = 2
One valid output: [[3,2],[1,3],[2,1]]
```

The latter collection represents the choices `{2,3}`, `{1,3}`, and `{1,2}` once each.

### Constraints & Assumptions

- `1 <= n <= 20`.
- `1 <= k <= n`.
- A member cannot be repeated within a combination.
- Permutations of the same members are not separate combinations.

### Clarifying Questions to Ask

- Is `[2,1]` a different choice from `[1,2]`? No.
- Are combinations containing a repeated number allowed? No; select different numbers from the range.

```hint Distinguish a choice from a sequence
The answer enumerates member sets. Reordering an already returned choice does not add a new one.
```

### What a Strong Answer Covers

- Completeness of the k-member choices and exclusion of repeats within or across choices.
- A clear construction convention without turning that convention into a source requirement.
- Output-sensitive cost for storing all combinations.

### Follow-up Questions

- How can equivalent answers be compared without fixing either list order or each choice's presentation order?
- What do the answers look like for `k=1` and `k=n`?
