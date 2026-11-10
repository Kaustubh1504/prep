# Check if all substrings are dictionary words
> Google · Technical Screen · medium · Pattern: Dynamic Programming, String Processing
> Source: https://prachub.com/interview-questions/check-if-all-substrings-are-dictionary-words

You are given a string `s` (letters only) and access to an English dictionary `dict` (a set of valid words).

Return `true` if **every contiguous substring** of `s` with length **>= 3** is a valid dictionary word (i.e., for all `i, j` with `0 <= i <= j < n` and `j - i + 1 >= 3`, `s[i..j] ∈ dict`). Otherwise return `false`.

Clarifications:
- Substring means **contiguous**.
- You may assume dictionary lookups are available (e.g., `dict.contains(word)`), or you can preprocess the dictionary.

Example:
- If `s = "cats"`, you must check `"cat"`, `"ats"`, and `"cats"` (and any other substrings of length >= 3).

<details><summary>Hints (spoiler)</summary>

1. Because len(s) is small, a DFS/backtracking solution that generates subsequences is feasible.
2. Repeated characters can create duplicate subsequences. A local set at each recursion depth can help avoid exploring duplicate branches.
</details>
