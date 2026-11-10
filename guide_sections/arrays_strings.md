# Arrays & Strings

Seven patterns, 91 problems. Patterns are ordered by how often they show up in interviews. Each cluster gives one anchor to solve first, then explains what changes in each variant.

---

## Sliding Window

**Recognise it when:**
- "longest / shortest **contiguous** subarray or substring such that …" and the condition is **monotone** in the window: growing it can only make it "more invalid" (or "more valid").
- "at most K distinct", "no repeated characters", "contains all characters of T", "sum ≥ target with **positive** numbers".
- "for every window of size k, report …" (fixed window: mean, median, max, anagram signature).
- "two equal values within distance k" means a window of the last k indices.
- Negative numbers combined with a sum target means it is **not** a window. Use prefix sums + hashmap instead.

**Core idea:** Two indices `l ≤ r` mark the current window, and both only move forward. That works because the validity condition is monotone. If `[l, r]` is invalid for a "longest" query, every window `[l, r']` with `r' > r` is invalid too, so `l` can advance for good. Each element enters once and leaves once, which gives O(n). Keep a small summary of the window (a counter, a distinct count, a sum, heaps) that you can update in O(1) or O(log n) per add/remove.

**Skeleton:**
```python
def window(a):
    state, l, best = init(), 0, None
    for r, x in enumerate(a):
        add(state, x)                    # grow right
        while not valid(state):          # "longest": shrink until valid again
            remove(state, a[l]); l += 1
        best = better(best, r - l + 1)   # window [l, r] is the best one ending at r
    return best
# "shortest that satisfies": while valid(state): record, then remove(a[l]); l += 1
# fixed size k: add a[r]; if r >= k: remove(a[r-k]); if r >= k-1: record
```

**Pitfalls:**
- Using a window when values can be negative: a sum window is not monotone then.
- "Shortest" and "longest" put the record step in different places. For "shortest", record **inside** the shrink loop. For "longest", record **after** it.
- Counter bookkeeping: delete keys when their count hits 0, or `len(counter)` stops being the distinct count. In min-cover, track `formed` (how many requirements are met) rather than comparing whole dicts.
- Order statistics on a fixed window (drop the top k, median): heaps need lazy deletion keyed by index, or duplicates get removed wrongly.

### Clusters

#### Longest window with all-distinct elements: grow right, jump `l` past the last occurrence
- **Anchor:** [#11 Measure the Longest Segment of Distinct Characters](problems/011-measure-the-longest-segment-of-distinct-characters.md): the classic "longest window under a distinctness constraint". Keep `last_seen[value]` and set `l = max(l, last_seen[x] + 1)`.
- **Variants:**
  - [#21 O(1) Range Queries: Are All Elements of a Subarray Distinct?](problems/021-o-1-range-queries-are-all-elements-of-a-subarray-distinct.md): **follow-up of #11** (static window → many range queries). Store `bound[r]`, the smallest valid `l` for each right end, using the same scan as #11. Query `[l, r]` is distinct iff `l ≥ bound[r]`, which is O(1) per query.

#### Shortest window that satisfies an "at least" requirement: expand until valid, then shrink while still valid
- **Anchor:** [#268 Find minimum covering substring](problems/268-find-minimum-covering-substring.md): the most general form, covering multiplicities of required characters with a `need` counter and a `formed` count. Once you can do this one, the rest are simplifications.
- **Variants:**
  - [#424 Minimize a Positive-Array Target Window Length](problems/424-minimize-a-positive-array-target-window-length.md): **same concept, simpler state.** The state is just a running sum ≥ target (positives only). The card also mentions the O(n log n) prefix-sum + binary-search alternative.
  - [#82 Find shortest subarray with at least k distinct](problems/082-find-shortest-subarray-with-at-least-k-distinct.md) *(inferred)*: **same concept, different requirement.** "≥ k distinct" uses a frequency map + distinct counter instead of a `need` map. Shrink while distinct ≥ k.
  - [#134 Find shortest subarray with ≥k distinct integers](problems/134-find-shortest-subarray-with-k-distinct-integers.md) *(inferred)*: **near-duplicate of #82.** Same task. Watch the tie-break (strict `<` keeps the leftmost shortest window).

#### Fixed-size window + order statistics: drop the largest k values from each window's mean
- **Anchor:** [#26 Sliding-Window Mean After Removing the Largest K Values](problems/026-sliding-window-mean-after-removing-the-largest-k-values.md): full statement, lowest rank. Split each window into `low` (the w−k smallest) and `high` (the k largest), keep `sum(low)`, and rebalance across the boundary on every insert and delete.
- **Variants:**
  - [#261 Sliding Window Average After Dropping the Largest Values](problems/261-sliding-window-average-after-dropping-the-largest-values.md) *(inferred)*: **near-duplicate of #26.** The card uses a Fenwick tree over coordinate-compressed values (counts + sums), then asks for "the sum of the w−k smallest". This works offline when every value is known up front.
  - [#290 Compute sliding-window average excluding top k](problems/290-compute-sliding-window-average-excluding-top-k.md) *(inferred)*: **near-duplicate of #26.** Two heaps with **lazy deletion** (tag each entry with its stream index so duplicates stay distinct). This is the version you can write in Python without a sorted container.

#### Fixed-length window compared against a frequency signature (anagram / word multiset)
- **Anchor:** [#232 Check if all substrings are anagrams of words](problems/232-check-if-all-substrings-are-anagrams-of-words.md): a window length equals the word length, and the 26-count vector is the signature. Slide it with an O(1) update per step instead of re-counting.
- **Variants:**
  - [#295 Find Every Concatenation Starting Index](problems/295-find-every-concatenation-starting-index.md): **same concept, coarser tokens.** The window moves in steps of `word_len` and counts whole words. Run `word_len` separate passes (one per starting offset) and shrink when a word's count is exceeded.
  - [#247 Find fair split of a two-color necklace](problems/247-find-fair-split-of-a-two-color-necklace.md): **same concept, different setting.** Circular array. Two cuts give one person a contiguous arc, so slide a window of size n/2 around the circle and check that each colour count equals half its total.

#### Duplicate within an index radius: the window holds the last k indices
- **Anchor:** [#426 Detect Equal Values within an Index Radius](problems/426-detect-equal-values-within-an-index-radius.md): the simplest version. Keep a set or hashmap of the last k values (or `last_index[value]`).
- **Variants:**
  - [#460 Detect a Bounded-Index Pair with Near-Equal Values](problems/460-detect-a-bounded-index-pair-with-near-equal-values.md): **follow-up of #426** ("equal" becomes "|a−b| ≤ t"). A plain set is no longer enough. Use an ordered set (successor/predecessor lookup) or buckets of width t+1, which only need neighbour-bucket checks.

### Other Sliding Window problems
- [#338 Find longest increasing contiguous subarray](problems/338-find-longest-increasing-contiguous-subarray.md) *(inferred)*: longest strictly increasing run after changing one value. Precompute `left[i]` / `right[i]` run lengths and try bridging at each i. → really prefix/suffix arrays (DP-lite), not a moving window.

---

## Two Pointers

**Recognise it when:**
- The array is **sorted** (or you may sort it) and the question is about pairs, triples or quads hitting or near a target: "two sum on sorted", "closest 3-sum", "4-sum distinct".
- "in place, O(1) extra space": remove values, dedupe, merge into a buffer, reverse, rotate.
- Palindrome or symmetry checks, or reversing only some characters.
- Two sequences that must be matched in order: subsequence check, "can start become target if tokens only move left/right".
- Maximise something set by the two ends, where it is obvious which end to move (container with most water).

**Core idea:** Each pointer move rules out a whole set of candidates at once. In a sorted array, if `a[i] + a[j] > target`, then `j` cannot pair with anything at or after `i`, so `j--` is safe. Read/write pointers keep a different invariant: `a[:w]` is always the finished output, and `r` scans ahead. Matching pointers on two strings compare the k-th "real" token of each, which works because the moves never reorder tokens.

**Skeleton:**
```python
# opposite ends on sorted a
i, j = 0, len(a) - 1
while i < j:
    s = a[i] + a[j]
    if s == target: record(i, j); i += 1; j -= 1   # + skip duplicates if needed
    elif s < target: i += 1
    else: j -= 1

# read/write compaction
w = 0
for r in range(len(a)):
    if keep(a[r], a[:w]): a[w] = a[r]; w += 1
return w
```

**Pitfalls:**
- Skipping duplicates in k-sum: skip on the **outer** loops and after a match. Skipping before the first use drops valid answers.
- Merging into a buffer from the front overwrites unread data. Fill from the **back**.
- Rotate by k: take `k %= n` first. The reversal trick is reverse all, then reverse `[:k]`, then reverse `[k:]`.
- Matching with tokens and walls: comparing the non-dot sequences is necessary but not sufficient. The per-token position direction also has to be checked.

### Clusters

#### Inward pointers on a sorted range (k-sum family)
- **Anchor:** [#420 Return the Unique Sorted Target Pair as One-Based Indices](problems/420-return-the-unique-sorted-target-pair-as-one-based-indices.md): two-sum on a sorted array, the base move rule (sum too small → `i++`, too big → `j--`).
- **Variants:**
  - [#138 Choose the Closest Three-Position Sum](problems/138-choose-the-closest-three-position-sum.md): **follow-up of #420.** Sort, fix one index, run #420 on the suffix, and track `min |sum − target|` instead of equality.
  - [#51 Find All Distinct Four-Value Target Groups](problems/051-find-all-distinct-four-value-target-groups.md): **follow-up of #138.** Fix two indices (O(n³)), add duplicate skipping on all four positions, and watch for overflow in languages other than Python.
  - [#218 Find numbers with exactly two sum-of-squares forms](problems/218-find-numbers-with-exactly-two-sum-of-squares-forms.md) *(inferred)*: **same concept, implicit sorted array.** `a` runs from 1 up and `b` runs down from isqrt(n), so `a² + b²` is monotone in each pointer. Count the representations and keep the numbers that have exactly two.
  - [#62 Choose Vertical Sides for the Greatest Water Capacity](problems/062-choose-vertical-sides-for-the-greatest-water-capacity.md): **same concept, different objective.** Start at both ends and always move the **shorter** side. Moving the taller side can never increase `min(h) × width`.

#### In-place reverse/swap from both ends
- **Anchor:** [#472 Reverse the Original Printable-Character Array In Place](problems/472-reverse-the-original-printable-character-array-in-place.md): the bare swap-and-converge loop.
- **Variants:**
  - [#471 Reverse Only Vowel Occurrences in an ASCII String](problems/471-reverse-only-vowel-occurrences-in-an-ascii-string.md): **same loop with a filter.** Each pointer skips non-vowels before swapping.
  - [#347 Compare Normalized ASCII Phrase Symmetry](problems/347-compare-normalized-ascii-phrase-symmetry.md): **same loop, compare instead of swap.** Skip non-alphanumerics and compare case-folded characters.
  - [#457 Rotate the Original Array Right by a Nonnegative Count](problems/457-rotate-the-original-array-right-by-a-nonnegative-count.md): **same concept, applied three times.** Reversal-based rotate (reverse all, reverse the first k, reverse the rest). The card also compares the extra-buffer and cycle-permutation approaches.

#### Read/write pointer compaction and merging
- **Anchor:** [#189 Compact a Sorted Array into Its Distinct Prefix](problems/189-compact-a-sorted-array-into-its-distinct-prefix.md): the clearest "`a[:w]` is the answer so far" invariant (write when `a[r] != a[w-1]`).
- **Variants:**
  - [#322 Remove Chosen Values from an Array Prefix](problems/322-remove-chosen-values-from-an-array-prefix.md): **same concept.** The keep condition is `a[r] != val`, and order may change, so swapping with the end is also allowed.
  - [#274 Merge Sorted Values into an Existing Array Buffer](problems/274-merge-sorted-values-into-an-existing-array-buffer.md): **same concept, reversed direction.** Three pointers starting from the back of both arrays, so the spare capacity is filled before anything unread is overwritten.

#### Two sequences, one pointer each (in-order matching)
- **Anchor:** [#204 Decide string transform with directional tokens and walls](problems/204-decide-string-transform-with-directional-tokens-and-walls.md): compare the k-th non-dot character of start vs target, then check each token's move direction and that it never crosses a wall.
- **Variants:**
  - [#182 Can board states be transformed?](problems/182-can-board-states-be-transformed.md) *(inferred)*: **near-duplicate of #204.** Pieces never pass each other, so the sequences with blanks removed must match (that is all of Part 2). Part 1 adds the per-piece direction/position check.
  - [#76 Match Dictionary Words to a Swipe-Keyboard Gesture Path](problems/076-match-dictionary-words-to-a-swipe-keyboard-gesture-path.md): **same concept, different setting.** Subsequence check of each word against the path, with fixed first and last letters. A doubled letter may reuse the same path position (the word pointer advances without moving the path pointer).

### Other Two Pointers problems
- [#429 Find a Repeated Value without Modifying the Array](problems/429-find-a-repeated-value-without-modifying-the-array.md): n+1 values in 1..n without modifying the array. Treat `i → nums[i]` as a linked list and find the cycle entrance (Floyd), or binary search on the value with a count check. → really fast/slow pointers (or binary search on value).
- [#505 Build the Shortest Palindrome by Prepending Only](problems/505-build-the-shortest-palindrome-by-prepending-only.md): the longest palindromic prefix gives the answer. Find it with the KMP prefix function on `s + '#' + reverse(s)`. → really string matching (KMP).
- [#230 Simulate In-Place Cellular State Updates](problems/230-simulate-in-place-cellular-state-updates.md) *(inferred)*: in-place Game of Life. Store next-state in bit 1 and read only bit 0 during the pass. → really simulation / bit encoding.

---

## Binary Search

**Recognise it when:**
- The input is sorted and the constraint is "O(log n)": first/last occurrence, insertion point, search a sorted matrix.
- "minimise the maximum", "smallest speed / largest length that works", "at least k pieces": **binary search on the answer** with a monotone `feasible(x)`.
- There is no global order but each step can tell you which half holds the answer: peak element, rotated array, median of two sorted arrays (partition).
- A continuous monotone function where you need its crossing point: "horizontal cut splitting the area in half" means bisection on a real value.
- An expensive black-box oracle where "does this prefix contain the culprit?" is monotone in the prefix length.

**Core idea:** Keep an invariant on `lo`/`hi`, for example "answer ∈ [lo, hi]" or "`lo` is always feasible, `hi + 1` never is". Each step tests `mid` and throws away the half that cannot hold the answer. What justifies dropping a half is **monotonicity**, either of the array or of `feasible`. Decide up front whether you want the first True or the last True, and pick the matching midpoint rounding so the loop always shrinks.

**Skeleton:**
```python
def first_true(lo, hi, feasible):      # smallest x in [lo, hi] with feasible(x); hi must be feasible
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid): hi = mid       # mid might be the answer
        else: lo = mid + 1
    return lo
# last True: mid = (lo + hi + 1) // 2; if feasible(mid): lo = mid else: hi = mid - 1
# real-valued: for _ in range(100): mid = (lo+hi)/2; (lo, hi) = (lo, mid) if f(mid) else (mid, hi)
```

**Pitfalls:**
- Infinite loop from mixing `lo = mid` with a lower-rounded midpoint. "Last True" needs `(lo + hi + 1) // 2`.
- Wrong search bounds for answer search. They must bracket the answer, e.g. speed in `[1, max(piles)]`, and length in `[0, max]` where 0 means "impossible".
- Rotated or peak arrays with duplicates: when `a[mid] == a[hi]` you cannot tell which half to drop. Shrink `hi -= 1`, which makes the worst case O(n), and say so.
- Floating point: iterate a fixed number of times rather than `while hi - lo > eps` on huge coordinates, and use integer prefix sums where possible.

### Clusters

#### Boundary search on a sorted array (lower_bound / upper_bound)
- **Anchor:** [#139 First and Last Indices of a Value](problems/139-first-and-last-indices-of-a-value.md): write `lower_bound` once and call it twice (`lb(t)` and `lb(t+1) − 1`). That covers both boundary kinds.
- **Variants:**
  - [#205 Find the Sorted Insertion Index](problems/205-find-the-sorted-insertion-index.md): **sub-problem of #139.** The insertion index *is* `lower_bound`.
  - [#345 Search a Matrix with Ordered Row Boundaries](problems/345-search-a-matrix-with-ordered-row-boundaries.md): **same concept, 2D setting.** Each row starts after the previous row ends, so treat the matrix as one sorted array of length m·n (`r, c = divmod(mid, n)`).
  - [#510 Select the K Closest Sorted Values with Smaller-Value Ties](problems/510-select-the-k-closest-sorted-values-with-smaller-value-ties.md): **same concept, search the window start.** Binary search `left ∈ [0, n−k]` by comparing `x − a[mid]` with `a[mid+k] − x`. Ties go to the smaller value, so move left on `<=`. (A two-pointer shrink from both ends is the O(n) alternative.)

#### Binary search without a sorted array (slope / rotation tells you which half to keep)
- **Anchor:** [#349 Return Any Strict Peak Index in Logarithmic Time](problems/349-return-any-strict-peak-index-in-logarithmic-time.md): the cleanest "local evidence decides the half" problem. If `a[mid] < a[mid+1]`, a peak exists to the right.
- **Variants:**
  - [#378 Locate a Rotated Minimum despite Duplicate Ambiguity](problems/378-locate-a-rotated-minimum-despite-duplicate-ambiguity.md): **same concept, harder invariant.** Compare `a[mid]` with `a[hi]` to find the min of a rotated array. Duplicates make `a[mid] == a[hi]` ambiguous, so shrink `hi` and accept the O(n) worst case.

#### Binary search on the answer with a monotone feasibility check
- **Anchor:** [#92 Solve Banana Speed and Interval Merge](problems/092-solve-banana-speed-and-interval-merge.md): Koko eating bananas. The textbook "smallest speed that finishes in h hours", with `feasible = Σ ceil(p / k) ≤ h`. (Part 2 is merge intervals, see Cross-pattern links.)
- **Variants:**
  - [#226 Maximize the Equal Wood Segment Length](problems/226-maximize-the-equal-wood-segment-length.md) *(inferred)*: **same concept, mirrored.** Find the **largest** length L with `Σ w // L ≥ k`, so it is last-True with the upper midpoint and returns 0 if infeasible.
  - [#366 Find longest duplicated substring](problems/366-find-longest-duplicated-substring.md): **same concept, string setting.** "A duplicate of length L exists" is monotone (L works means L−1 works). Binary search L and check with a Rabin-Karp rolling hash + set. The card's linear alternative is a suffix array or suffix automaton.

#### Real-valued bisection on an area function (horizontal cut)
- **Anchor:** [#409 Find horizontal cut balancing square areas](problems/409-find-horizontal-cut-balancing-square-areas.md): full statement. `F(y)` (area above the cut) is continuous and monotone, so bisect y. Overlapping squares are counted with multiplicity.
- **Variants:**
  - [#259 Find a Horizontal Cut That Bisects Rectangle Area](problems/259-find-a-horizontal-cut-that-bisects-rectangle-area.md) *(inferred)*: **near-duplicate of #409** with disjoint rectangles and n = 2·10⁵. Same bisection. An exact alternative sweeps the y-events, because `areaBelow` is piecewise linear with slope equal to the total width crossing that height.
  - [#198 Find where to cut cake into equal areas](problems/198-find-where-to-cut-cake-into-equal-areas.md) *(inferred)*: **same concept, 1D and exact.** The rectangles sit side by side, so build prefix area sums, binary search the rectangle where the cumulative area reaches the target, then solve a linear equation inside it.

#### Black-box oracle: binary search over prefixes to locate culprits
- **Anchor:** [#403 Find conflicting pair using black-box run()](problems/403-find-conflicting-pair-using-black-box-run.md) *(inferred)*: chosen over #174 because it is the base case with one bad pair. "Prefix fails" is monotone, so binary search the smallest failing prefix to get the later culprit. Then binary search the start of the window for the earlier one. That costs about 2·log n calls.
- **Variants:**
  - [#174 Minimize calls to find all bad test pairs](problems/174-minimize-calls-to-find-all-bad-test-pairs.md): **follow-up of #403** (one pair → all k pairs). Process tests right to left, partition the suffix into internally compatible groups, and binary search inside each group that conflicts with v. Discuss the call count in terms of n and k.

### Other Binary Search problems
- [#27 Locate the Middle Value Across Two Sorted Inputs](problems/027-locate-the-middle-value-across-two-sorted-inputs.md): median of two sorted arrays. Binary search the **partition** of the shorter array so that the left halves hold ⌈(m+n)/2⌉ elements and `maxLeft ≤ minRight`. Handle empty arrays with ±∞ sentinels.

---

## Prefix Sum

**Recognise it when:**
- Many range-sum or range-count queries on a **static** array or grid ("immutable", "O(1) per query").
- Many range **updates**, read once at the end ("apply rectangle increments, return the final grid"): use a difference array.
- "subarray with sum k", "equal number of 0s and 1s", "endpoints satisfy X and maximise the sum", **with negatives allowed**: prefix sum + hashmap.
- "is the range [l, r] free of property P?": count the bad positions in a prefix and check `bad[r] − bad[l] == 0`.
- "remove one element / cut once so the sides balance": you need left and right totals in O(1).

**Core idea:** `P[i] = a[0] + … + a[i−1]`, so `sum(l..r) = P[r+1] − P[l]`. A range question becomes a question about two prefix values. Fix the right end `r` and look up the best or matching **earlier** prefix in a hashmap (first index for "longest", min prefix for "max sum", counts for "number of"). A difference array is the inverse: mark `+v` at the start and `−v` just after the end, then prefix-sum once.

**Skeleton:**
```python
P = [0]
for x in a: P.append(P[-1] + x)              # sum(l..r) = P[r+1] - P[l]

seen = {0: -1}                               # key -> earliest index (or min prefix / count)
run = 0
for i, x in enumerate(a):
    run += transform(x)                      # e.g. +1 / -1 for balance problems
    if run - target in seen: best = max(best, i - seen[run - target])
    seen.setdefault(run, i)                  # keep earliest for "longest"
# 2D: S[r+1][c+1] = g[r][c] + S[r][c+1] + S[r+1][c] - S[r][c]
```

**Pitfalls:**
- Off-by-one: use a length-(n+1) prefix with `P[0] = 0`, and in 2D pad both a row and a column. Difference arrays need size n+1 (or (n+1)²) for the `r2+1` / `c2+1` marks.
- Seed the hashmap (`{0: -1}`) or subarrays starting at index 0 are missed.
- Updating the map **before** querying at the same index lets an empty subarray match itself.
- Range-flag queries: decide whether the break at index `l` counts. It is `bad[r] − bad[l]`, not `bad[l−1]`.

### Clusters

#### Static range-sum queries (precompute once, O(1) per query)
- **Anchor:** [#468 Preprocess Immutable Inclusive Array Range Sums](problems/468-preprocess-immutable-inclusive-array-range-sums.md): 1D `P[r+1] − P[l]`, the foundation for everything else here.
- **Variants:**
  - [#383 Answer Immutable Rectangle Sums in Constant Query Time](problems/383-answer-immutable-rectangle-sums-in-constant-query-time.md): **follow-up of #468** (1D → 2D). Build the padded inclusion-exclusion table and answer each query with 4 lookups.

#### 2D difference array (many rectangle updates, one read)
- **Anchor:** [#42 Count Overlapping Rectangle Updates on a Grid](problems/042-count-overlapping-rectangle-updates-on-a-grid.md): full statement with 10⁵ updates. Four corner marks per rectangle, then a 2D prefix pass.
- **Variants:**
  - [#227 Count Rectangle Coverage on a Grid](problems/227-count-rectangle-coverage-on-a-grid.md) *(inferred)*: **near-duplicate of #42**, with stress on edge rectangles (the (n+1)×(n+1) buffer), duplicate updates and not mutating the input.

#### Prefix count of "bad" boundaries, then O(1) range check
- **Anchor:** [#199 Answer parity-alternation range queries](problems/199-answer-parity-alternation-range-queries.md) *(inferred)*: mark index i bad if `a[i−1]` and `a[i]` have the same parity. A range alternates iff `bad[r] − bad[l] == 0`.
- **Variants:**
  - [#363 Answer range queries for alternating parity subarrays](problems/363-answer-range-queries-for-alternating-parity-subarrays.md) *(inferred)*: **follow-up of #199** (static → point updates). Changing one value affects at most two flags, so keep the flags in a Fenwick tree, or a sorted set of bad indices, instead of a plain prefix array.

#### Prefix sum + hashmap keyed on a value (look back for the best partner)
- **Anchor:** [#473 Find the Longest Balanced Binary Segment](problems/473-find-the-longest-balanced-binary-segment.md): map 0 → −1, track the running balance, and store the **first** index of each balance. The longest gap between equal balances is the answer.
- **Variants:**
  - [#283 Maximize Boundary-Difference Subarray Sum](problems/283-maximize-boundary-difference-subarray-sum.md): **same concept, key is the array value.** The endpoints must satisfy `a[i] = a[j] ± k`. For each value, keep the **minimum** prefix sum seen before an index holding it, and maximise `P[j+1] − minP[a[j] ± k]`.
  - [#78 Solve Two Array Optimization Problems](problems/078-solve-two-array-optimization-problems-2.md): **same concept, two parts.** Part 2 (equal endpoints, maximise sum) is **#283 with k = 0**. Part 1 (remove one link, then split evenly) is essentially #235. The O(1)-space follow-up gives up the hashmap for O(n²).
  - [#235 Check pivot after removing one element](problems/235-check-pivot-after-removing-one-element.md) *(inferred)*: **same concept, the lookup key is the removed value.** For pivot p with sums L and R, the removed element must equal `L − R` (to its left) or `R − L` (to its right), so keep a hash set of values seen on each side while scanning.

---

## Hashing / Counting

**Recognise it when:**
- "contains duplicate", "intersection", "has a partner with value x+k or 2x": O(1) membership checks.
- "group the items that are equivalent under …": build a **canonical key** (sorted letters, shift-normalised offsets, midpoint+length).
- "linear time", while sorting would be O(n log n): longest consecutive run, first missing positive.
- "mapping must be one-to-one": two dictionaries, or a dictionary plus a used-set.
- Multiset reasoning: "reconstruct from a doubled array", bulls & cows (min of counts).

**Core idea:** A hashmap swaps the "have I seen this?" scan (O(n)) for an O(1) lookup, so nested loops become single passes. Many grouping problems come down to one question: **what key do all equivalent items share?** Once the key is right, `defaultdict(list)` does the rest. When the problem asks for O(1) extra space, the array itself (index = value) or a voting argument (Boyer-Moore) stands in for the map.

**Skeleton:**
```python
from collections import Counter, defaultdict
groups = defaultdict(list)
for item in items:
    groups[canonical_key(item)].append(item)   # equivalence classes

cnt = Counter(a)
for x in sorted(cnt, key=order):               # process in a safe order
    need = partner(x)                          # x + k, 2 * x, ...
    if cnt[need] < cnt[x]: return False
    cnt[need] -= cnt[x]
```

**Pitfalls:**
- Self-pairing when the partner equals the value (k = 0 in k-diff, x = 0 in the doubled array). These need `count ≥ 2`, not just presence.
- One-to-one mapping checked in only one direction ("ab" → "aa" passes a single map).
- Counting a number twice for one digit (e.g. 11 contains digit 1 once for grouping purposes). Use a set of digits.
- Hash keys built from floats or tuples of floats (use integer sums or doubled midpoints in geometry).

### Clusters

#### Group by a shared digit (fix the shared attribute instead of enumerating subsets)
- **Anchor:** [#186 Find largest digit-sharing subset](problems/186-find-largest-digit-sharing-subset.md): the simplest form. For each digit 0–9, count the numbers containing it, and the max is the answer.
- **Variants:**
  - [#169 Find largest subset sharing a common digit](problems/169-find-largest-subset-sharing-a-common-digit-3.md): **near-duplicate of #186**, with the "11 counts once" pitfall stated explicitly.
  - [#83 Find largest group of two-digit numbers sharing digits](problems/083-find-largest-group-of-two-digit-numbers-sharing-digits.md): **same input, different definition of group.** Sharing is **transitive** here (a shares with b, b with c), so the answer is the largest connected component. → really union-find / graph components (10 digit nodes make it tiny).

#### Set membership in one pass
- **Anchor:** [#461 Detect Whether Any Integer Value Repeats](problems/461-detect-whether-any-integer-value-repeats.md): the bare "seen set" pattern.
- **Variants:**
  - [#538 Return Distinct Values Shared by Two Arrays](problems/538-return-distinct-values-shared-by-two-arrays.md): **same concept, two inputs.** Build a set from one array and probe with the other, returning distinct values.
  - [#255 Measure the Longest Consecutive Value Run in Linear Time](problems/255-measure-the-longest-consecutive-value-run-in-linear-time.md): **same concept, smarter start condition.** Only start counting a run at x when `x − 1 ∉ set`, which makes the whole thing O(n).

#### Partner lookup in a counter (x pairs with x+k or 2x)
- **Anchor:** [#515 Count Distinct Value Pairs with a Fixed Gap](problems/515-count-distinct-value-pairs-with-a-fixed-gap.md): k-diff pairs. For k > 0, count distinct x with x+k present. For k = 0, count values with frequency ≥ 2.
- **Variants:**
  - [#241 Reconstruct original array from doubled shuffle](problems/241-reconstruct-original-array-from-doubled-shuffle.md) *(inferred)*: **same concept plus a greedy order.** Process values by increasing |x|, because the smallest |x| left must be an original. Pair it with 2x and decrement counts. Zero needs an even count.

#### Canonical key / bijection
- **Anchor:** [#467 Group Strings Equivalent under Uniform Alphabet Shifts](problems/467-group-strings-equivalent-under-uniform-alphabet-shifts.md): the key is the tuple of `(c − s[0]) mod 26`, so all shifts of a string share it.
- **Variants:**
  - [#458 Check a One-to-One ASCII Character Substitution](problems/458-check-a-one-to-one-ascii-character-substitution.md): **same concept, enforce a bijection.** Map s→t and t→s (or compare first-occurrence index patterns, which is a canonical key per string).
  - [#53 Largest-Area Rectangle From a Point Set When Sides Need Not Be Axis-Aligned](problems/053-largest-area-rectangle-from-a-point-set-when-sides-need-not-be-axis-aligned.md): **same concept, geometric key.** Two point pairs are the diagonals of a rectangle iff they have the same midpoint and length. Key = `(x1+x2, y1+y2, dist²)`, then compute areas within each bucket.

### Other Hashing / Counting problems
- [#7 Smallest Missing Positive Integer in Linear Time and Constant Extra Space](problems/007-smallest-missing-positive-integer-in-linear-time-and-constant-extra-space.md): the answer lies in [1, n+1]. Use the array as the presence table by cyclically placing v at index v−1, then scan for the first mismatch (O(1) space).
- [#456 Recover a Guaranteed More-Than-Half Majority](problems/456-recover-a-guaranteed-more-than-half-majority.md): Boyer-Moore voting. Cancel pairs of different values, and the guaranteed majority survives (O(1) space instead of a counter).
- [#513 Count Position Matches and Remaining Digit Matches](problems/513-count-position-matches-and-remaining-digit-matches.md): bulls & cows. Bulls are position matches. Cows are `Σ min(countS[d], countG[d])` over the **non-bull** digits.

---

## String Processing

**Recognise it when:**
- The task is to "convert / format / validate / compare" a string under a precise spec: version strings, numbers, identifiers, Roman numerals.
- Splitting on a delimiter, then comparing or rebuilding tokens (words, dotted revisions).
- Output position is a deterministic function of input position: zigzag rows, chunks of 2k, every k-th character.
- Generating the next term by run-length description (count-and-say).
- Interactive or matching problems over fixed-length words where the per-position match count is the signal.

**Core idea:** Most of these are a **single left-to-right scan with a small amount of state** (current token, a few flags, a lookahead of one). The algorithm is easy and correctness is in the edge cases, so state the grammar or rules first, then code it as a loop or a tiny state machine. Build output in a list and `''.join` at the end, because string `+=` in a loop is O(n²) in many languages.

**Skeleton:**
```python
out, i, n = [], 0, len(s)
while i < n:
    if is_delim(s[i]): i += 1; continue
    j = i
    while j < n and not is_delim(s[j]): j += 1   # token = s[i:j]
    out.append(handle(s[i:j]))
    i = j
return ''.join(out)        # or compare token lists pairwise, padding with defaults
```

**Pitfalls:**
- Leading, trailing and repeated delimiters produce empty tokens. Use `split()` without arguments, or skip explicitly.
- Version compare: treat missing parts as 0 and compare as **ints**, not strings ("1.01" == "1.001").
- Validation grammars (signs, ".", "e"): each flag (`seen_digit`, `seen_dot`, `seen_exp`) has its own rules, and a digit is required after `e`.
- Zigzag with 1 row, chunking where the last chunk is short, and 1-letter inputs: the classic off-by-ones.

### Clusters

#### Tokenise on spaces/delimiters, then rebuild or compare
- **Anchor:** [#326 Reverse Word Order and Normalize ASCII Spaces](problems/326-reverse-word-order-and-normalize-ascii-spaces.md): split, reverse and join, plus the O(1)-space in-place follow-up (reverse the whole string, then reverse each word).
- **Variants:**
  - [#270 Measure the Final Word Before Trailing Spaces](problems/270-measure-the-final-word-before-trailing-spaces.md): **sub-problem.** Scan from the end, skip trailing spaces, count letters until the next space.
  - [#436 Compare Dotted Revision Values with Missing Zeros](problems/436-compare-dotted-revision-values-with-missing-zeros.md): **same concept, compare tokens.** Split on '.', compare the int values pairwise, pad the shorter list with zeros.
  - [#194 Convert Valid Snake Case to Lower Camel Case](problems/194-convert-valid-snake-case-to-lower-camel-case.md): **same concept, transform tokens.** Underscore means capitalise the next letter, done in one pass with a flag.

#### Scan with grammar / lookahead (parse or validate)
- **Anchor:** [#273 Validate a Signed Decimal and Exponent Spelling](problems/273-validate-a-signed-decimal-and-exponent-spelling.md): valid number. The fullest grammar (sign, digits, dot, exponent) and the best test of careful state handling.
- **Variants:**
  - [#75 Evaluate a Guaranteed-Valid Roman Numeral](problems/075-evaluate-a-guaranteed-valid-roman-numeral.md): **same concept, one-char lookahead.** If `value(s[i]) < value(s[i+1])`, subtract, otherwise add.
  - [#236 Implement string formatting and request tracking tasks](problems/236-implement-string-formatting-and-request-tracking-tasks.md) *(inferred)*: **same concept, formatting direction.** Split the sign, integer and fraction parts, strip leading zeros, group in threes from the right, and drop "−0". (Other parts: rotation-mapping validation and request tracking, see Cross-pattern links.)
  - [#480 Recognize the Three Valid Capitalization Patterns](problems/480-recognize-the-three-valid-capitalization-patterns.md): **same concept, tiny grammar.** Three allowed patterns. Count the uppercase letters and check whether only the first is uppercase.

#### Index-mapped construction / chunked simulation
- **Anchor:** [#117 Read a Down-and-Up Character Layout by Row](problems/117-read-a-down-and-up-character-layout-by-row.md): zigzag. The row index bounces 0→R−1→0, so append each char to `rows[r]`. Alternatively use the cycle length 2R−2 to compute positions directly.
- **Variants:**
  - [#483 Reverse the First Part of Each Two-Block String Chunk](problems/483-reverse-the-first-part-of-each-two-block-string-chunk.md): **same concept, chunk stepping.** `for i in range(0, n, 2k)`, reverse `s[i:i+k]`.
  - [#29 Implement Checksums and Feature Rollout Evaluation](problems/029-implement-checksums-and-feature-rollout-evaluation.md): **same concept, chunk stepping + business logic.** Checksum over steps of k with a char→weight map. The second part is dependency evaluation (→ topological sort).
  - [#177 Generate the nth Run-Count Sequence Term](problems/177-generate-the-nth-run-count-sequence-term.md): **same concept, run-length scan.** Each term is the run-length description of the previous one. Iterate n−1 times with a run counter.

### Other String Processing problems
- [#59 Find the Shared Starting String](problems/059-find-the-shared-starting-string.md): longest common prefix. Vertical scan character by character (or compare only the min and max strings in sorted order).
- [#157 Find secret word with match-count feedback](problems/157-find-secret-word-with-match-count-feedback.md): guess the word. After feedback k, keep only candidates with exactly k matches to the guess. Pick the next guess to minimise the largest feedback bucket. → really minimax / interactive search.
- [#317 Find best-matching binary pattern with wildcards](problems/317-find-best-matching-binary-pattern-with-wildcards.md) *(inferred)*: wildcard binary patterns compiled to `(mask, value)`, so a match is `s & mask == value`. Check rules in priority order (length desc, index asc). → really bit manipulation (a trie for scale).

---

## Sorting

**Recognise it when:**
- The answer depends on rank or order, not original position: "at least h items ≥ h" (h-index).
- "the smallest segment that, once sorted, fixes the whole array": compare against the sorted order.
- Matching two sets of points on a line: sort both, and optimal pairings don't cross.
- Sorting is the O(n log n) alternative to hashing, at the cost of losing original indices (decorate them as `(value, index)`).

**Core idea:** Sorting gives a structural guarantee (monotone order, non-crossing matches, i-th largest at position i) that turns a search into a linear scan. Often it is the clean O(n log n) baseline, and the follow-up is to drop it: counting sort for bounded values (h-index buckets), or running max/min scans that find the same boundary as sorting does.

**Skeleton:**
```python
order = sorted(range(n), key=lambda i: (a[i], i))   # keep original indices
b = sorted(a, reverse=True)
h = 0
while h < n and b[h] >= h + 1: h += 1              # threshold scan on sorted data
# counting-sort variant when values are bounded by n: buckets[min(v, n)] += 1
```

**Pitfalls:**
- Sorting loses indices. If the answer is indices, sort `(value, index)` pairs.
- Tie-breaking rules (lexicographically smallest pair) often make a sort-based approach awkward, and a hash scan is cleaner.
- Mentioning O(n log n) without the O(n) follow-up when values are bounded.

### Clusters

#### Sort (or simulate sorting), then scan for a boundary
- **Anchor:** [#477 Find the Largest Supported Citation Threshold](problems/477-find-the-largest-supported-citation-threshold.md): h-index. Sort descending and find the last position with `b[i] ≥ i+1`. The O(n) follow-up uses counting buckets capped at n.
- **Variants:**
  - [#540 Measure the Smallest Segment that Needs Sorting](problems/540-measure-the-smallest-segment-that-needs-sorting.md): **same concept.** Compare with a sorted copy and take the first/last mismatch (O(n log n)). The O(n) version scans left→right with a running max to find the right boundary, and right→left with a running min to find the left boundary.
  - [#126 Maximize 1D deliveries within distance and minimize total distance](problems/126-maximize-1d-deliveries-within-distance-and-minimize-total-distance.md) *(inferred)*: **same concept, sorted order unlocks DP.** Sort both lists. Crossing pairs can be uncrossed, so an optimal matching is order-preserving, which gives an LCS-style DP on `(count, −distance)`. → really DP after sorting.

### Other Sorting problems
- [#127 Return the Lexicographically Smallest Two-Sum Index Pair](problems/127-return-the-lexicographically-smallest-two-sum-index-pair.md): lexicographically smallest two-sum index pair. Smallest i first, so for each i you need the smallest j > i with the complement value. Precompute `value → sorted indices` or scan from the right with a hashmap. → really hashing. Sorting is the comparison baseline that loses indices.

---

## Cross-pattern links
- **Sliding window + heap / Fenwick / ordered set:** #26, #261, #290 (top-k excluded mean), #460 (window + ordered set or buckets).
- **Sliding window + hashing:** #232, #295 (frequency signatures), #268, #82, #134 (need/distinct counters), #11 (last-seen map).
- **Sliding window → offline precomputation:** #21 (turn the window's left bound into an O(1) range-query table).
- **Prefix sum + binary search:** #424 (alternative O(n log n) solution for the shortest positive-sum window), #198 (prefix areas + binary search the rectangle).
- **Prefix sum + hashmap:** #473, #283, #78, #235.
- **Prefix sum → Fenwick / segment tree** when updates appear: #363 (and #261 uses a Fenwick tree for order statistics).
- **Binary search + greedy feasibility:** #92, #226. **Binary search + Rabin-Karp rolling hash:** #366. **Binary search + group testing:** #403, #174. **Binary search + sweep line:** #259 (exact alternative). #92 part 2 is **merge intervals** (Intervals / Sweep Line).
- **Two pointers + sorting:** #138, #51 (sort first). **Two pointers + linked-list cycle detection:** #429 (Floyd). **Two pointers + KMP:** #505.
- **Hashing + graph / union-find:** #83. **Hashing + greedy:** #241. **Hashing + geometry:** #53.
- **Sorting + DP:** #126. **Sorting vs hashing trade-off:** #127.
- **String processing + topological sort / design:** #29 (feature dependencies), #236 (request tracking, 180° rotation mapping). **String + bit masks / trie:** #317. **String + minimax:** #157.
- **In-place state encoding:** #230 (two bits per cell, the same trick as #7's "array as hash table").

## Must-do anchors (arrays & strings)
1. **#268 Find minimum covering substring**: shortest window with a counter and `formed`. It covers every "shortest window satisfying X" problem.
2. **#11 Measure the Longest Segment of Distinct Characters**: longest window with a last-seen jump. It is the base of #21 and every "longest valid window" problem.
3. **#92 Solve Banana Speed and Interval Merge**: binary search on the answer with a feasibility function, and it includes merge intervals as a bonus.
4. **#139 First and Last Indices of a Value**: write `lower_bound` correctly once. It covers #205, #345 and #510.
5. **#473 Find the Longest Balanced Binary Segment**: prefix + first-seen hashmap. It is the template for every "subarray with sum/balance property" problem with negatives.
6. **#51 Find All Distinct Four-Value Target Groups**: sort, then fix outer indices, then two pointers, with duplicate skipping. It covers #420 and #138.
7. **#26 Sliding-Window Mean After Removing the Largest K Values**: fixed window + two-group order statistics. It is the hardest common window follow-up (#261, #290).
8. **#42 Count Overlapping Rectangle Updates on a Grid**: 2D difference array + 2D prefix. It covers #227, #383 and #468.
9. **#378 Locate a Rotated Minimum despite Duplicate Ambiguity**: binary search without sortedness, plus the duplicate ambiguity argument. It covers #349.
10. **#204 Decide string transform with directional tokens and walls**: invariant-based two-sequence matching. It covers #182 and #76.
11. **#255 Measure the Longest Consecutive Value Run in Linear Time**: hashing for O(n) where sorting is the obvious first idea. It pairs with #7 for "linear time, beat the sort".
12. **#273 Validate a Signed Decimal and Exponent Spelling**: grammar-driven validation. It trains the edge-case discipline that every string problem (#436, #75, #236) needs.
