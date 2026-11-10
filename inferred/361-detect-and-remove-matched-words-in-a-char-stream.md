# Detect and remove matched words in a char stream
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Trie, String Processing

## Problem
You are given a dictionary `words` and a character `stream`, processed one character at a time. Maintain a **buffer**, initially empty.

For each incoming character:
1. Append it to the end of the buffer.
2. If some dictionary word is a **suffix** of the buffer, remove that word's characters from the end of the buffer and report the word. If several dictionary words are suffixes at once, choose the **longest** one.
3. Otherwise report the empty string `""` for this character.

Only one removal happens per incoming character; after a removal, the remaining buffer is not re-checked until the next character arrives. Removals can make characters that were separated become adjacent, so later matches may span text from before and after a removed word.

Return a pair `(reports, buffer)`: `reports[i]` is the word removed after the `i`-th character (or `""`), and `buffer` is the final buffer contents.

## Function signature
```python
from typing import List, Tuple

def process_stream(words: List[str], stream: str) -> Tuple[List[str], str]:
    ...
```

## Constraints
- `1 <= len(words) <= 10^4`, `1 <= len(word) <= 50`, total word length `<= 10^5`
- `0 <= len(stream) <= 10^5`
- All characters are lowercase English letters

## Examples
**Example 1**
Input: `words = ["ab", "cd"]`, `stream = "xabcd"`
Output: `(["", "", "ab", "", "cd"], "x")`
Explanation: After `x a b` the buffer ends with `ab`, which is removed. Then `c d` forms `cd`, removed as well, leaving `x`.

**Example 2** (longest match wins)
Input: `words = ["ab", "cab"]`, `stream = "cab"`
Output: `(["", "", "cab"], "")`
Explanation: When `b` arrives, both `ab` and `cab` are suffixes of `cab`; the longer one is removed.

**Example 3** (matches across a removal)
Input: `words = ["abc"]`, `stream = "aabcbc"`
Output: `(["", "", "", "abc", "", "abc"], "")`
Explanation: After four characters the buffer `aabc` loses `abc`, leaving `a`. The next `b c` turn it back into `abc`, which is removed too.

**Example 4** (an edge case)
Input: `words = ["ab"]`, `stream = ""`
Output: `([], "")`

<details><summary>Approach (spoiler)</summary>

Insert every word **reversed** into a trie. After appending a character, walk the trie from the last buffer character backwards; each trie node that ends a word is a suffix match, and continuing the walk to its end finds the longest one. The walk stops as soon as no trie edge matches, so it costs at most `L` steps (longest word length) per character. Keep the buffer as a list (stack) so the removal is a constant-time-per-character truncation from the end. A brute force that checks every suffix length against a hash set costs O(L²) per character because of substring hashing.
**Time:** O(total word length + |stream| · L) · **Space:** O(total word length + |stream|)

```python
from typing import List, Tuple

def process_stream(words: List[str], stream: str) -> Tuple[List[str], str]:
    root = {}
    END = "$"
    for w in words:
        node = root
        for ch in reversed(w):
            node = node.setdefault(ch, {})
        node[END] = w

    buf: List[str] = []
    reports: List[str] = []
    for ch in stream:
        buf.append(ch)
        node, match = root, ""
        i = len(buf) - 1
        while i >= 0 and buf[i] in node:
            node = node[buf[i]]
            if END in node:
                match = node[END]   # keep walking: prefer the longest word
            i -= 1
        if match:
            del buf[len(buf) - len(match):]
        reports.append(match)
    return reports, "".join(buf)
```
</details>
