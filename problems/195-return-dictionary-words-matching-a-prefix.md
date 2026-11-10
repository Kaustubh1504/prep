# Return dictionary words matching a prefix
> Google · Technical Screen · medium · Pattern: Trie
> Source: https://prachub.com/interview-questions/return-dictionary-words-matching-a-prefix

You are given a list of strings `words` (a dictionary) and a string `prefix`.

Return all words in `words` that start with `prefix`.

Clarifications/constraints:
- Matching is case-sensitive.
- If no words match, return an empty list.
- If `words` contains duplicates, include duplicates in the output.
- You may return the result in any order unless the interviewer asks for a specific ordering (e.g., lexicographic).

<details><summary>Hints (spoiler)</summary>

1. Scan through the list once and decide for each word whether it begins with the prefix.
2. Be careful with duplicates and with the case where `prefix` is an empty string.
</details>
