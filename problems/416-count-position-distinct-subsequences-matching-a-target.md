# Count Position-Distinct Subsequences Matching a Target
> Google · Other · hard · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/count-position-distinct-subsequences-matching-a-target

### Problem

Count the distinct subsequences of `s` whose characters form `t`. A subsequence chooses increasing positions from `s`; the chosen characters need not be contiguous. Different position choices count separately even when they spell the same string. Match letters exactly.

```cpp
int numDistinct(string s, string t);
```

The final count is guaranteed to fit in a signed 32-bit integer. This guarantee concerns the requested answer, not every intermediate count for a shorter target prefix.

### Examples

```text
Input: s = "ababa", t = "aba"
Output: 4
```

Using one-based positions, the choices are `(1,2,3)`, `(1,2,5)`, `(1,4,5)`, and `(3,4,5)`.

```text
Input: s = "aaBaB", t = "aB"
Output: 5
```

### Constraints

- Both string lengths are between 1 and 1000.
- Both contain English letters.
- The complete answer lies between 0 and 2147483647, inclusive.
