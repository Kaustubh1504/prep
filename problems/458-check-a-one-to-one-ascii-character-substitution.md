# Check a One-to-One ASCII Character Substitution
> Google · Other · easy · Pattern: Hashing / Counting, String Processing
> Source: https://prachub.com/interview-questions/check-a-one-to-one-ascii-character-substitution

### Problem

Determine whether two equal-length strings are isomorphic: one consistent character replacement maps s to t in order. Every occurrence of a source character uses the same target character, and two different source characters cannot map to the same target character. A character may map to itself.

```cpp
bool isIsomorphic(string s, string t);
```

### Examples

```text
Input: s = "xyx", t = "aba"
Output: true
```

```text
Input: s = "ab", t = "cc"
Output: false
```

Two different source characters cannot both map to c.

### Constraints

- Both lengths are equal and between 1 and 50000.
- Any valid ASCII character may occur, including control characters; the domain is not restricted to letters or printable ASCII.
