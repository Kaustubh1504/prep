# Evaluate a Floating Base to an Integer Power
> Google · Other · medium · Pattern: Math / Number Theory
> Source: https://prachub.com/interview-questions/evaluate-a-floating-base-to-an-integer-power

### Problem

Implement `myPow(x,n)` to return the floating-point value of `x` raised to the integer exponent `n`. A negative exponent denotes the reciprocal power, and a nonzero base raised to zero is 1.

```cpp
double myPow(double x, int n);
```

Return a numeric value; the decimal formatting in examples is illustrative.

### Examples

```text
Input: x = 3.0, n = -3
Output: 0.037037037037...
```

```text
Input: x = -1.5, n = 4
Output: 5.0625
```

### Constraints

- `-100.0 < x < 100.0`.
- `n` is an integer from -2147483648 through 2147483647.
- Either `x` is nonzero or `n > 0`; zero to a zero or negative exponent is excluded.
- The mathematical result is between -10000 and 10000, inclusive.
