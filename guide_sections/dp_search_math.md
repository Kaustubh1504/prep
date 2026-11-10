# DP, search & math

Covers Dynamic Programming, Backtracking, Greedy, Math / Number Theory, Bit Manipulation and Randomized / Probability (81 problems). Use it this way: solve the **anchor** of each cluster, then for each variant just say out loud what changes. If you can explain that change, you've got the variant covered.

---

## Dynamic Programming

**Recognise it when:**
- "Count the number of ways…", "minimum cost / maximum score to reach…", "is it possible to…" where each step makes one of a few choices and different paths end up in the same subproblem.
- A brute-force recursion branches 2–3 ways per element and n is 10^3–10^5, which is too big to enumerate but fine for O(n) to O(n²) states.
- Two strings/sequences compared character by character ("match", "transform", "subsequence count", "interleave").
- "Remove/burst/merge items and the neighbours change": interval DP over `[l, r]`.
- Capacity/budget with items ("at most W", "exact quantities"): knapsack.
- Grid with moves only right/down (or always moving one column forward): grid DP. Moves in all 4 directions but strictly increasing values: memoised DFS (the increasing values make it a DAG).

**Core idea:** Ask *"what is the smallest summary of the prefix/subproblem that lets me make every future decision?"* That summary is the state (index; index + last choice; `(i, j)` in two strings; `(l, r)` of an interval; remaining capacity). The transition is "which choice did I make last?", and the recurrence combines the answers of smaller states. Correctness comes from optimal substructure, and speed comes from each state being computed once. Write it top-down with `@cache` first, then convert to a bottom-up table if you need the memory or speed.

**Skeleton:**
```python
from functools import cache

def solve(items):
    n = len(items)
    @cache
    def f(i, extra):                 # state = position + whatever the future needs to know
        if i == n:                   # base case: empty suffix
            return BASE
        best = WORST
        for choice in choices(i, extra):          # last/next decision
            if valid(i, extra, choice):
                best = combine(best, gain(i, choice) + f(nxt(i, choice), new_extra(extra, choice)))
        return best
    return f(0, START)
# bottom-up: fill dp in the order that makes every dependency ready; roll rows to cut memory
```

**Pitfalls:**
- A state that is too small: if the future depends on "previous element/colour/count", that has to be in the state (e.g. max-product needs both min and max; remove-boxes needs "how many equal boxes are attached").
- Iteration order in bottom-up: 0/1 knapsack must loop capacity **downwards** in 1-D. Interval DP must loop by increasing length.
- Off-by-one in base cases with "empty" prefixes (decode ways with `'0'`, regex with an empty pattern, `x*` matching zero chars).
- Overflow or "modulo 1e9+7" requirements. Apply the mod on every addition, not only at the end.

### Clusters

#### 1-D counting: ways to build a prefix — `dp[i] = sum of dp[i - len]` over every valid last piece
- **Anchor:** [#323 Count Ordered One-Step and Two-Step Climbs](problems/323-count-ordered-one-step-and-two-step-climbs.md) — the simplest case: the last step is 1 or 2, so `dp[i] = dp[i-1] + dp[i-2]`. Build the "what was the last piece?" habit here.
- **Variants:**
  - [#412 Count Complete Digit-to-Letter Decodings](problems/412-count-complete-digit-to-letter-decodings.md) — **Differs:** the last piece (1 or 2 digits) is only allowed if it decodes validly (`'0'` alone is invalid, `10–26` for pairs). Same recurrence with guards. Zeros are where people slip. **Same concept, different setting.**
  - [#397 Count Spellings Using Chemical Element Symbols](problems/397-count-spellings-using-chemical-element-symbols.md) — **Differs:** pieces are 1- or 2-letter element symbols looked up case-insensitively in a set. Same shape as #412, but the counts get huge, so use big ints (Python) and two rolling variables. **Near-duplicate of #412.**

#### 1-D take/skip: non-adjacent selection — state = "did I take the previous element?"
- **Anchor:** [#459 Maximize a Nonadjacent Selection around a Circle](problems/459-maximize-a-nonadjacent-selection-around-a-circle.md) — full statement, and it contains the linear case. Keep `take`/`skip` while scanning.
- **Variants:**
  - [#102 Maximize sum without choosing adjacent elements](problems/102-maximize-sum-without-choosing-adjacent-elements.md) *(inferred)* — **Differs:** linear array, no wrap-around. This is the subroutine #459 calls. Solve it first as a warm-up. **Same problem, simpler setting.**

#### 1-D "best run ending at i" (Kadane family) — track the best value that *ends exactly* at i, then take the max over i
- **Anchor:** [#73 Longest Non-Decreasing Subarray After One Replacement](problems/073-longest-non-decreasing-subarray-after-one-replacement.md) — full statement and the most-asked version. You build `left[i]` (run ending at i) and `right[i]` (run starting at i), then try replacing each position to join `left[i-1]` and `right[i+1]` when `nums[i-1] <= nums[i+1]`.
- **Variants:**
  - [#111 Find the Longest Non-Decreasing Subarray After One Replacement](problems/111-find-the-longest-non-decreasing-subarray-after-one-replacement.md) *(inferred)* — **Differs:** nothing material. Same task (replace ≤1 element, non-decreasing). **Near-duplicate of #73.**
  - [#112 Find the Longest Continuous Increasing Subsequence](problems/112-find-the-longest-continuous-increasing-subsequence.md) *(inferred)* — **Differs:** no replacement and *strictly* increasing. Only the single "run ending here" counter is needed. This is the base case of #73, so do it first if you're rusty.
  - [#379 Maximize Products over Contiguous Nonempty Segments](problems/379-maximize-products-over-contiguous-nonempty-segments.md) — **Differs:** product instead of length. A negative number flips min↔max, so the state must hold **both** the max and the min product ending at i. **Same concept, different setting.**

#### Grid path counting — `dp[r][c] = sum of dp[predecessors]`
- **Anchor:** [#272 Count Right-and-Down Grid Routes](problems/272-count-right-and-down-grid-routes.md) — classic right/down moves: `dp[r][c] = dp[r-1][c] + dp[r][c-1]`. Also equals `C(m+n-2, m-1)` (math shortcut).
- **Variants:**
  - [#39 Count Up-Right/Right/Down-Right Grid Paths Through Ordered Checkpoints](problems/039-count-up-right-right-down-right-grid-paths-through-ordered-checkpoints.md) — **Differs:** moves are up-right/right/down-right, so you process **column by column** (each column depends on 3 cells of the previous column). With ordered checkpoints, check the checkpoint columns strictly increase, then multiply the path counts of the segments between checkpoints, or zero out the non-checkpoint rows in checkpoint columns. Apply the mod. **Follow-up of #272.**

#### Grid "largest shape ending at cell" — the answer at (i, j) comes from its already-computed neighbours
- **Anchor:** [#507 Measure the Largest All-One Square Area](problems/507-measure-the-largest-all-one-square-area.md) — `side[i][j] = 1 + min(up, left, up-left)` when the cell is `'1'`. Learn why the min of three is correct. Rolling one row is enough.
- **Variants:**
  - [#147 Count same-color squares in a character grid](problems/147-count-same-color-squares-in-a-character-grid.md) — **Differs:** count squares rather than find the max, and cells must share a colour rather than be `'1'`. The count is the **sum** of all `side[i][j]` (a square of side s ending at (i, j) contains s squares ending there). Only extend when the neighbours have the same character. **Follow-up of #507.**
  - [#43 Find the Longest Straight Run of One Color](problems/043-find-the-longest-straight-run-of-one-color.md) *(inferred)* — **Differs:** straight lines instead of squares. Keep 4 counters per cell (left, up, up-left, up-right), and each extends its predecessor in that direction if the colour matches. **Same concept, different setting.**

#### Memoised DFS on a grid — longest path where the move rule makes the state space acyclic
- **Anchor:** [#430 Find the Longest Strictly Increasing Cardinal Matrix Path](problems/430-find-the-longest-strictly-increasing-cardinal-matrix-path.md) — a strictly increasing path can't revisit a cell, so `f(cell) = 1 + max f(bigger neighbour)` with memo, O(mn). No visited set needed.
- **Variants:**
  - [#155 Find the Longest Momentum-Aware Water Path](problems/155-find-the-longest-momentum-aware-water-path.md) — **Differs:** equal/downhill moves are allowed, so revisits are possible. Uphill depends on the height two cells back. State becomes `(prev, cur, visited_mask)` on a small grid (bitmask DP / DFS). **Same concept, harder state.**

#### Two-sequence / string DP — state `(i, j)` = "how much of each string have I consumed?"
- **Anchor:** [#416 Count Position-Distinct Subsequences Matching a Target](problems/416-count-position-distinct-subsequences-matching-a-target.md) — cleanest two-string DP: `dp[i][j] += dp[i-1][j-1]` when the characters match, plus always `dp[i-1][j]` (skip the source char). A 1-D roll needs `j` to go **descending**.
- **Variants:**
  - [#60 Match an Entire String with Dot and Star](problems/060-match-an-entire-string-with-dot-and-star.md) — **Differs:** boolean, and pattern `x*` gives two transitions: zero copies (`dp[i][j-2]`) or one more copy if `x` matches `s[i-1]` (`dp[i-1][j]`). Initialise row 0 for patterns like `a*b*`. **Same concept, harder transitions.**
  - [#476 Recognize Recursive Split-and-Swap String Transformations](problems/476-recognize-recursive-split-and-swap-string-transformations.md) — **Differs:** compares *substrings of equal length*, so state is `(i, j, len)` and you try every split point with and without swap. Memo plus a char-count prune. Effectively interval DP on two strings. **Same concept, different setting.**

#### Interval DP — `dp[l][r]` and "which element is handled *last* in this range?"
- **Anchor:** [#508 Maximize Coins from Bursting All Balloons](problems/508-maximize-coins-from-bursting-all-balloons.md) — think of the balloon burst **last** in `(l, r)`. Its neighbours are then the fixed boundaries `l` and `r`, so the subproblems separate. Pad with 1s and loop by increasing length.
- **Variants:**
  - [#482 Maximize the Score from Removing Equal-Color Runs](problems/482-maximize-the-score-from-removing-equal-color-runs.md) — **Differs:** the score depends on how many equal boxes are glued together, so the state is `(l, r, k)` with k = equal boxes attached to the right of r. Either remove the run now, or merge with an earlier equal box at `m` by clearing `(m+1, r-1)` first. **Same concept, extra dimension.**

#### Knapsack / subset — state = (items considered, remaining capacity/needs)
- **Anchor:** [#95 Optimize 0/1 to bounded knapsack DP](problems/095-optimize-0-1-to-bounded-knapsack-dp.md) — the textbook 0/1 knapsack `dp[i][w]`, the 1-D optimisation (descending w), reconstruction by walking back, and the bounded version (binary-split the copies or loop count).
- **Variants:**
  - [#519 Buy Exact Item Quantities Using Reusable Bundles](problems/519-buy-exact-item-quantities-using-reusable-bundles.md) — **Differs:** the "capacity" is a vector of needs, and bundles are unbounded. Memoise on the `tuple(needs)`. Transitions = apply any bundle that doesn't overshoot, or buy the rest at unit price. **Same concept, multi-dimensional capacity.**

#### Mod-3 token lanes (Google favourite, 4 copies) — split into independent residue classes, then greedy per lane
- **Anchor:** [#20 Maximize coins with tokens moving by +3](problems/020-maximize-coins-with-tokens-moving-by-plus3.md) — a +3 move keeps `index % 3`, so solve 3 independent chains. In a chain, tokens can't cross, and the leftmost token can sweep every coin to its right. → really Greedy / Math (mod-class decomposition), not DP.
- **Variants:**
  - [#146 Maximize coins collected by tokens jumping +3](problems/146-maximize-coins-collected-by-tokens-jumping-plus3.md) — **Differs:** same rules and wording. **Near-duplicate of #20.**
  - [#188 Compute max coins with 3-step token moves](problems/188-compute-max-coins-with-3-step-token-moves.md) — **Differs:** same rules. **Near-duplicate of #20.**
  - [#321 Maximize coins collected by 3-step pieces](problems/321-maximize-coins-collected-by-3-step-pieces.md) — **Differs:** "pieces" instead of tokens, and the card spells out compressing a lane into consecutive slots. **Near-duplicate of #20.**

### Other Dynamic Programming problems
- [#212 Find Maximum Envelope Nesting](problems/212-find-maximum-envelope-nesting.md) *(inferred)* — sort by width ascending and height **descending** on ties, then LIS on heights with binary search (patience sorting) in O(n log n). The descending tie-break prevents equal widths from nesting.
- [#72 Check Whether Two Ordered Sequences Can Be Merged](problems/072-check-whether-two-ordered-sequences-can-be-merged.md) — consecutive pairs from each sequence become edges, and the sequences can be merged iff the graph has no cycle. → really Graph (topological sort / cycle detection).
- [#94 Check if all substrings are dictionary words](problems/094-check-if-all-substrings-are-dictionary-words.md) — every substring of length ≥3 must be a dictionary word: enumerate the O(n²) substrings (or extend from each start with an early exit). → really String Processing (brute-force enumeration). The hints about subsequences don't fit the stated task.
- [#210 Find Dictionary Matches for a Jammed String](problems/210-find-dictionary-matches-for-a-jammed-string.md) *(inferred)* — run-length encode words into (skeleton, counts) and bucket by skeleton. A word matches if every one of its counts ≤ the query's count (adjust for the "stretch" rule). → really String Processing / Hashing.

---

## Backtracking

**Recognise it when:**
- "Return **all** combinations / permutations / subsets / partitions / boards", meaning the output itself is exponential.
- Small n (≤ 10–20), or a target sum with small candidates. Fill a fixed structure (9×9 Sudoku, n×n board).
- "No duplicate answers" while the input has duplicates means sort + skip equal siblings.
- Constraint satisfaction: place items so that no two conflict (queens, flowers, Sudoku digits).
- If it only asks for the *count* or *min/max*, check DP first. Backtracking is for *enumerating* or for very small inputs.

**Core idea:** Build the answer one decision at a time (choose), recurse on the rest (explore), then undo the decision (unchoose) so the same buffer is reused. Prune as early as possible: an invalid partial state means none of its completions can be valid, so cut it. To avoid duplicates, decide **what a level of recursion represents** (the next element to include, or the next position to fill) and never let two siblings make an identical choice.

**Skeleton:**
```python
def backtrack(start, path, state):
    if is_complete(state):
        out.append(path[:])            # copy!
        return
    for i in range(start, len(cands)):
        if i > start and cands[i] == cands[i-1]:
            continue                    # skip duplicate siblings (cands sorted)
        if not feasible(state, cands[i]):
            continue                    # or `break` if cands sorted and infeasible from here on
        path.append(cands[i]); apply(state, cands[i])      # choose
        backtrack(next_start(i), path, state)               # explore (i: reuse allowed, i+1: single use)
        path.pop(); undo(state, cands[i])                   # unchoose
```

**Pitfalls:**
- Appending `path` instead of `path[:]` means every answer ends up as the same mutated list.
- Mixing up the dedupe rules: `i > start` (skip equal *siblings*) vs a `used[]` check for permutations (`skip if nums[i]==nums[i-1] and not used[i-1]`).
- Reuse vs single use is the whole difference between combination-sum I and II: recurse with `i` vs `i+1`.
- Forgetting to undo state (row/col/box sets, counts), which silently corrupts other branches.

### Clusters

#### Pick from a candidate list (subsets / combinations / permutations) — one template, different recursion arguments and dedupe rules
- **Anchor:** [#85 Enumerate Reusable-Value Target Combinations](problems/085-enumerate-reusable-value-target-combinations.md) — combination sum with unlimited reuse. Recurse with `start=i` so values can repeat, and prune when the remainder < 0 (or `break` once sorted).
- **Variants:**
  - [#253 Enumerate Target Combinations with Single-Use Occurrences](problems/253-enumerate-target-combinations-with-single-use-occurrences.md) — **Differs:** each occurrence used once and the input has duplicates. Sort, recurse with `i+1`, skip `cands[i]==cands[i-1]` when `i>start`. **Follow-up of #85.**
  - [#454 Enumerate Every Fixed-Size Choice from a Range](problems/454-enumerate-every-fixed-size-choice-from-a-range.md) — **Differs:** no target. Stop at size k. Prune when there aren't enough numbers left (`n - i + 1 < k - len(path)`). **Same concept, simpler.**
  - [#496 Generate all subsets (handle duplicates)](problems/496-generate-all-subsets-handle-duplicates.md) *(inferred)* — **Differs:** record *every* node of the recursion tree, not only leaves. Same sorted-sibling skip as #253. **Same concept, different output.**
  - [#351 Generate Distinct Permutations with Repeated Values](problems/351-generate-distinct-permutations-with-repeated-values.md) — **Differs:** order matters, so there's no `start` index. Use `used[]` (or a counter of values) and skip equal values at the same depth. **Same concept, permutation version.**

#### Fill positions one at a time from per-position choices — depth = output position
- **Anchor:** [#250 Enumerate Telephone-Keypad Letter Choices](problems/250-enumerate-telephone-keypad-letter-choices.md) — each digit has a fixed letter set, depth = digit index, output size = product of the set sizes. The cleanest "fill slot k" example.
- **Variants:**
  - [#228 Generate Every Ordered Sum Using Ones and Twos](problems/228-generate-every-ordered-sum-using-ones-and-twos.md) *(inferred)* — **Differs:** the choices are `'1'`/`'2'`, limited by the remaining sum, and the length varies. Try `'1'` before `'2'` to get lexicographic order for free. The *count* of these strings is #323 (Fibonacci). **Same concept, different setting.**

#### Constraint placement on a board — place one item per row/cell and keep O(1) conflict sets
- **Anchor:** [#296 List All Nonattacking Queen Boards](problems/296-list-all-nonattacking-queen-boards.md) — N-queens: one queen per row, with sets for columns, `r-c` and `r+c` diagonals. The template for "place and check conflicts in O(1)".
- **Variants:**
  - [#110 Solve Flower Placement and Directory Deletion](problems/110-solve-flower-placement-and-directory-deletion.md) *(inferred)* — **Differs:** one flower per row with distinct columns, rocks block cells, and only *adjacent rows* can't be in adjacent columns (so only the previous row's column needs checking). Return the first valid placement. Part 2 (directory deletion) is a tree DFS / post-order delete. **Same concept, weaker constraint.**
  - [#252 Complete a Uniquely Solvable Sudoku Board in Place](problems/252-complete-a-uniquely-solvable-sudoku-board-in-place.md) — **Differs:** fill empty cells with digits 1–9 using row/col/box sets (box = `(r//3)*3 + c//3`). Stop at the first solution (return True up the stack). Pick the most-constrained cell first for speed. **Same concept, bigger board.**

#### Partition into valid groups — cut the input into pieces where each piece passes a check
- **Anchor:** [#455 Enumerate All Contiguous Palindrome Cut Choices](problems/455-enumerate-all-contiguous-palindrome-cut-choices.md) — choose the end of the next palindrome piece, recurse on the rest. Precompute `isPal[i][j]` with a DP so each check is O(1).
- **Variants:**
  - [#81 Determine if a 14-tile hand is winning](problems/081-determine-if-a-14-tile-hand-is-winning.md) — **Differs:** the input is a multiset (a tile count array 1–9), not a string. Pick the pair first, then repeatedly remove the *smallest* remaining tile as a triplet or a run. Always taking the smallest tile makes the search almost linear. **Same concept, multiset setting.**

---

## Greedy

**Recognise it when:**
- An exchange argument works: "if an optimal answer did X instead of the greedy choice, swapping it can't make things worse."
- Reachability or frontier questions: "can you reach the end", "furthest you can get".
- Single-pass optimisation over time series: "best buy/sell", "sum of every gain".
- Scheduling with counts or cooldowns: "most frequent first" (heap).
- Uniform item sizes in a knapsack-looking problem, where the knapsack becomes "take the most valuable first".

**Core idea:** Make the locally best choice and prove it's never worse than any alternative, usually with an exchange argument or an invariant like "the reachable set is a prefix". Greedy solutions are short. The proof is what the interviewer wants. If you can't argue it, fall back to DP.

**Skeleton:**
```python
def greedy(items):
    items.sort(key=priority)          # or use a heap for a changing "best next"
    state, answer = INIT, 0
    for x in items:                   # one pass; each step commits irrevocably
        if can_take(state, x):
            state = update(state, x)
            answer = improve(answer, x)
        elif must_stop(state, x):
            break
    return answer
```

**Pitfalls:**
- Picking a plausible greedy without a proof. Test it on a tiny counterexample (e.g. coin change with odd denominations).
- Tie-breaking and order details (task-scheduler label order, text-justification left-biased extra spaces, last line left-justified).
- Overflow with huge capacities/counts (#3 has capacity up to 1e9, so loop over item types, never over capacity units).

### Clusters

#### Stock trading in one pass — track the best earlier state, or add up every gain
- **Anchor:** [#414 Maximize One Chronological Stock Transaction](problems/414-maximize-one-chronological-stock-transaction.md) — one transaction: keep the minimum price so far and maximise `price - min_so_far`.
- **Variants:**
  - [#324 Maximize Repeated One-Share Stock Trading Profit](problems/324-maximize-repeated-one-share-stock-trading-profit.md) — **Differs:** unlimited transactions, so the answer is the sum of every positive `p[i]-p[i-1]` (each upswing is captured). With a fee, a cooldown or at most k trades, greedy fails and you need a DP state machine `hold/free[i][k]`. **Follow-up of #414.**

### Other Greedy problems
- [#120 Determine Whether the Last Array Index Is Reachable by Forward Jumps](problems/120-determine-whether-the-last-array-index-is-reachable-by-forward-jumps.md) — the reachable indices always form a prefix. Track `furthest = max(furthest, i + nums[i])` and fail if `i > furthest`.
- [#3 Maximum Value from Unit-Weight Items with Limited Copies Under a Capacity](problems/003-maximum-value-from-unit-weight-items-with-limited-copies-under-a-capacity.md) — every item weighs 1, so knapsack becomes "sort item types by value desc, take copies until capacity runs out". Exchange argument, and use 64-bit sums. Contrast with #95.
- [#96 Remove elements to avoid k-prefix duplicates](problems/096-remove-elements-to-avoid-k-prefix-duplicates.md) — keep the *earliest* k elements of listB that aren't in `set(listA[:k])`, delete forbidden ones seen before that, keep everything after. Follow-up: a sliding window union over the last d lists with a frequency map.
- [#148 Compute minimal transfers to settle group expenses](problems/148-compute-minimal-transfers-to-settle-group-expenses.md) — net each person's balance (in cents), then match debtors and creditors. Greedy matching gives ≤ n−1 transfers. The *true* minimum needs backtracking/bitmask DP over the non-zero balances (find zero-sum subgroups).
- [#254 Justify Greedy Lines to an Exact Width](problems/254-justify-greedy-lines-to-an-exact-width.md) — pack as many words per line as fit, spread spaces with the remainder going to the left gaps, and left-justify the last line. → really String / Simulation.
- [#281 Rearrange Tasks With Cooldown](problems/281-rearrange-tasks-with-cooldown.md) *(inferred)* — max-heap by remaining count plus a cooldown queue (or the formula `(maxCount-1)*(n+1) + #tasks with maxCount`). Watch the tie-break by label. → also Heap / Top-K.

---

## Math / Number Theory

**Recognise it when:**
- "Without converting to string", "without multiply/divide/mod", "within signed 32-bit": digit peeling and overflow guards.
- Huge bounds (n up to 1e9–1e18) with a simple property means there's a formula or digit DP, not iteration.
- Numbers given as digit lists/strings: column arithmetic with a carry.
- Primes, factors, gcd, "only prime factors 2, 3, 5", "trailing zeros".
- Points/slopes with "exact" means normalise with gcd instead of using floating point.

**Core idea:** Turn the property into arithmetic on digits or prime factors. `n % b` gives the last base-b digit and `n // b` drops it. Carries handle addition. Counting up to a huge N works one digit position at a time (high/cur/low split, or digit DP with a `tight` flag). Overflow is avoided by checking *before* you multiply or add (`res > (MAX - d) // 10`).

**Skeleton:**
```python
def digits_op(n, base=10):
    neg, n = n < 0, abs(n)
    acc = 0
    while n:
        n, d = divmod(n, base)          # peel least-significant digit
        if acc > (LIMIT - d) // base:   # overflow guard BEFORE acc*base + d
            return OVERFLOW
        acc = acc * base + d            # or: check property / accumulate per digit
    return -acc if neg else acc
```

**Pitfalls:**
- Negatives: Python's `%` and `//` round toward −∞. Use `abs()` or `math.fmod` / `int(a/b)` for truncation toward zero.
- INT_MIN edge cases (`-2^31 / -1`, `abs(-2^31)`, `pow(x, -2^31)`).
- One-based systems (spreadsheet columns have no zero digit, so subtract 1 before each divmod).
- Floating point slopes in geometry. Use reduced `(dy, dx)` with a sign convention.

### Clusters

#### Digit peeling — `n % 10` / `n // 10` to test or rebuild a number
- **Anchor:** [#23 Check a Decimal Integer for Symmetry](problems/023-check-a-decimal-integer-for-symmetry.md) — palindrome number. Negatives are false. Reverse only the second half (stop when `rev >= n`) to avoid overflow.
- **Variants:**
  - [#183 Check Digits and Combine Ranges](problems/183-check-digits-and-combine-ranges.md) — **Differs:** part 1 is the same palindrome check. Part 2 is merging overlapping ranges (sort by start, extend the end). **Near-duplicate of #23** plus an intervals task.
  - [#103 Reverse Decimal Digits Within Signed 32-Bit Limits](problems/103-reverse-decimal-digits-within-signed-32-bit-limits.md) — **Differs:** rebuild the full reversed number, and you must detect 32-bit overflow *before* `rev*10 + d` without 64-bit storage. **Follow-up of #23.**
  - [#87 Check Whether Digits Are Monotone Increasing](problems/087-check-whether-digits-are-monotone-increasing.md) *(inferred)* — **Differs:** reading right to left, the digits must be non-increasing. Start `prev = 10` as a sentinel. **Same concept.**
  - [#438 Reduce a Decimal Integer to One Digit](problems/438-reduce-a-decimal-integer-to-one-digit.md) — **Differs:** repeat the digit sum until one digit remains, or O(1) digital root `1 + (n-1) % 9` (0 → 0). **Same concept, plus a closed form.**
  - [#423 Recognize Digit-Square Sequences That Reach One](problems/423-recognize-digit-square-sequences-that-reach-one.md) — **Differs:** the sum of squared digits repeats, so you need cycle detection (seen set, or Floyd's fast/slow pointers). **Same concept, plus cycle detection.**

#### Column arithmetic on digit sequences — walk from the least significant end with a carry
- **Anchor:** [#173 Add two big integers from digit lists](problems/173-add-two-big-integers-from-digit-lists.md) — digit lists (or linked lists) LSB-first: sum digits plus carry, append `s % 10`, carry `s // 10`, and don't drop the final carry.
- **Variants:**
  - [#411 Add Two Binary Digit Strings](problems/411-add-two-binary-digit-strings.md) — **Differs:** base 2 and strings MSB-first, so iterate from the ends with two pointers. **Same concept, base 2.**
  - [#234 Solve several coding interview problems](problems/234-solve-several-coding-interview-problems.md) *(inferred)* — **Differs:** a multi-part set. One part is adding big numbers stored as strings (same as #173). Part 1 restores IP addresses (backtracking over four 1–3 digit segments, no leading zeros, ≤255). Other parts are ancestor-chain intersection and geometric overlap. **Same concept, mixed bag.**

#### Base conversion — repeated divmod by the base
- **Anchor:** [#481 Write an Integer Using Base Seven Digits](problems/481-write-an-integer-using-base-seven-digits.md) — base 7: divmod by 7, collect remainders, reverse, and add the sign only for negatives (0 → "0").
- **Variants:**
  - [#537 Decode Uppercase Spreadsheet Column Titles](problems/537-decode-uppercase-spreadsheet-column-titles.md) — **Differs:** the reverse direction (title → number: `acc = acc*26 + (ch-'A'+1)`), and it's *bijective* base 26 (A=1…Z=26, no zero digit). **Same concept, one-based digits.**

#### Prime factors — divide out the allowed primes, or count how many times a prime divides
- **Anchor:** [#466 Recognize Positive Numbers with Only Three Allowed Prime Factors](problems/466-recognize-positive-numbers-with-only-three-allowed-prime-factors.md) — divide out 2, 3, 5 while possible. The number is ugly iff what's left is 1 (n ≤ 0 → false).
- **Variants:**
  - [#465 Generate the One-Based Sequence of Ugly Numbers](problems/465-generate-the-one-based-sequence-of-ugly-numbers.md) — **Differs:** generate the nth ugly number instead of testing one. Use three pointers into the result list, each multiplying by 2/3/5, take the min and advance *every* pointer that ties (to avoid duplicates). **Follow-up of #466.**
  - [#469 Recognize Powers of Three without Iteration](problems/469-recognize-powers-of-three-without-iteration.md) — **Differs:** a single prime with no loop: the largest 32-bit power of 3 is 3^19 = 1162261467, so n > 0 and `3^19 % n == 0`. **Same concept, closed form.**
  - [#381 Count Decimal Zeros at the End of a Factorial](problems/381-count-decimal-zeros-at-the-end-of-a-factorial.md) — **Differs:** count factors of 5 in n! (`sum n // 5^k`) because 2s are always more plentiful. **Same concept, counting.**

#### Count over all numbers ≤ N by digit position — digit DP / positional counting
- **Anchor:** [#462 Count Decimal One Digits up to a Bound](problems/462-count-decimal-one-digits-up-to-a-bound.md) — for each position, split N into `high | cur | low` and add the contribution of a 1 there (`cur == 0`, `== 1`, `> 1` cases).
- **Variants:**
  - [#168 Count Good Numbers up to a Limit](problems/168-count-good-numbers-up-to-a-limit.md) — **Differs:** the property is structural (non-zero, unique digits, no valley), so you need full digit DP with state `(pos, tight, started, used_mask, last_two)`. N ≤ 1e18 but there are at most 9 usable digits. **Same concept, general digit DP.**

#### Doubling — build the answer from powers of two in O(log n)
- **Anchor:** [#223 Evaluate a Floating Base to an Integer Power](problems/223-evaluate-a-floating-base-to-an-integer-power.md) — fast exponentiation: square the base and halve the exponent, a negative exponent means `1/x`, and take care with `n = -2^31`.
- **Variants:**
  - [#294 Compute a Quotient Using Signed 32-Bit Operations](problems/294-compute-a-quotient-using-signed-32-bit-operations.md) — **Differs:** divide without `*` `/` `%`. Subtract the largest `divisor << k` that fits (or work in negatives to stay within 32 bits). The overflow case is `-2^31 / -1`. **Same concept, applied to division.**

### Other Math / Number Theory problems
- [#206 Select a Permutation by Its Lexicographic Rank](problems/206-select-a-permutation-by-its-lexicographic-rank.md) — factorial number system: with k zero-based, digit = `k // (n-1)!` picks from the remaining digits. O(n²) and no enumeration (compare #351).
- [#348 Count Collinear Points with Exact Integer Directions](problems/348-count-collinear-points-with-exact-integer-directions.md) — for each anchor point, hash the reduced direction `(dy/g, dx/g)` with a sign convention and handle duplicate points. Best count + 1. O(n²).
- [#382 Count Primes Strictly before an Integer Bound](problems/382-count-primes-strictly-before-an-integer-bound.md) — Sieve of Eratosthenes. Start marking at `p*p` and stop at `p*p >= n`. "Strictly less than n".
- [#415 Generate the First Rows of Pascal Coefficients](problems/415-generate-the-first-rows-of-pascal-coefficients.md) — each row comes from adjacent sums of the previous row. → really DP (1-D, row by row). `C(n, k)` connection.
- [#56 Determine validity after digit-constrained deletions](problems/056-determine-validity-after-digit-constrained-deletions.md) — every digit v must delete v earlier parentheses, and the remaining parentheses must be balanced. Scan left to right with a balance and a deletion budget, and spend deletions greedily on parentheses that hurt the balance. → really Greedy / Stack.

---

## Bit Manipulation

**Recognise it when:**
- "Every element appears twice/three times except one", "O(1) extra space".
- XOR of ranges or subarrays, "equal XOR". Prefix XOR works like prefix sums (`x ^ x = 0`).
- "Count set bits", "power of two", toggling flags, small sets (n ≤ 20) stored as a mask.
- Signed 32-bit details in Python: you need masking with `0xFFFFFFFF` and a sign fix.

**Core idea:** XOR is its own inverse and commutative, so pairs cancel and order doesn't matter. When things repeat k times, count each bit position mod k. `x & (x-1)` clears the lowest set bit and `x & -x` isolates it. Prefix XOR turns "XOR of a[i..j] == 0" into "prefix[i] == prefix[j+1]".

**Skeleton:**
```python
acc = 0
for x in nums: acc ^= x                      # pair cancellation
bits = [0]*32
for x in nums:
    for b in range(32): bits[b] += (x >> b) & 1   # per-bit counting (mod k)
while x: x &= x - 1; cnt += 1                # pop count by clearing lowest bit
sub = mask
while sub: visit(sub); sub = (sub - 1) & mask  # iterate submasks
```

**Pitfalls:**
- In Python, negative numbers have infinite sign bits. Mask to 32 bits and convert back (`r - (1<<32)` if bit 31 is set).
- Operator precedence: `x & 1 == 0` parses as `x & (1 == 0)`. Add parentheses.
- Reaching for bits when a hash set is clearer. Use bits when the problem asks for O(1) space.

### Clusters

#### XOR cancellation and per-bit counting — the shared idea is that matching occurrences cancel to 0
- **Anchor:** [#325 Recover the Value Left after Pair Cancellation](problems/325-recover-the-value-left-after-pair-cancellation.md) — every value appears twice except one. XOR everything and the pairs cancel.
- **Variants:**
  - [#377 Recover a Signed Value among Threefold Repetitions](problems/377-recover-a-signed-value-among-threefold-repetitions.md) — **Differs:** values appear **three** times, so XOR no longer cancels. Count each of the 32 bits mod 3 (or the `ones/twos` state machine), then sign-fix bit 31 in Python. **Follow-up of #325.**
  - [#170 Solve order-statistics and XOR-triplet problems](problems/170-solve-order-statistics-and-xor-triplet-problems.md) *(inferred)* — **Differs:** part 2 counts XOR triplets. `a == b` ⇔ the XOR of `arr[i..k]` is 0 ⇔ `prefix[i] == prefix[k+1]`, and each such pair gives `k - i` triplets (track count and index-sum per prefix value). Part 1 (count smaller to the right) → really Fenwick tree / merge sort. **Same concept, prefix-XOR setting.**

### Other Bit Manipulation problems
- [#421 Count Set Bits in a Positive Signed Integer](problems/421-count-set-bits-in-a-positive-signed-integer.md) — clear the lowest set bit until zero (`n & (n-1)`), and for repeated calls use a 256-entry byte table to sum 4 lookups.

---

## Randomized / Probability

**Recognise it when:**
- "Uniformly at random", "every permutation equally likely", "given only rand(a, b)".
- "Expected value", "minimise expected remaining candidates", weighted distributions.
- A stream of unknown length means reservoir sampling. Weighted pick means prefix sums plus binary search.

**Core idea:** Prove uniformity by counting. Each step must pick among the remaining options with equal probability, so the product of the probabilities is the same for every outcome. For expected-value problems, partition the outcomes by what you'd observe, then score each partition by its probability × its size.

**Skeleton:**
```python
import random
def reservoir(stream, k):               # generic: k uniform samples from a stream
    res = []
    for i, x in enumerate(stream):
        if i < k: res.append(x)
        else:
            j = random.randint(0, i)    # inclusive
            if j < k: res[j] = x
    return res
```

**Pitfalls:**
- Off-by-one in the random range (`randint` is inclusive). Drawing j from the *whole* array on every swap gives a biased shuffle (n^n outcomes aren't a multiple of n!).
- Floating point comparisons when choosing the best expected score. Compare fractions with a common denominator, or use a strict `<` with a stated tie-break.

### Other Randomized / Probability problems
- [#161 Shuffle array using random integer API](problems/161-shuffle-array-using-random-integer-api.md) — Fisher–Yates: for i from n−1 down to 1, swap `a[i]` with `a[rand(0, i)]`. Uniform because each position's choice is uniform over the remaining cards.
- [#289 Choose optimal guesses for green-only Wordle](problems/289-choose-optimal-guesses-for-green-only-wordle.md) *(inferred)* — for each candidate guess, group answers by green-feedback bitmask and score `Σ P(mask) · |bucket|`, then keep the min (lexicographic tie-break). → also Hashing / Bitmask.

---

## Cross-pattern links
- **Count vs enumerate:** #323 (count 1/2-step climbs → DP) and #228 (list them → backtracking) share the same recurrence. #412/#397 (count segmentations) vs #455 (list palindrome partitions, using a DP `isPal` table). When the problem only asks for a number, look for overlapping subproblems.
- **Memoised DFS = DP on a graph:** #430 (strictly increasing makes it a DAG, so memo on the cell). #155 adds `prev + visited bitmask` to the state. #72 is topological sort / cycle detection (Graph family).
- **Sort, then DP / binary search:** #212 envelopes = sort with a tie trick + LIS via `bisect` (Sorting / Binary Search family).
- **Greedy vs DP decision:** #414/#324 stock greedy breaks once you add a fee, cooldown or k trades (use a DP state machine). #3 (unit weights → greedy) vs #95 (arbitrary weights → knapsack DP). #148 greedy matching vs exact minimum by backtracking/bitmask DP.
- **Math meets DP:** #462 and #168 digit DP. #415 Pascal is DP and #272 grid paths = `C(m+n-2, m-1)`. #20 family is mod-class decomposition (Math) followed by a greedy sweep.
- **Bits meet Math:** #377 counts bits mod 3. #170 prefix XOR mirrors prefix-sum + hashmap counting (Prefix Sum / Hashing family), and its part 1 is Fenwick tree / merge-sort counting.
- **Factorial number system vs enumeration:** #206 jumps straight to the k-th permutation, while #351 enumerates all of them.
- **Outside the family:** #281 Heap / Top-K, #183 part 2 Intervals / Sweep Line, #94 and #210 String Processing / Hashing, #56 Stack / Parsing, #110 part 2 Tree DFS, #289 bitmask bucketing + Hashing, #234 mixes backtracking (IP restore) with big-int strings (#173).

## Must-do anchors (DP, search & math)
1. **#20 Maximize coins with tokens moving by +3** — Google's most repeated problem here (4 copies). Trains spotting invariants (mod classes) and decomposing into independent subproblems.
2. **#73 Longest Non-Decreasing Subarray After One Replacement** — asked twice. Trains the "run ending at i / starting at i" precomputation and joining across one change.
3. **#459 Maximize a Nonadjacent Selection around a Circle** — take/skip state DP, and turning a circle into two linear ranges.
4. **#412 Count Complete Digit-to-Letter Decodings** — counting-ways DP with validity guards and the classic zero edge cases.
5. **#95 Optimize 0/1 to bounded knapsack DP** — knapsack state, 1-D descending loop, reconstruction, bounded copies.
6. **#507 Measure the Largest All-One Square Area** — grid DP from neighbours. Extends directly to #147 (count) and #43 (lines).
7. **#60 Match an Entire String with Dot and Star** — two-string DP with tricky transitions and base rows.
8. **#430 Find the Longest Strictly Increasing Cardinal Matrix Path** — memoised DFS as DP on an implicit DAG.
9. **#508 Maximize Coins from Bursting All Balloons** — interval DP and the "last action splits the range" trick.
10. **#85 / #253 Combination sum (reuse vs single-use)** — the backtracking template, `i` vs `i+1`, sorted sibling dedupe (covers #454, #496, #351).
11. **#296 List All Nonattacking Queen Boards** — constraint placement with O(1) conflict sets (covers #252, #110).
12. **#377 Recover a Signed Value among Threefold Repetitions** — per-bit counting mod k plus Python sign handling (covers #325).
