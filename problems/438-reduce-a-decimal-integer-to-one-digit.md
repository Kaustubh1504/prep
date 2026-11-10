# Reduce a Decimal Integer to One Digit
> Google · Other · easy · Pattern: Math / Number Theory
> Source: https://prachub.com/interview-questions/reduce-a-decimal-integer-to-one-digit

### Problem

Repeatedly replace num by the sum of its decimal digits until one digit remains. Return that final digit.

```cpp
int addDigits(int num);
```

### Examples

```text
num = 59 -> 5
num = 0 -> 0
```

### Constraints

- 0 <= num <= 2147483647.

### Optional follow-up

Can you solve it in O(1) time without loops or recursion?
