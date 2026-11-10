# Check if all substrings are anagrams of words
> Google · Technical Screen · medium · Pattern: Sliding Window, Hashing / Counting
> Source: https://prachub.com/interview-questions/check-if-all-substrings-are-anagrams-of-words

You are given a string `s` (letters only) and access to an English dictionary `dict` (a set of valid words).

Return `true` if **every contiguous substring** of `s` with length **>= 3** can be **rearranged (anagrammed)** into a valid dictionary word.

Formally, for every substring `t = s[i..j]` with `|t| >= 3`, there exists some word `w ∈ dict` such that `w` is a permutation of `t` (same multiset of characters). Otherwise return `false`.

Clarifications:
- Substring means **contiguous**.
- “Can be rearranged into a word” means the substring and the dictionary word have exactly the same character counts.

Example:
- If `t = "act"`, it passes if the dictionary contains any of `{ "act", "cat", "tac" }`.

<details><summary>Hints (spoiler)</summary>

1. Two strings are anagrams exactly when their 26-letter frequency counts are the same.
2. Group dictionary words by length, then use a sliding window over `s` for each possible substring length to compare frequency signatures efficiently.
</details>
