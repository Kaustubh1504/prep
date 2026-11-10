# Count Good Numbers up to a Limit
> Google · Onsite · medium · Pattern: Math / Number Theory, Dynamic Programming
> Source: https://prachub.com/interview-questions/count-good-numbers-up-to-a-limit

# Count Good Numbers up to a Limit

A positive integer is **good** when all of the following hold:

1. Its decimal representation contains no digit `0`.
2. No digit appears more than once.
3. No internal digit is strictly smaller than both adjacent digits. In digits `... a, b, c ...`, the pattern `a > b < c` is forbidden. The first and last digits have only one neighbor and are not checked by this rule.

Given `m`, return the number of good integers `x` such that `1 <= x <= m`.

Implement:

```python
def solve(m: int) -> int:
    ...
```

## Constraints

- `1 <= m <= 10^18`
- A good integer has at most nine digits because only digits `1` through `9` are allowed and cannot repeat.

## Examples

```text
m = 9   -> 9
m = 10  -> 9
m = 21  -> 18
```

For `m = 21`, the good values are `1..9`, `12..19`, and `21`; `10`, `11`, and `20` are invalid.

<details><summary>Hints (spoiler)</summary>

1. Use digit DP with tight and started flags plus a used-digit bitmask.
2. Keep the previous two chosen digits so appending a digit can detect a newly completed valley.
3. Leading padding zeroes are not part of the number and must not enter the mask.
</details>

<details><summary>Approach (spoiler)</summary>

Digit DP scans the upper bound from left to right. The state records whether the prefix is tight, whether the number has started, which nonzero digits are used, and the last two real digits. Appending a real digit is rejected if it repeats, is zero, or completes a valley. Reaching the end counts exactly the started states, so zero itself is excluded.

**Time:** O(L * 2^10 * 10 * 11 * 11), with L <= 19. · **Space:** O(L * 2^10 * 11 * 11) memoized states.
</details>
