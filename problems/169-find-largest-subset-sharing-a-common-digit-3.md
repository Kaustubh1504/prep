# Find largest subset sharing a common digit
> Google · Online Assessment · medium · Pattern: Hashing / Counting, Bit Manipulation
> Source: https://prachub.com/interview-questions/find-largest-subset-sharing-a-common-digit-3

You are given an array `nums` of length `N` (1 ≤ N ≤ 100). Every element is a **two-digit integer** between **10 and 99** (inclusive).

Select as many elements as possible such that **all selected numbers share at least one common digit** (a digit from 0 to 9). In other words, there exists a digit `d` such that every selected number contains digit `d` in either its tens or ones place.

Return the **maximum possible size** of such a selection.

Examples:
- Input: `[52, 25, 11, 52, 34, 55]` → Output: `4` (e.g., `{52, 25, 52, 55}` all contain digit `5`)
- Input: `[71, 23, 57, 15]` → Output: `2` (e.g., `{71, 57}` share digit `7`)
- Input: `[11, 33, 55]` → Output: `1` (no digit is shared by two numbers)
- Input: `[90, 90, 90]` → Output: `3` (all share digit `9` or digit `0`)

Constraints:
- `1 ≤ N ≤ 100`
- `10 ≤ nums[i] ≤ 99` and each `nums[i]` is strictly two digits.

<details><summary>Hints (spoiler)</summary>

1. Any valid subset is determined by a single digit from 0 to 9. Try checking how many numbers contain each digit.
2. Be careful with numbers like 11 or 55: the same digit appears twice, but that number should only be counted once for that digit.
</details>
