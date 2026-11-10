# Find Dictionary Matches for a Jammed String
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Hard · Pattern: Dynamic Programming, Trie

## Problem
A keyboard has sticky keys: when a key is pressed, its character can come out **one or more extra times**. So typing `"hello"` might produce `"hheelllllo"`. Keys never drop characters and never produce characters that weren't typed.

Split a string into **runs**, which are maximal blocks of one repeated character. For example, `"heelllooo"` has runs `h×1, e×2, l×3, o×3`. A dictionary word `w` **could have produced** the jammed string `s` when:
- `w` and `s` have the same sequence of run characters (the same "skeleton", e.g. `"helo"`), and
- each run in `s` is at least as long as the matching run in `w`.

A word's own repeated letters still need at least that many copies in `s`. For example, `"hello"` needs at least two `l`s, so `"helo"` can't come from `"hello"`.

Design a structure that is built once from a dictionary and then answers many queries. For each jammed string, return all distinct dictionary words that could have produced it, sorted lexicographically. If none match, return an empty list.

## Function signature
```python
class JammedMatcher:
    def __init__(self, dictionary: list[str]): ...
    def match(self, s: str) -> list[str]: ...
```

## Constraints
- `1 <= len(dictionary) <= 10^5`; `1 <= len(word) <= 50`; the dictionary may contain duplicates
- `0 <= len(s) <= 10^5`; up to `10^4` queries
- Lowercase English letters only

## Examples
**Example 1**
Input: `dictionary = ["hello", "helo", "hell", "heello", "world", "hello"]`; query `match("heelllooo")`
Output: `["heello", "hello", "helo"]`
Explanation: The skeleton is `helo`, with run lengths `[1,2,3,3]`. `"heello"` needs `[1,2,2,1]`, `"hello"` needs `[1,1,2,1]` and `"helo"` needs `[1,1,1,1]`, and all of those fit. `"hell"` has a different skeleton. The duplicate `"hello"` is reported once.

**Example 2** (a word's own repeats must be present)
Input: same dictionary; query `match("helo")`
Output: `["helo"]`

Input: same dictionary; query `match("hello")`
Output: `["hello", "helo"]`

**Example 3** (no match, and the empty string)
Input: same dictionary; query `match("help")`
Output: `[]`

Input: same dictionary; query `match("")`
Output: `[]`

<details><summary>Approach (spoiler)</summary>

Run-length encode every word into a skeleton plus a list of run counts, and bucket the words in a hash map keyed by skeleton. For a query, encode it the same way, look up the bucket that matches its skeleton exactly, and keep the words whose run counts are all at most the query's counts. Only words with the same skeleton are ever compared. A trie over the skeleton characters is an equivalent alternative: it stores each node's run-count requirements and supports walking the query's runs incrementally. It also generalises well if the rules change, for example if keys can drop characters or a run only counts as jammed at 3 or more copies, as in LeetCode 809.

**Time:** O(total dictionary length) to build; O(|s| + Σ runs of the bucket's words) per query · **Space:** O(total dictionary length)

```python
from collections import defaultdict

def runs(s):
    chars, counts = [], []
    for ch in s:
        if chars and chars[-1] == ch:
            counts[-1] += 1
        else:
            chars.append(ch)
            counts.append(1)
    return ''.join(chars), counts

class JammedMatcher:
    def __init__(self, dictionary):
        self.buckets = defaultdict(list)          # skeleton -> [(word, run counts)]
        for w in set(dictionary):
            skel, cnt = runs(w)
            self.buckets[skel].append((w, cnt))

    def match(self, s):
        skel, cnt = runs(s)
        return sorted(w for w, wc in self.buckets.get(skel, ())
                      if all(a <= b for a, b in zip(wc, cnt)))
```
</details>
