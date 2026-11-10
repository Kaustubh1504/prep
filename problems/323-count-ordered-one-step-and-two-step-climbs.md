# Count Ordered One-Step and Two-Step Climbs
> Google · Other · easy · Pattern: Dynamic Programming, Backtracking, Math / Number Theory
> Source: https://prachub.com/interview-questions/count-ordered-one-step-and-two-step-climbs

### Problem

A staircase has `steps` steps. On each move you climb either one step or two steps. Return the number of different move sequences that land exactly at the top.

The order of moves matters: taking one step and then two is different from taking two and then one.

### Examples

**Example 1**

```text
Input: steps = 4
Output: 5
```

The move sequences are `1+1+1+1`, `1+1+2`, `1+2+1`, `2+1+1`, and `2+2`.

**Example 2**

```text
Input: steps = 5
Output: 8
```

Eight different sequences of one-step and two-step moves finish exactly five steps above the start.

### Constraints

- `1 <= steps <= 45`
