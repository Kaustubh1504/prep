# Select a Permutation by Its Lexicographic Rank
> Google · Other · hard · Pattern: Math / Number Theory, Backtracking
> Source: https://prachub.com/interview-questions/select-a-permutation-by-its-lexicographic-rank

### Problem

List the permutations of the digits `1` through `n` in increasing lexicographic order. Return the permutation at the one-based position `k`, as a string with no separators. Each digit is used exactly once.

```cpp
string getPermutation(int n, int k);
```

### Examples

```text
Input: n = 4, k = 17
Output: "3412"
```

```text
Input: n = 3, k = 5
Output: "312"
```

### Constraints

- `1 <= n <= 9`.
- `1 <= k <= n!`.
- The position is one-based; the smallest permutation has position 1.
