# Find the Shared Starting String
> Google · Other · easy · Pattern: String Processing
> Source: https://prachub.com/interview-questions/find-the-shared-starting-string

### Problem

Given a nonempty array `words` of strings, return the longest string that occurs at the start of every array element. If the strings have no nonempty common prefix, return `""`.

A prefix starts at position `0` and uses consecutive characters. Any array element may itself be empty.

Preserve the original `longestCommonPrefix` interface: one array of strings and a string result.

### Examples

**Example 1**

```text
Input: words = ["interact","internet","internal"]
Output: "inter"
```

The first five characters agree. The next position differs between `"interact"` and the other two strings.

**Example 2**

```text
Input: words = ["sun","moon"]
Output: ""
```

The first characters already differ.

### Constraints

- There are between `1` and `200` strings.
- Every string has length from `0` through `200`.
- Nonempty strings contain only lowercase English letters.
