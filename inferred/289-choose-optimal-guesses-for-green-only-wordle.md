# Choose optimal guesses for green-only Wordle
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Randomized / Probability, Backtracking

## Problem
This is a version of Wordle where the only feedback is **green**. You get a dictionary of `N` distinct words, all of length `L`. Word `i` is the secret answer with probability proportional to its weight `weights[i] > 0`. After you guess a word `g`, you learn exactly which positions `j` satisfy `g[j] == answer[j]`, and nothing else. There are no yellow hints.

Every guess `g` therefore splits the candidates into groups that share the same green-position pattern. If the answer lands in group `G`, then `|G|` candidates remain. The quality of a guess is the **expected number of remaining candidates**:

`score(g) = Σ over groups G of P(answer ∈ G) · |G|`, where `P(answer ∈ G) = (Σ of weights in G) / (Σ of all weights)`

Choose the guess **from the dictionary** with the smallest score. If several words tie (within `1e-12`), return the lexicographically smallest one.

*Discussion follow-ups:* the O(N²·L) cost for thousands of words (precompute a character mask per position and get each green pattern as a bitmask with a few ANDs; sample a subset of answers), applying the rule repeatedly to play a whole game, and how this score differs from maximising entropy.

## Function signature
```python
def best_guess(words: list[str], weights: list[float]) -> str:
```

## Constraints
- `1 <= N <= 5000`, `1 <= L <= 10`, lowercase letters
- `len(weights) == N`, `weights[i] > 0`

## Examples
**Example 1** (uniform weights, tie-break)
Input: `words = ["acc","bca","bcc","ccb","ccc"], weights = [1,1,1,1,1]`
Output: `"bcc"`
Explanation: Guessing `"bcc"` produces the patterns acc → `_cc`, bca → `bc_`, bcc → `bcc`, ccb → `_c_`, ccc → `_cc`. The groups are {acc, ccc} plus three single words, so the score is (2/5)·2 + 3·(1/5)·1 = 1.4. `"ccc"` also scores 1.4, and the other words score 1.8, 2.2 and 2.2. The lexicographically smaller of the tied words is `"bcc"`.

**Example 2** (the weights change the answer)
Input: `words = ["acc","bca","bcc","ccb","ccc"], weights = [1,1,1,4,2]`
Output: `"ccc"`
Explanation: The total weight is 9. Guessing `"ccc"` gives the groups {acc, bcc} with weight 2, {bca} with 1, {ccb} with 4 and {ccc} with 2. The score is (2·2 + 1 + 4 + 2)/9 = 11/9 ≈ 1.222. `"bcc"` now scores ≈ 1.333.

**Example 3** (an edge case)
Input: `words = ["abc"], weights = [1.0]`
Output: `"abc"`

<details><summary>Approach (spoiler)</summary>

Try every dictionary word as the guess. For each guess, compute the green bitmask against every candidate answer, and keep a count and a total weight for each mask in hash maps. The score is `Σ (weight_G / W) · count_G`. Track the minimum, scanning the words in sorted order and requiring a strict improvement, so ties go to the lexicographically smallest word. With N in the low thousands, N² mask computations are the bottleneck. They can be sped up with per-position, per-letter bitsets (the answers that have letter c at position j), so that a group is the AND of L bitsets, or by scoring only a random sample of answers.
**Time:** O(N² · L) · **Space:** O(N)

```python
from collections import defaultdict

def green_mask(guess: str, answer: str) -> int:
    m = 0
    for i, (g, a) in enumerate(zip(guess, answer)):
        if g == a:
            m |= 1 << i
    return m

def best_guess(words: list[str], weights: list[float]) -> str:
    total = sum(weights)
    best_word, best_score = None, float("inf")
    for g in sorted(words):                       # lexicographic scan -> ties keep the smallest word
        size = defaultdict(int)
        mass = defaultdict(float)
        for w, p in zip(words, weights):
            key = green_mask(g, w)
            size[key] += 1
            mass[key] += p
        score = sum(mass[k] / total * size[k] for k in size)   # expected remaining candidates
        if score < best_score - 1e-12:
            best_word, best_score = g, score
    return best_word
```
</details>
