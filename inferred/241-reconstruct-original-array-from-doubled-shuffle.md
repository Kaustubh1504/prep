# Reconstruct original array from doubled shuffle
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Hashing / Counting, Sorting; Greedy

## Problem
An integer array `original` was turned into `changed` like this: for every element `x` of `original`, the value `2·x` was appended, and the resulting array was shuffled. So `changed` holds every original value together with its double, in arbitrary order.

Given `changed`, return `original` sorted in **ascending order**. If `changed` cannot be a doubled array, return an empty list. That happens when its length is odd or when the elements can't be split into `(x, 2x)` pairs.

Edge cases:
- Values can be **negative**. The double of `-3` is `-6`, which is more negative, so the pairing has to go by absolute value rather than by plain sorted order.
- **Zero** is its own double, so zeros must come in pairs. Every two zeros add one `0` to `original`.
- Duplicates are allowed.

## Function signature
```python
def find_original_array(changed: list[int]) -> list[int]:
```

## Constraints
- `0 <= len(changed) <= 10^5`
- `-10^5 <= changed[i] <= 10^5`

## Examples
**Example 1**
Input: `changed = [1,3,4,2,6,8]`
Output: `[1,3,4]`
Explanation: The pairs are (1,2), (3,6) and (4,8).

**Example 2**
Input: `changed = [-3,-6,2,4,-1,-2]`
Output: `[-3,-1,2]`
Explanation: The pairs are (-1,-2), (2,4) and (-3,-6).

**Example 3** (an edge case)
Input: `changed = [6,3,0,1]`
Output: `[]`
Explanation: The `0` has no partner zero, and `1` has no `2`.

**Example 4** (an edge case)
Input: `changed = [0,0,0,0]`
Output: `[0,0]`. For `[0,0,0]` the output is `[]`, since the length is odd.

**Example 5**
Input: `changed = [2,1,2,4,1,2]`
Output: `[1,1,2]`

<details><summary>Approach (spoiler)</summary>

Count every value, then process the distinct values in increasing **absolute value**. The smallest remaining `|x|` can't be anyone's double (its half would have an even smaller absolute value and would already have been processed), so every remaining copy of `x` must be an original paired with `2x`. If `count[2x] < count[x]`, return `[]`. Otherwise subtract the copies used. Zero is a special case: its count has to be even. Every step is forced, so the greedy choice is correct and the answer is unique as a multiset.
**Time:** O(n + k log k) for k distinct values · **Space:** O(k)

```python
from collections import Counter
def find_original_array(changed):
    if len(changed) % 2:
        return []
    cnt = Counter(changed)
    original = []
    for x in sorted(cnt, key=abs):
        c = cnt[x]
        if c == 0:
            continue
        if x == 0:
            if c % 2:
                return []
            original.extend([0] * (c // 2))
            cnt[0] = 0
            continue
        if cnt[2 * x] < c:
            return []
        cnt[2 * x] -= c
        original.extend([x] * c)
    return sorted(original)
```
</details>
