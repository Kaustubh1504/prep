# Match an Entire String with Dot and Star
> Google · Other · hard · Pattern: Dynamic Programming, String Processing
> Source: https://prachub.com/interview-questions/match-an-entire-string-with-dot-and-star

### Problem

Determine whether the pattern `pattern` matches all of the string `text`. Return a boolean result.

A pattern element is either a lowercase English letter or a dot (`.`). A letter matches itself, while a dot matches exactly one character. An element followed by a star (`*`) can match zero or more consecutive occurrences of that element. The star modifies the preceding element; it is not an independent wildcard.

The complete pattern must account for every character in `text`. A match that covers only a prefix or another part of the string is insufficient.

### Examples

**Example 1**

```text
Input: text = "bbbc", pattern = "a*b*c"
Output: true
```

Here `a*` matches no characters, `b*` matches the three `b` characters, and the final `c` matches itself. Together they cover the entire string.

**Example 2**

```text
Input: text = "hjk", pattern = ".*j"
Output: false
```

A full match with this pattern would have to finish with `j`, but the string ends with `k`.

### Constraints

- `1 <= text.length <= 20`
- `1 <= pattern.length <= 20`
- Every character in `text` is a lowercase English letter.
- Characters in `pattern` are lowercase English letters, `.` or `*`.
- Every `*` has a valid preceding element to repeat.
