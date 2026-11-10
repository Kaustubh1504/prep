# Generate Every Ordered Sum Using Ones and Twos
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Backtracking

## Problem
Given a non-negative integer `n`, return every string made only of the characters `'1'` and `'2'` whose digit values add up to exactly `n`. Order matters, so `"12"` and `"21"` are different sums and both must appear.

Rules:
- Each valid string appears exactly once.
- Return the strings in ascending lexicographic order.
- For `n == 0`, the only valid sum is the empty one, so return `[""]`.
- For a negative `n`, return `[]`.

The answer has F(n+1) strings (a Fibonacci number), so it grows exponentially. You cannot do better than output size, and the interviewer expects you to say so.

## Function signature
```python
def ordered_sums(n: int) -> list[str]:
```

## Constraints
- `-10 <= n <= 25` (the output has F(n+1) strings, about 121k for n = 25)

## Examples
**Example 1**
Input: `n = 4`
Output: `["1111", "112", "121", "211", "22"]`
Explanation: These are all 5 orderings of 1s and 2s that add up to 4, sorted lexicographically.

**Example 2**
Input: `n = 5`
Output: `["11111", "1112", "1121", "1211", "122", "2111", "212", "221"]`

**Example 3** (an edge case)
Input: `n = 0`
Output: `[""]`
Explanation: The empty sum is the only one. For `n = -1` the output is `[]`.

<details><summary>Approach (spoiler)</summary>

Use backtracking on the remaining sum. At each step, append `'1'` and then `'2'` (only when the digit is no larger than what remains), recurse, and undo the append. When the remaining sum reaches 0, record the current string. Because `'1'` is always tried before `'2'`, the strings come out in lexicographic order with no sorting needed. Each path produces a distinct digit sequence, so there are no duplicates.
**Time:** O(n · F(n+1)), which is output-sensitive · **Space:** O(n) recursion depth, not counting the output

```python
def ordered_sums(n: int) -> list[str]:
    if n < 0:
        return []
    res, cur = [], []

    def bt(rem: int) -> None:
        if rem == 0:
            res.append("".join(cur))
            return
        for d in (1, 2):          # '1' before '2' -> lexicographic order
            if d <= rem:
                cur.append(str(d))
                bt(rem - d)
                cur.pop()

    bt(n)
    return res
```
</details>
