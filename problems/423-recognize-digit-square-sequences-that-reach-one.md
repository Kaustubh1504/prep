# Recognize Digit-Square Sequences That Reach One
> Google · Other · easy · Pattern: Math / Number Theory
> Source: https://prachub.com/interview-questions/recognize-digit-square-sequences-that-reach-one

### Problem

Starting from positive n, repeatedly replace the number by the sum of the squares of its decimal digits. A happy number eventually reaches 1; otherwise the process repeats in a cycle not containing 1. Return whether n is happy.

```cpp
bool isHappy(int n);
```

### Examples

```text
Input: n = 7
Output: true
```

Its sequence is 7→49→97→130→10→1.

```text
Input: n = 4
Output: false
```

### Constraints

- `1 <= n <= 2147483647`.
