# Parse a Nested-List String and Compute Its Weighted Sum
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Medium · Pattern: Stack / Parsing

## Problem
You are given a string `s` that represents a valid nested list, such as `"[1,[4,[6]]]"`. The outermost brackets are depth 1, a list inside it is depth 2, and so on. Elements are either non-negative integers or nested lists, separated by commas. Spaces can appear anywhere between tokens. Lists may be empty (`[]`).

Return the **depth-weighted sum**: the sum over every integer of `value × depth`, where `depth` is the number of lists that contain the integer. Parse the string directly; don't call `eval` or a JSON parser.

Be careful with the details. Integers can have several digits, so `123` is one number and not three. A number ends at a comma, a bracket or a space, and that includes the last number before the closing `]`. Empty lists contribute nothing. A `0` counts as a number but adds 0 to the sum.

## Function signature
```python
def depth_sum(s: str) -> int:
```

## Constraints
- `2 <= len(s) <= 10^5`
- `s` is a syntactically valid nested list whose outermost element is a list
- Each integer is in `[0, 10^9]`; nesting depth is at most `10^4`
- The result fits in a 64-bit integer

## Examples
**Example 1**
Input: `s = "[1,[4,[6]]]"`
Output: `27`
Explanation: `1*1 + 4*2 + 6*3 = 27`.

**Example 2**
Input: `s = "[[1,1],2,[1,1]]"`
Output: `10`
Explanation: The four 1s are at depth 2, giving 8. The 2 is at depth 1, giving 2.

**Example 3** (empty lists, spaces, multi-digit numbers)
Input: `s = "[ [ ], [[ ]], 10 , [ 23 ] ]"`
Output: `56`
Explanation: `10*1 + 23*2 = 56`.

Input: `s = "[]"`
Output: `0`

<details><summary>Approach (spoiler)</summary>

Make a single left-to-right pass with a depth counter. A full stack isn't needed, because only the current depth matters. Build a number digit by digit while you see digits. When the first non-digit arrives (`,`, `[`, `]` or a space), add `number × depth` and reset. Then `[` increments the depth and `]` decrements it. The number is flushed **before** the bracket changes the depth, so the last number in a list, like the `6` in `[6]`, is weighted at its own depth. A final check after the loop guards against a trailing number.

**Time:** O(len(s)) · **Space:** O(1)

```python
def depth_sum(s: str) -> int:
    depth = total = 0
    num = None
    for ch in s:
        if ch.isdigit():
            num = (num or 0) * 10 + int(ch)
            continue
        if num is not None:
            total += num * depth
            num = None
        if ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
    if num is not None:
        total += num * depth
    return total
```
</details>
