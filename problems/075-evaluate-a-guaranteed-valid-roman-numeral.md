# Evaluate a Guaranteed-Valid Roman Numeral
> Google · Other · easy · Pattern: String Processing, Hashing / Counting
> Source: https://prachub.com/interview-questions/evaluate-a-guaranteed-valid-roman-numeral

### Problem

The string `numeral` is guaranteed to be a valid Roman numeral representing an integer from `1` through `3999`. Return that integer.

The symbols have values `I = 1`, `V = 5`, `X = 10`, `L = 50`, `C = 100`, `D = 500`, and `M = 1000`. Values ordinarily appear in descending order. The permitted subtractive pairs are:

- `IV` and `IX` for `4` and `9`.
- `XL` and `XC` for `40` and `90`.
- `CD` and `CM` for `400` and `900`.

The validity guarantee is part of the input contract; the task does not define a result for malformed numeral strings.

Preserve the original `romanToInt` interface: one string argument and an integer result.

### Examples

**Example 1**

```text
Input: numeral = "CMXLII"
Output: 942
```

Its contributions are `900`, `40`, and `2`.

**Example 2**

```text
Input: numeral = "DCCLII"
Output: 752
```

Its contributions are `500`, `200`, `50`, and `2`.

### Constraints

- The string length is between `1` and `15`.
- Every character is one of `I`, `V`, `X`, `L`, `C`, `D`, and `M`.
- The input is guaranteed valid and its value lies in `[1, 3999]`.
