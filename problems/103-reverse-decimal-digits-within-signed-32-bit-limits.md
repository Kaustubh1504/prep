# Reverse Decimal Digits Within Signed 32-Bit Limits
> Google · Other · medium · Pattern: Math / Number Theory
> Source: https://prachub.com/interview-questions/reverse-decimal-digits-within-signed-32-bit-limits

### Problem

Given the signed 32-bit integer `value`, reverse its decimal digits and retain its sign. Return `0` when the reversed value falls outside the signed 32-bit range.

Leading zeroes in the reversed decimal representation do not affect the returned integer. For example, trailing zeroes in the input disappear from its reversed numeric value.

The environment does not permit signed or unsigned 64-bit integer storage. Your arithmetic must detect overflow before performing an operation whose result would exceed signed 32-bit storage; computing a wider reversed integer and checking afterward does not satisfy the task.

Preserve the original `reverse` interface: one signed 32-bit integer argument and a signed 32-bit integer result.

### Examples

**Example 1**

```text
Input: value = 507
Output: 705
```

**Example 2**

```text
Input: value = -240
Output: -42
```

The sign remains negative, and the zero at the start of the reversed digits contributes no place value.

### Constraints

- `-2147483648 <= value <= 2147483647`.
- No signed or unsigned 64-bit integer storage is available.
- A mathematically reversed value below `-2147483648` or above `2147483647` requires the result `0`.
