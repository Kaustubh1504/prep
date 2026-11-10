# Implement Longest-Match Text Replacement
> Google · Technical Screen · hard · Pattern: Trie, Greedy
> Source: https://prachub.com/interview-questions/implement-longest-match-text-replacement

You are given a text string and a dictionary of replacement entries. Each dictionary entry has the form `token:id`, where `token` is a string pattern and `id` is the value that should be emitted when that token is matched.

Implement a function that scans the text from left to right and produces an output sequence using greedy longest-prefix matching:

1. At the current text position, find all dictionary tokens that match the substring starting at that position.
2. If at least one token matches, choose the longest matching token, append its corresponding `id` to the output, and advance by the length of that token.
3. If no token matches, append the original character at the current position to the output and advance by one character.
4. Continue until the entire text has been processed.

Example:

```text
text = "abcdxyz"
dictionary = {
  "ab": "1",
  "abc": "2",
  "xy": "3"
}
```

Output:

```text
["2", "d", "3", "z"]
```

Explanation: At index `0`, both `"ab"` and `"abc"` match, so choose the longest token `"abc"` and output `"2"`. Then `"d"` has no match, so output it literally. Then `"xy"` matches and outputs `"3"`. Finally, `"z"` is output literally.

Follow-up: How would you adapt your design if the matching priority changed from longest match to a configurable priority rule, such as dictionary insertion order, highest score, or a custom comparator?

<details><summary>Hints (spoiler)</summary>

1. A trie lets you test all token prefixes starting at one position without checking every token from scratch.
2. While walking forward from a position, remember the last trie node that represented a complete token.
</details>
