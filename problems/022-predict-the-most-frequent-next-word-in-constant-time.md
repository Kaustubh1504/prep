# Predict the Most Frequent Next Word in Constant Time
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Medium · Pattern: Design / Data Structure, Hashing / Counting

## Problem
You are given training data as a list of word sequences (e.g. sentences). Within each sequence, every pair of adjacent words `(w, next)` counts as one observation that `next` followed `w`. Pairs never cross sequence boundaries: the last word of one sequence is **not** followed by the first word of the next.

After training, answer a list of queries. For each query word `q`, return the word that most frequently followed `q` in the training data.

Rules:
- Repeated pairs accumulate: if `"a b"` appears 3 times across all sequences, the successor `b` has frequency 3 for `a`.
- **Ties:** if several successors share the maximum frequency, return the one whose pair `(q, successor)` was observed **first** in the training data (scanning sequences in order, and words left to right within each sequence).
- If `q` never appears with a successor (it never appeared, or it only ever appeared as the last word of a sequence), return `None`.
- Training input can be large; preprocessing should be linear in the number of pairs, and each query must be answered in **average O(1)** time (precompute the best successor for every word).

## Function signature
```python
from typing import List, Optional

def predict_next_words(sequences: List[List[str]], queries: List[str]) -> List[Optional[str]]:
    ...
```

## Constraints
- `0 <= len(sequences) <= 10^5`, total number of words across all sequences `<= 10^6`
- `1 <= len(queries) <= 10^5`
- Words are non-empty strings of lowercase letters, length `<= 20`
- Words are case-sensitive and compared exactly

## Examples
**Example 1**
Input: `sequences = [["i","like","tea"],["i","like","coffee"],["you","like","coffee"]]`, `queries = ["i","like","coffee","you"]`
Output: `["like", "coffee", None, "like"]`
Explanation: `like` is followed by `tea` once and `coffee` twice, so `coffee` wins. `coffee` only ever ends a sequence, so it has no prediction.

**Example 2** (tie and sequence boundary)
Input: `sequences = [["a","b"],["a","c"],["c"]]`, `queries = ["a","c","z"]`
Output: `["b", None, None]`
Explanation: `a -> b` and `a -> c` both have frequency 1; `a -> b` was seen first. `c` is never followed by anything (the single-word sequence produces no pair and pairs do not cross sequences). `z` was never seen.

**Example 3**
Input: `sequences = [["x","y","x","z"]]`, `queries = ["x","y","z"]`
Output: `["y", "x", None]`

<details><summary>Approach (spoiler)</summary>

Use a hash map `word -> {successor: [frequency, first_seen_index]}`, assigning a global increasing index the first time each distinct pair is seen. After training, scan each word's successors once and keep the one with the highest frequency, breaking ties by smallest first-seen index, storing it in `best[word]`. Each query is then a single hash lookup.
**Time:** O(N + U + Q) where N = number of adjacent pairs, U = distinct pairs, Q = queries · **Space:** O(U)

```python
from typing import List, Optional

def predict_next_words(sequences: List[List[str]], queries: List[str]) -> List[Optional[str]]:
    counts = {}          # word -> {next_word: [freq, first_seen]}
    order = 0
    for seq in sequences:
        for a, b in zip(seq, seq[1:]):
            succ = counts.setdefault(a, {})
            if b in succ:
                succ[b][0] += 1
            else:
                succ[b] = [1, order]
                order += 1
    best = {}
    for w, succ in counts.items():
        best[w] = min(succ.items(), key=lambda kv: (-kv[1][0], kv[1][1]))[0]
    return [best.get(q) for q in queries]
```
</details>
