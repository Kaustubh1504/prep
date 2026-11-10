# Find best-matching binary pattern with wildcards
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · hard · Pattern: String Processing, Dynamic Programming, Design / Data Structure

## Problem
You are given a list of **rules** and a list of **queries**.

- Each rule is a pair `[pattern, label]`. A `pattern` is a non-empty string over the characters `'0'`, `'1'` and the wildcard `'.'`, where `'.'` matches exactly one bit (either `'0'` or `'1'`). Different patterns can have different lengths.
- Each query is a binary string (characters `'0'` / `'1'`, possibly empty).

A rule **matches** a query if its pattern matches some contiguous substring of the query of the same length as the pattern (i.e. the pattern may be aligned at any starting position of the query, and must fit fully inside it).

For each query, return the label of the **best** matching rule:
1. The rule with the **longest** pattern wins.
2. Ties on length are broken by the **earliest** rule in the input list.
3. If no rule matches, the answer for that query is `None`.

Return the answers in query order. Because there may be many queries, think about what you can preprocess once from the rules so that each query is cheap.

## Function signature
```python
from typing import List, Optional

def best_matching_labels(rules: List[List[str]], queries: List[str]) -> List[Optional[str]]:
    ...
```

## Constraints
- `1 <= len(rules) <= 1000`, `1 <= len(queries) <= 1000`
- `1 <= len(pattern) <= 64`, `0 <= len(query) <= 64`
- Patterns contain only `'0'`, `'1'`, `'.'`; queries contain only `'0'`, `'1'`
- Labels are arbitrary non-empty strings (not necessarily unique)

## Examples
**Example 1**
Input: `rules = [["1.1","A"], ["10","B"], ["0..0","C"], ["111","D"]]`, `queries = ["0101", "1001", "000", "10110"]`
Output: `["A", "B", None, "C"]`
Explanation: `"0101"` contains `"101"`, which matches `"1.1"` (length 3); nothing of length 4 matches. `"1001"` only matches `"10"`. `"000"` matches nothing (`"0..0"` is longer than the query). `"10110"` contains `"0110"`, matching `"0..0"` (length 4), which beats `"1.1"` (length 3).

**Example 2** (an edge case)
Input: `rules = [["11","X"], ["..","Y"]]`, `queries = ["1", "011", ""]`
Output: `[None, "X", None]`
Explanation: Patterns longer than the query can never match. For `"011"`, both rules match with length 2, so the earlier rule `"X"` wins the tie.

<details><summary>Approach (spoiler)</summary>

Preprocess the rules once: sort them by (length descending, original index ascending), and compile each pattern into a pair of integers `(mask, value)` where `mask` has a 1 for every fixed bit and `value` holds those fixed bits. A substring `s` (read as an integer) matches iff `s & mask == value`, an O(1) check. For each query, walk rules in sorted order and return the first one that matches any window of the right length; the window integers for each length are computed once per query and cached. The first hit is the best by construction.
**Time:** O(R log R + Q · R · |q|) worst case · **Space:** O(R + |q|²) per query

```python
from typing import List, Optional

def best_matching_labels(rules: List[List[str]], queries: List[str]) -> List[Optional[str]]:
    compiled = []
    for idx, (pat, label) in enumerate(rules):
        mask = int(''.join('0' if c == '.' else '1' for c in pat), 2)
        val = int(''.join('0' if c == '.' else c for c in pat), 2)
        compiled.append((-len(pat), idx, mask, val, label))
    compiled.sort()  # longest first, then earliest rule

    out = []
    for q in queries:
        n = len(q)
        windows = {}  # length -> integer values of all windows of that length
        ans = None
        for neg_len, _, mask, val, label in compiled:
            L = -neg_len
            if L > n:
                continue
            if L not in windows:
                windows[L] = [int(q[i:i + L], 2) for i in range(n - L + 1)]
            if any((s & mask) == val for s in windows[L]):
                ans = label
                break
        out.append(ans)
    return out
```
</details>
