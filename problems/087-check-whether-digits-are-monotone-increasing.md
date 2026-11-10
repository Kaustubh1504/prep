# Check Whether Digits Are Monotone Increasing
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Math / Number Theory

## Problem
Given a non-negative integer `n`, return `True` if its decimal digits are **non-decreasing** from left to right (each digit is `>=` the one before it), and `False` otherwise.

- `0` and every single-digit number are monotone.
- Repeated digits are allowed (`1224` is monotone).
- Solve it in O(d) time for `d` digits, either by extracting digits arithmetically (`n % 10`, `n // 10`) or by walking the decimal string.

## Function signature
```python
def is_monotone_increasing(n: int) -> bool:
    ...
```

## Constraints
- `0 <= n <= 10^18` (or any 64-bit non-negative integer)

## Examples
**Example 1**
Input: `n = 1234`
Output: `True`

**Example 2** (repeated digits)
Input: `n = 1224`
Output: `True`

**Example 3**
Input: `n = 1324`
Output: `False`
Explanation: `3 > 2`.

**Example 4** (edge cases)
Input: `n = 0` → `True`; `n = 7` → `True`; `n = 9990` → `False`

<details><summary>Approach (spoiler)</summary>

Read digits from the right with `n % 10`. Reading right to left, the digits must be non-increasing, so each new digit must be `<=` the previously read (more-right) digit. Starting `prev` at 10 handles the first digit, and the loop never runs for `n = 0`, which correctly returns `True`.
**Time:** O(d) · **Space:** O(1)

```python
def is_monotone_increasing(n: int) -> bool:
    prev = 10                 # larger than any digit
    while n > 0:
        d = n % 10
        if d > prev:
            return False
        prev = d
        n //= 10
    return True
```
</details>
