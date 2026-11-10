# Build a next-word frequency predictor
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Easy · Pattern: Design / Data Structure, Hashing / Counting

## Problem
Design a class that learns from a corpus of sentences and predicts the most likely next word.

- `NextWordPredictor(sentences)`: each sentence is a string of words separated by whitespace. Runs of several spaces, and leading or trailing spaces, can occur. A sentence can also be empty. For every pair of consecutive words `(a, b)` **inside one sentence**, record that `b` followed `a`. Pairs never span two sentences, so the last word of one sentence is not followed by the first word of the next.
- `predict(word)`: return the word that most often followed `word` in the corpus. If several words are tied for the highest count, return the **lexicographically smallest** one. If `word` never appeared, or only ever appeared as the last word of a sentence, return `""`.

Words are case-sensitive. `predict` will be called many times, so do the work during preprocessing and make each query O(1).

## Function signature
```python
class NextWordPredictor:
    def __init__(self, sentences: list[str]): ...
    def predict(self, word: str) -> str: ...
```

## Constraints
- `0 <= len(sentences) <= 10^4`; total number of words `<= 10^6`
- Words are non-empty and contain no whitespace
- Up to `10^5` calls to `predict`

## Examples
**Example 1**
Input: `sentences = ["i love coding", "i love coffee", "i love coding", "coding is fun"]`; queries `predict("i")`, `predict("love")`, `predict("coding")`, `predict("fun")`, `predict("java")`
Output: `["love", "coding", "is", "", ""]`
Explanation: `love` was followed by `coding` twice and by `coffee` once. `fun` only appears as the last word of a sentence, and `java` never appears.

**Example 2** (tie-breaking)
Input: `sentences = ["the cat", "the bat"]`; query `predict("the")`
Output: `"bat"`
Explanation: `cat` and `bat` both have count 1, and `bat` is lexicographically smaller.

**Example 3** (whitespace, empty sentences, case sensitivity)
Input: `sentences = ["a b", "a c", "  a   c  b ", "", "b"]`; queries `predict("a")`, `predict("c")`, `predict("b")`, `predict("A")`
Output: `["c", "b", "", ""]`
Explanation: `a` was followed by `c` twice and by `b` once. `b` is only ever the last word of a sentence, and `"A"` is a different word from `"a"`.

<details><summary>Approach (spoiler)</summary>

Build a nested hash map `counts[word][next] = frequency` in one pass over the corpus, splitting each sentence on whitespace and counting adjacent pairs. Then, still during preprocessing, pick each word's best successor with the key `(-count, next)`, which handles the tie-break. `predict` is then one dictionary lookup. This is the preprocessing-versus-query trade-off: O(total words) up front for O(1) queries. If the corpus can be updated online, you would instead keep a running best per word and update it on each increment.

**Time:** O(total words) to build, O(1) per query · **Space:** O(distinct pairs)

```python
from collections import defaultdict

class NextWordPredictor:
    def __init__(self, sentences):
        counts = defaultdict(lambda: defaultdict(int))
        for s in sentences:
            words = s.split()
            for a, b in zip(words, words[1:]):
                counts[a][b] += 1
        self.best = {
            w: min(nxt.items(), key=lambda kv: (-kv[1], kv[0]))[0]
            for w, nxt in counts.items()
        }

    def predict(self, word):
        return self.best.get(word, "")
```
</details>
