# Recognize Recursive Split-and-Swap String Transformations
> Google · Other · hard · Pattern: Dynamic Programming, Backtracking, String Processing
> Source: https://prachub.com/interview-questions/recognize-recursive-split-and-swap-string-transformations

### Problem

A string can be scrambled recursively as follows. A one-character string stays as it is. For a longer string, choose a split into two nonempty contiguous parts, optionally exchange the two parts, and apply the same process recursively within each part.

Given equal-length strings `s1` and `s2`, return whether some sequence of these choices transforms `s1` into `s2`. This asks whether a transformation exists, not how likely random choices are to produce it.

```cpp
bool isScramble(string s1, string s2);
```

### Examples

```text
Input: s1 = "abcd", s2 = "badc"
Output: true
```

Split into `ab` and `cd`, keep the two parts in order, and exchange the letters inside both parts.

```text
Input: s1 = "abcd", s2 = "bdac"
Output: false
```

These strings have the same letter counts, but no allowed recursive splitting produces the second.

### Constraints

- `s1.length == s2.length`.
- The common length is between 1 and 30.
- Both strings contain only lowercase English letters.
