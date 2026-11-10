# Add Two Binary Digit Strings
> Google · Other · easy · Pattern: Math / Number Theory
> Source: https://prachub.com/interview-questions/add-two-binary-digit-strings

### Problem

The strings `first` and `second` represent nonnegative integers in base two. Return their sum as a binary digit string, using the usual representation without unnecessary leading zeroes.

### Examples

**Example 1**

```text
Input: first = "1101", second = "101"
Output: "10010"
```

The represented values are `13` and `5`; their sum, `18`, is written as `10010` in binary.

**Example 2**

```text
Input: first = "0", second = "1001"
Output: "1001"
```

Adding zero preserves the other value.

### Constraints

- Each input string has length between `1` and `10^4`, inclusive.
- The only permitted characters are `0` and `1`.
- Each input has no leading zeroes unless the entire string is `"0"`.
