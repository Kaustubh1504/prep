# Reverse Word Order and Normalize ASCII Spaces
> Google · Other · medium · Pattern: String Processing
> Source: https://prachub.com/interview-questions/reverse-word-order-and-normalize-ascii-spaces

### Problem

Reverse the order of words in a string. A word is a maximal sequence of non-space characters. Return the words unchanged internally, joined by exactly one ASCII space, with no leading or trailing spaces. Original spacing may contain extra spaces at the ends or between words.

```cpp
string reverseWords(string s);
```

### Examples

```text
Input: s = "  green   lamp  42 "
Output: "42 lamp green"
```

```text
Input: s = "One"
Output: "One"
```

### Constraints

- Length is between 1 and 10000.
- Characters are English letters, decimal digits, or ASCII space `' '`.
- At least one word is present.

### Optional follow-up

If the language's string type is mutable, can you solve it in place with `O(1)` extra space?
