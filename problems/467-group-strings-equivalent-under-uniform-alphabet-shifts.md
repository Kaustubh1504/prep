# Group Strings Equivalent under Uniform Alphabet Shifts
> Google · Other · medium · Pattern: Hashing / Counting, String Processing
> Source: https://prachub.com/interview-questions/group-strings-equivalent-under-uniform-alphabet-shifts

### Problem

Group lowercase strings when shifting every letter by the same alphabet offset, with z-to-a wraparound, can transform one into the other. Return all groups in any order, with no required member order. Preserve every input occurrence.

```cpp
vector<vector<string>> groupStrings(vector<string>& strings);
```

### Examples

```text
strings = ["az","ba","bc","cd","a"] -> [["az","ba"],["bc","cd"],["a"]]
strings = ["x","y","x"] -> [["x","y","x"]]
```

### Constraints

- There are 1 through 200 strings, each length 1 through 50.
- All letters are lowercase English.

### Follow-up Questions

Explain how the permitted output freedom is preserved without losing required values or occurrences.

### What a Strong Answer Covers

Normalize each letter to its modular offset from the string's first letter, retaining the length. Explain why every produced result satisfies the source contract and why no required result is omitted.
