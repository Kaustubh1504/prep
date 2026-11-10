# Remove elements to avoid k-prefix duplicates
> Google · Onsite · medium · Pattern: Greedy
> Source: https://prachub.com/interview-questions/remove-elements-to-avoid-k-prefix-duplicates

{"blocks": [{"key": "4d512a58", "text": "Question", "type": "header-two", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {}}, {"key": "f65b7e87", "text": "Given two lists listA and listB and an integer k, delete elements from listB so that the first k elements of the new listB share no value with the first k elements of listA. Follow-up: design an O(n) time solution. Follow-up: extend to a list of lists, an integer k, and an integer d such that for each list its first k elements share no value with the first k elements of any of the previous d lists.", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {}}], "entityMap": {}}

<details><summary>Hints (spoiler)</summary>

1. Build a set of the first k elements of listA for O(1) membership checks.
2. Greedily scan listB: keep elements not in the forbidden set until you have collected k safe elements; delete forbidden ones encountered before that.
3. After you have k safe elements, keep all remaining elements since they do not affect the first k.
4. If you cannot collect k safe elements from listB, return an empty list.
5. Follow-up: For a list of lists with window d, maintain a sliding union (via a frequency map) of the first k elements from the last d processed lists and apply the same greedy selection to each new list.
</details>

<details><summary>Approach (spoiler)</summary>

**Goal.** Delete the fewest elements from `listB` (keeping the order of survivors) so the new `listB[:k]` shares no value with `listA[:k]`. The key observation: the minimum-deletion result keeps the *earliest* `k` elements of `listB` that avoid the forbidden values, then keeps everything after them untouched.

**Why that's optimal.** Any valid answer needs `k` "safe" values (values not in `listA[:k]`) sitting at the front. Greedily taking the earliest such safe values minimizes how many *unsafe* elements we must skip — every unsafe element seen before we've collected `k` safe ones must be deleted, and none of them could ever be kept without violating the prefix constraint. Once `k` safe values are in place, no later element can affect the first `k` positions, so deleting any of them would only add unnecessary deletions; we keep them all.

**Steps in the code.**
- Edge case: if `k <= 0` the constraint is vacuous, so return a copy of `listB`.
- Build `forbidden = set(listA[:k])` for O(1) membership tests.
- Scan `listB` once with a counter `safe`. While `safe < k`: append `x` and increment `safe` if `x not in forbidden`; otherwise skip (delete) it. Once `safe == k`, append every remaining element unconditionally.
- If the scan ends with `safe < k`, there aren't enough safe values, so no valid configuration exists — return `[]`.

The `set` gives constant-time forbidden checks, and the single linear pass produces exactly the minimum-deletion ordering. Test 3 illustrates the subtlety: `k=1`, `listA[:1]={1}`, `listB=[3,1,2,4,5]` → `3` is immediately safe, so the rest (including `1`) is kept verbatim, yielding `[3,1,2,4,5]`.

**Time:** O(len(listA) + len(listB)) · **Space:** O(k)
</details>
