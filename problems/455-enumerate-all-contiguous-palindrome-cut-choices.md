# Enumerate All Contiguous Palindrome Cut Choices
> Google · Other · medium · Pattern: Backtracking
> Source: https://prachub.com/interview-questions/enumerate-all-contiguous-palindrome-cut-choices

### Problem

Return every partition of `s` into nonempty contiguous pieces such that each piece is a palindrome. Pieces must concatenate to the original string in its original order. No order between different returned partitions is prescribed.

```cpp
vector<vector<string>> partition(string s);
```

### Examples

```text
Input: s = "aba"
One valid output: [["aba"],["a","b","a"]]
```

```text
Input: s = "aaa"
One valid output: [["a","a","a"],["a","aa"],["aa","a"],["aaa"]]
```

### Constraints & Assumptions

- The length is between 1 and 16.
- Characters are lowercase English letters.
- Partitions differ by their cut positions; every valid partition is required.

### What a Strong Answer Covers

- Palindrome validity for every piece and complete original-string coverage.
- Enumeration without duplicate cut choices or missing longer pieces.
- The cost of storing all partitions, not only testing one partition.

### Follow-up Questions

- Which partitions remain if the whole string is already a palindrome?
- Why are `["a","aa"]` and `["aa","a"]` different partitions of `aaa`?
