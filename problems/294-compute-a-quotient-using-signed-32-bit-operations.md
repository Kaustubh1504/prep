# Compute a Quotient Using Signed 32-Bit Operations
> Google · Other · medium · Pattern: Math / Number Theory
> Source: https://prachub.com/interview-questions/compute-a-quotient-using-signed-32-bit-operations

### Problem

Return the integer quotient of `dividend` and `divisor` without using multiplication, division, or remainder/modulo operators. Discard the fractional part toward zero: a negative quotient is rounded upward toward zero, not downward.

The environment can store only signed 32-bit integers, from `-2147483648` through `2147483647`. If the mathematical quotient is above that range, return `2147483647`; if it is below the range, return `-2147483648`. Wider signed or unsigned integer storage is not available.

Preserve the original interface:

```cpp
int divide(int dividend, int divisor);
```

### Examples

```text
Input: dividend = 29, divisor = 4
Output: 7
```

The discarded fractional part does not increase the quotient to 8.

```text
Input: dividend = -37, divisor = 5
Output: -7
```

Truncation toward zero produces `-7`, rather than the floor value `-8`.

### Constraints

- Both inputs lie between `-2147483648` and `2147483647`, inclusive.
- `divisor` is nonzero.
- Multiplication, division, and modulo/remainder operators may not be used.
- Stored integer values, including arithmetic intermediates, must remain within the signed 32-bit range.
