# Measure the Longest Segment of Distinct Characters
> Google · Other · medium · Pattern: Sliding Window
> Source: https://prachub.com/interview-questions/measure-the-longest-segment-of-distinct-characters

### Problem

Given the string `text`, return the greatest length of a contiguous substring whose characters are all different. Return a length, not the substring itself.

Characters retain their usual identity: an uppercase letter and its lowercase counterpart are different characters. Digits, punctuation, and spaces participate in the same duplicate check as letters. A subsequence formed by skipping positions does not qualify.

Preserve the callable interface of `lengthOfLongestSubstring`: one string argument and an integer result.

### Examples

**Example 1**

```text
Input: text = "abcaefb"
Output: 5
```

The contiguous segment `"bcaef"` has five different characters. No six-character segment avoids a repeated character.

**Example 2**

```text
Input: text = "zzzz"
Output: 1
```

Every segment longer than one character repeats `z`.

### Constraints

- The input has between `0` and `100000` characters.
- Its characters are English letters, digits, symbols, and spaces.
- An empty input has answer `0`.
