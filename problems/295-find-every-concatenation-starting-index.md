# Find Every Concatenation Starting Index
> Google · Other · hard · Pattern: Sliding Window, Hashing / Counting
> Source: https://prachub.com/interview-questions/find-every-concatenation-starting-index

### Problem

You receive a string `text` and an array of strings `pieces`. Every piece has the same positive length. Return every zero-based starting index in `text` where a contiguous substring consists of all the pieces concatenated in some order.

Each occurrence in `pieces` must be used exactly once in that substring. If a word occurs twice in the array, the substring must contain two copies of that word. Do not insert gaps or rearrange characters within a piece. Return each qualifying starting index once, in any order.

### Examples

**Example 1**

```text
Input: text = "catdogcat", pieces = ["cat", "dog"]
Output: [3, 0]
```

Starting at `0` gives `"catdog"`, and starting at `3` gives `"dogcat"`. Either order of the two indices is acceptable.

**Example 2**

```text
Input: text = "aaaaaa", pieces = ["aa", "aa"]
Output: [2, 0, 1]
```

Each valid substring has length four and uses both copies of `"aa"`. The substrings overlap, and valid starts need not all have the same remainder when divided by the piece length.

### Constraints & Assumptions

- `1 <= text.length <= 10^4`
- `1 <= pieces.length <= 5000`
- Every piece has length from 1 through 30, inclusive, and all piece lengths agree.
- `text` and every piece contain lowercase English letters only.
- Pieces may repeat. Matching is based on their exact values and required multiplicities.
- The requested substring length is `pieces.length * pieces[0].length`. If that exceeds `text.length`, the result is empty.
- Include all valid starts, including overlapping occurrences. No index ordering or particular algorithm is required.

### Clarifying Questions to Ask

- Are duplicate words separate required occurrences? Yes; their multiplicities must match.
- Must the pieces retain their input order? No; any permutation of the piece occurrences can form a match.

```hint Keep the units consistent
All words have the same length, but a candidate starting index can be any character position in the text.
```

### What a Strong Answer Covers

- An exact multiplicity check for all pieces, rather than simple membership in a set.
- A complete search over possible starts without missing overlaps or a different alignment.
- A proof that each returned index describes precisely the required concatenation and appears once.
- Time and space bounds that state the cost of extracting and hashing word-sized substrings.

### Follow-up Questions

- How do substring construction and word hashing affect the time bound when a word has length greater than one?
