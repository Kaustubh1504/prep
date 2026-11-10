# Check Digits and Combine Ranges
> Google · Technical Screen · hard · Pattern: Math / Number Theory, Two Pointers, Intervals / Sweep Line
> Source: https://prachub.com/interview-questions/check-digits-and-combine-ranges

You are asked to solve two independent coding tasks.

### Task 1: Check Whether an Integer Reads the Same Backward

Given an integer `x`, return `true` if its decimal representation reads the same from left to right and from right to left; otherwise return `false`.

Requirements and edge cases:
- Negative integers should return `false` because of the leading minus sign.
- You may assume `x` fits in a signed 32-bit integer.
- Try to solve it without converting the integer to a string.

Example:
```text
Input: x = 121
Output: true
```

```text
Input: x = -121
Output: false
```

```text
Input: x = 10
Output: false
```

### Task 2: Combine Overlapping Ranges

Given an array of intervals `intervals`, where each interval is represented as `[start, end]`, combine all overlapping intervals and return an array of non-overlapping intervals that covers exactly the same ranges.

Requirements and edge cases:
- Intervals may be provided in any order.
- Two intervals overlap if they share at least one point. For example, `[1, 4]` and `[4, 5]` should be combined into `[1, 5]`.
- Return the intervals in increasing order by start value.

Example:
```text
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
```

```text
Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
```

<details><summary>Hints (spoiler)</summary>

1. A negative number can never be a palindrome because the minus sign only appears on the left.
2. Try reversing only the second half of the digits instead of the whole number.
</details>
