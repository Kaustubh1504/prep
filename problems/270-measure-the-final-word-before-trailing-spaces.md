# Measure the Final Word Before Trailing Spaces
> Google · Other · easy · Pattern: String Processing
> Source: https://prachub.com/interview-questions/measure-the-final-word-before-trailing-spaces

### Problem

Given the string `s`, return the length of its final word. A word is a maximal contiguous sequence of characters other than the ordinary space character `' '`. Spaces may occur at the beginning, between words, or after the last word.

```cpp
int lengthOfLastWord(string s);
```

### Examples

```text
Input: s = "  Green   leaf  "
Output: 4
```

The final word is `leaf`; the two spaces after it are not part of the word.

```text
Input: s = "Z"
Output: 1
```

### Constraints

- `1 <= s.length <= 10000`.
- The string contains only English letters and ordinary spaces `' '`.
- At least one word is present.
