# Validate a Signed Decimal and Exponent Spelling
> Google · Other · hard · Pattern: String Processing, Stack / Parsing
> Source: https://prachub.com/interview-questions/validate-a-signed-decimal-and-exponent-spelling

### Problem

Check whether the entire string `spelling` has the syntax of a valid number under the grammar below. Return a boolean result.

The main numeric part may begin with one optional sign, `+` or `-`. After that sign, it must have one of these forms:

- One or more decimal digits, with no dot.
- One or more digits followed by a dot, optionally followed by more digits.
- A dot followed by one or more digits.

An optional exponent may follow the main part. It consists of `e` or `E`, then one optional sign, then one or more decimal digits. A decimal point is not allowed inside the exponent.

All characters must belong to this complete structure. Leading zeroes are permitted. The task checks syntax and returns no converted numeric value.

### Examples

**Example 1**

```text
Input: spelling = "-.625E+2"
Output: true
```

The main part is a signed decimal with digits after its dot, and `E+2` is a valid exponent.

**Example 2**

```text
Input: spelling = "7e-3.2"
Output: false
```

The exponent must contain an integer spelling; the dot makes this exponent invalid.

### Constraints

- `1 <= spelling.length <= 20`
- Characters may be uppercase or lowercase English letters, decimal digits, `+`, `-`, or `.`.
