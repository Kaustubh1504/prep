# Find numbers with exactly two sum-of-squares forms
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Hard · Pattern: Two Pointers, Backtracking; Math / Number Theory

## Problem
A **sum-of-squares form** of a positive integer `n` is an unordered pair of **positive** integers `(a, b)` with `a <= b` and `a² + b² = n`. Order doesn't matter, so `1² + 7²` and `7² + 1²` are the same form. `a == b` is allowed, as in `50 = 5² + 5²`. Zero is not allowed, so `25 = 0² + 5²` does not count.

**Part 1.** Given `n`, return all of its forms as `(a, b)` pairs sorted by increasing `a`.

**Part 2.** Given `limit`, return, in increasing order, every integer `n` with `1 <= n <= limit` that has **exactly two** forms.

## Function signature
```python
def square_forms(n: int) -> list[tuple[int, int]]: ...        # Part 1
def exactly_two_forms(limit: int) -> list[int]: ...           # Part 2
```

## Constraints
- Part 1: `1 <= n <= 10^12`, target O(√n)
- Part 2: `1 <= limit <= 10^7`, target O(limit)

## Examples
**Example 1** (Part 1)
Input: `n = 50`
Output: `[(1, 7), (5, 5)]`

Input: `n = 325`
Output: `[(1, 18), (6, 17), (10, 15)]`
Explanation: 325 has three forms, so it would **not** appear in Part 2's output.

**Example 2** (Part 1 edge cases)
Input: `n = 25` gives `[(3, 4)]`, because `0² + 5²` doesn't count.
Input: `n = 3` gives `[]`.
Input: `n = 2` gives `[(1, 1)]`.

**Example 3** (Part 2)
Input: `limit = 150`
Output: `[50, 65, 85, 125, 130, 145]`
Explanation: For example `65 = 1² + 8² = 4² + 7²` and `85 = 2² + 9² = 6² + 7²`.

Input: `limit = 49` gives `[]`, because 50 is the smallest such number.

<details><summary>Approach (spoiler)</summary>

**Part 1:** use two pointers, with `a = 1` and `b = isqrt(n)`. While `a <= b`: if `a² + b² == n`, record the pair and move both pointers inward; if the sum is too small, increment `a`; if it is too large, decrement `b`. The sum moves monotonically with each pointer, so no form is skipped. Use `isqrt` rather than floating-point `sqrt` so large `n` stays exact.

**Part 2:** don't run Part 1 for every `n`, which would cost O(limit·√limit). Instead enumerate every pair `1 <= a <= b` with `a² + b² <= limit`. There are about `π·limit/8` such pairs. Increment `count[a² + b²]` for each, then keep the `n` with `count == 2`. (Number-theory check: the number of forms is governed by the primes `≡ 1 mod 4` in `n`'s factorisation, which explains why 50, 65 and 85 qualify.)

**Time:** Part 1 O(√n), Part 2 O(limit) · **Space:** Part 1 O(1), Part 2 O(limit)

```python
from math import isqrt

def square_forms(n):
    res = []
    a, b = 1, isqrt(n)
    while a <= b:
        s = a * a + b * b
        if s == n:
            res.append((a, b))
            a += 1
            b -= 1
        elif s < n:
            a += 1
        else:
            b -= 1
    return res

def exactly_two_forms(limit):
    cnt = [0] * (limit + 1)
    a = 1
    while 2 * a * a <= limit:
        b = a
        while a * a + b * b <= limit:
            cnt[a * a + b * b] += 1
            b += 1
        a += 1
    return [n for n in range(1, limit + 1) if cnt[n] == 2]
```
</details>
