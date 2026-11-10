# Find the Largest Monotone Increasing Number
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Monotonic Stack, Math / Number Theory

## Problem
A non-negative integer has **monotone increasing digits** if each digit is less than or equal to the digit after it (reading left to right), i.e. its digits are non-decreasing. For example, `1234`, `1123` and `7` qualify, but `332` and `10` don't.

Given a non-negative integer `n`, return the largest integer `x` with `0 <= x <= n` whose digits are monotone increasing. The result is an ordinary integer with no leading zeros (for example, `100` gives `99`, not `099`). Solve it in time linear in the number of digits; don't count down from `n`.

## Function signature
```python
def monotone_increasing(n: int) -> int:
```

## Constraints
- `0 <= n <= 10^18`
- Target: O(d) time, where d is the number of digits of `n`

## Examples
**Example 1**
Input: `n = 332`
Output: `299`
Explanation: The first decrease is between positions 1 and 2 (`3 > 2`). Because the digit before it is also `3`, the correction has to go back to the first `3`. Decrement it to `2` and fill the rest with `9`s, which gives `299`.

**Example 2**
Input: `n = 1234`
Output: `1234`
Explanation: `n` already qualifies.

**Example 3** (leading-zero edge cases)
Input: `n = 10`
Output: `9`

Input: `n = 1000000000`
Output: `999999999`

Input: `n = 0`
Output: `0`

<details><summary>Approach (spoiler)</summary>

Scan the digits from right to left. Whenever `d[i-1] > d[i]`, decrement `d[i-1]` and record `i` as the point where the `9`-fill starts. Scanning right to left makes earlier positions see the decremented digit, so a cascade like `332 -> 3(2)9 -> 2(9)9` is handled automatically. Finally set every digit from the leftmost recorded position onward to `9`. This is optimal because the prefix before the fill is the longest prefix of `n` you can keep, the decremented digit is the largest it can be, and an all-`9` suffix is the largest possible. A leading digit that becomes `0` disappears when you convert back to an integer.

**Time:** O(d) · **Space:** O(d)

```python
def monotone_increasing(n: int) -> int:
    d = list(str(n))
    fill_from = len(d)
    for i in range(len(d) - 1, 0, -1):
        if d[i - 1] > d[i]:
            d[i - 1] = str(int(d[i - 1]) - 1)
            fill_from = i
    for i in range(fill_from, len(d)):
        d[i] = '9'
    return int(''.join(d))
```
</details>
