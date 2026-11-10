# Find secret word with match-count feedback
> Google · Technical Screen · hard · Pattern: String Processing
> Source: https://prachub.com/interview-questions/find-secret-word-with-match-count-feedback

## Problem
You are given a list of **unique** lowercase words, all of the same length (e.g., length = 6). One of these words is a **secret** word.

You can interact with a black-box API:

- `matchCount(guess) -> int`: when you submit a word `guess` from the list, the API returns the number of positions `i` such that `guess[i] == secret[i]` (i.e., exact character match at the same index).

You are allowed to call `matchCount` **at most 10 times**.

### Task
Design/implement a function (e.g., `findSecretWord(words)`) that uses the API to identify the secret word within the guess limit.

### Notes / Constraints
- `words` contains between 1 and 100 words.
- All words have equal length `L` (commonly `L = 6`).
- Every guess must be a word from `words`.
- After each API response, you may adapt your next guess.

### What to return
Depending on the interface, you may either:
- return the identified secret word, or
- stop once `matchCount(guess) == L` (found it).

(Your interviewer may treat this as an interactive problem; focus on strategy + correctness under the 10-guess constraint.)

<details><summary>Hints (spoiler)</summary>

1. After a guess returns `k`, any valid remaining candidate must also have exactly `k` matching positions with that guess.
2. A strong strategy is to choose the next guess that splits the remaining candidates as evenly as possible, minimizing the size of the largest feedback bucket.
</details>
