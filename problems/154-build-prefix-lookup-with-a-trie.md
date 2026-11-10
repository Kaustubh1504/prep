# Build Prefix Lookup with a Trie
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Trie

## Problem
You are given a list of `words` (the dictionary) and a list of `queries`. Each query is a prefix. For each query, return every dictionary word that starts with that prefix.

Rules:
- Return each query's matches in **lexicographic order**.
- **Duplicates are kept:** if a word appears `c` times in `words`, it appears `c` times in every result that matches it.
- A word counts as starting with itself, so a query equal to a word includes that word.
- If no word has the prefix, that query's result is an empty list.
- The empty query `""` matches every word.

Build a trie over `words` once, then answer each query by walking to the prefix node and collecting the words beneath it. Don't re-scan the whole dictionary for each query.

## Function signature
```python
def prefix_lookup(words: list[str], queries: list[str]) -> list[list[str]]:
```

## Constraints
- `0 <= len(words) <= 10^5`; `1 <= len(words[i]) <= 50`
- `1 <= len(queries) <= 10^4`; `0 <= len(queries[j]) <= 50`
- All strings contain only lowercase English letters `a`-`z`
- Total output size fits in memory

## Examples
**Example 1**
Input: `words = ["apple","app","apply","banana","ape"]`, `queries = ["ap","app","b","c"]`
Output: `[["ape","app","apple","apply"], ["app","apple","apply"], ["banana"], []]`

**Example 2** (duplicates, the empty prefix, and a prefix longer than every word)
Input: `words = ["dog","do","dog"]`, `queries = ["","dog","dogs"]`
Output: `[["do","dog","dog"], ["dog","dog"], []]`

**Example 3** (empty dictionary)
Input: `words = []`, `queries = ["a"]`
Output: `[[]]`

<details><summary>Approach (spoiler)</summary>

Insert every word into a trie and store, at each node, a count of how many words end there (a count instead of a boolean, so duplicates survive). For a query, follow its characters from the root. If an edge is missing, the answer is empty. Otherwise, run a DFS from the prefix node, visiting children in alphabetical order and emitting the current string `count` times at each node. A node's own word is emitted before its children's, so the output comes out lexicographically sorted without a separate sort.

**Time:** O(total word length) to build, then O(|q| + size of the answer) per query · **Space:** O(total word length)

```python
class TrieNode:
    __slots__ = ("children", "count")
    def __init__(self):
        self.children = {}
        self.count = 0

def prefix_lookup(words, queries):
    root = TrieNode()
    for w in words:
        node = root
        for ch in w:
            node = node.children.setdefault(ch, TrieNode())
        node.count += 1

    def collect(node, path, out):
        out.extend([''.join(path)] * node.count)
        for ch in sorted(node.children):
            path.append(ch)
            collect(node.children[ch], path, out)
            path.pop()

    res = []
    for q in queries:
        node = root
        for ch in q:
            node = node.children.get(ch)
            if node is None:
                break
        out = []
        if node is not None:
            collect(node, list(q), out)
        res.append(out)
    return res
```
</details>
