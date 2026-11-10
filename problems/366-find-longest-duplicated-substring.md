# Find longest duplicated substring
> Google · Technical Screen · hard · Pattern: Binary Search, String Processing
> Source: https://prachub.com/interview-questions/find-longest-duplicated-substring

You are given a string `s` consisting of lowercase English letters.

A **substring** of `s` is any contiguous sequence of characters, i.e., `s[i..j)` for `0 ≤ i < j ≤ len(s)`.

Design an algorithm to find **any one** of the longest substrings that appears **at least twice** in `s`. The two occurrences may overlap. If no substring appears at least twice, return the empty string.

### Requirements
- Input: a string `s` of length `n` (e.g., `1 ≤ n ≤ 2 × 10^5`).
- Output: a string representing one of the longest duplicated substrings.
- Aim for an algorithm substantially better than the naive `O(n^2)` substring comparison approach.

### Examples
- `s = "banana"`
  - Possible duplicated substrings: "a", "an", "ana"
  - Longest length is 3 ("ana"), so acceptable outputs include `"ana"`.
- `s = "abcd"`
  - No duplicated substring, so output should be `""` (empty string).

Describe your algorithm, its time and space complexity, and how it scales for large `n`.

<details><summary>Hints (spoiler)</summary>

1. All duplicated substrings can be represented compactly using a suffix-based structure such as a suffix array or suffix automaton.
2. In a suffix automaton, each state represents substrings with the same set of ending positions. If a state is reached by at least two end positions, the longest substring represented by that state is duplicated.
</details>
