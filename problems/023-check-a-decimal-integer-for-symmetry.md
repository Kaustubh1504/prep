# Check a Decimal Integer for Symmetry
> Google · Other · easy · Pattern: Math / Number Theory
> Source: https://prachub.com/interview-questions/check-a-decimal-integer-for-symmetry

### Problem

Decide whether the decimal representation of the signed integer `number` reads identically from left to right and from right to left. Return `true` when it does and `false` when it does not.

Use the integer's usual decimal notation. A minus sign is part of the representation, so negative integers do not qualify. Zero and positive single-digit integers do qualify.

### Examples

**Example 1**

```text
Input: number = 4004
Output: true
```

Reading the four digits backward produces `4004` again.

**Example 2**

```text
Input: number = -343
Output: false
```

Reversing the representation moves the minus sign to the end; it does not reproduce the original notation.

### Constraints

- `-2^31 <= number <= 2^31 - 1`

### Optional Follow-up

Can you preserve the same behavior without converting `number` to a string? This restriction applies only to the follow-up.
