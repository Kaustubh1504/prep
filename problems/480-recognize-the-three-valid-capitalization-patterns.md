# Recognize the Three Valid Capitalization Patterns
> Google · Other · easy · Pattern: String Processing
> Source: https://prachub.com/interview-questions/recognize-the-three-valid-capitalization-patterns

### Problem

Return whether word uses one of three patterns: all uppercase letters, all lowercase letters, or only its first letter uppercase. Input contains English letters only.

```cpp
class Solution {
public:
    bool detectCapitalUse(string word);
};
```

### Examples

**Example 1:**

```text
word = "River"
Output: true
Explanation: Only the first character is uppercase.
```

**Example 2:**

```text
word = "riVer"
Output: false
Explanation: A later uppercase character violates all three patterns.
```

### Constraints

- The word contains 1..100 characters; each is an English uppercase or lowercase letter.

### Clarifying Questions

Check the position of a lone uppercase letter as well as its count.

```hint Read the boundary condition
Can the three permitted patterns be expressed using one uppercase count?
```

### Contract considerations

Check the position of a lone uppercase letter as well as its count.
