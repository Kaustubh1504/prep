# Check Matching and Nested Brackets
> Google · Other · easy · Pattern: Stack / Parsing
> Source: https://prachub.com/interview-questions/check-matching-and-nested-brackets

### Problem

The string `brackets` contains only `(`, `)`, `[`, `]`, `{`, and `}`. Return `true` exactly when all brackets can be matched correctly; otherwise return `false`.

Correct matching requires that each opening bracket has a closing bracket of its own type, every closing bracket has a corresponding earlier opening bracket, and nested brackets close in the required order. Crossing matches are invalid even when each type appears equally often.

Preserve the original `isValid` interface: one string argument and a Boolean result.

### Examples

**Example 1**

```text
Input: brackets = "{[()]()}"
Output: true
```

Each inner group closes before the group that contains it.

**Example 2**

```text
Input: brackets = "[(])"
Output: false
```

The `]` cannot close the earlier `[` while the intervening `(` remains open.

### Constraints

- The string length is between `1` and `10000`.
- Every character is one of the six bracket characters listed above.
