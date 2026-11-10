# Return the Lexicographically Smallest Two-Sum Index Pair
> Google · Onsite · medium · Pattern: Sorting
> Source: https://prachub.com/interview-questions/return-the-lexicographically-smallest-two-sum-index-pair

## Return the Lexicographically Smallest Two-Sum Index Pair

### Problem

Implement `twoSumSmallestPair(nums, target) -> pair`.

Return the lexicographically smallest pair of distinct zero-based indices `[i, j]` such that `i < j` and `nums[i] + nums[j] == target`. Pair `[a, b]` is lexicographically smaller than `[c, d]` when `a < c`, or when `a == c` and `b < d`.

Return `[]` when no valid pair exists. Do not mutate `nums`.

### Constraints

- `0 <= nums.length <= 200,000`.
- `-1,000,000,000 <= nums[i], target <= 1,000,000,000`.
- Use signed 64-bit arithmetic for sums.
- Target expected `O(n)` time with a hash-based approach and `O(n)` auxiliary space.

```hint Make ties observable
Test an input with several valid pairs and duplicates before deciding what information a hash entry must retain to satisfy the output ordering.
```

### Examples

```text
nums = [4, 1, 5, 3, 3]
target = 6
pair = [1, 2]
```

Both `[1, 2]` and `[3, 4]` are valid; `[1, 2]` is lexicographically smaller.

```text
nums = [2, 2]
target = 4
pair = [0, 1]
```

```text
nums = [1, 2, 3]
target = 10
pair = []
```

### Discussion Requirements

- Explain why returning the first pair found by an arbitrary hash-map iteration order is not deterministic.
- Compare a one-pass hash approach with sorting a value-index copy, including how each preserves the required index tie-break.

<details><summary>Hints (spoiler)</summary>

1. The pair with the smallest right index is not the same as the pair with the smallest left index. Decide which index the required order minimizes first, then drive your scan by that index.
2. Fix a left index i. What you actually need is the smallest position j > i whose value equals target - nums[i]. Knowing every position at which each value occurs makes that question answerable without rescanning the suffix.
3. Positions of equal values arrive in increasing order, so a single cursor per value can stay pointed at the first occurrence beyond the index you are currently considering, keeping the whole scan linear.
</details>

<details><summary>Approach (spoiler)</summary>

The rule that decides the answer is that the left index is minimized first. So the scan is driven by `i`: walk `i` from left to right, and the first `i` that has any partner after it produces the answer, because every later `i` is lexicographically worse regardless of its partner. This is why the common one-pass two-sum idea (scan `j`, look up `target - nums[j]` among values seen so far, return on the first hit) is not a solution to this problem -- that loop returns the pair with the smallest **right** index. On `nums = [1, 4, 6, 100, 200, 9]` with `target = 10` it returns `[1, 2]`, while the required answer is `[0, 5]`.

Given the driving index `i`, the remaining question is: what is the smallest `j > i` with `nums[j] == target - nums[i]`? The reference answers it with a precomputed index of occurrences.

1. **Index every position.** One pass builds `positions`, mapping each distinct value to the list of positions where it occurs. Because the pass runs left to right, each list is already sorted ascending.
2. **Consume positions as `i` advances.** A second map, `consumed`, counts how many positions of each value lie at or before the current `i`. At step `i` the counter for `nums[i]` is incremented, so for any value `v`, `positions[v][consumed[v]]` is exactly the first occurrence of `v` strictly after `i` -- every earlier occurrence has already been counted off by the step that visited it.
3. **Look up the complement.** With `complement = target - nums[i]`, if `positions` has that value and its cursor has not run past the end of its list, the entry at the cursor is the smallest valid `j`, and `[i, j]` is returned immediately. Otherwise no partner exists after `i` and the scan moves on.
4. **No pair.** Falling out of the loop means no `i` had a partner after it, so the function returns `[]`.

Correctness of the tie-break follows directly: the loop returns at the first `i` that admits any partner (minimizing the left index), and at that `i` the cursor yields the earliest partner position (minimizing the right index among pairs sharing that left index).

Both maps are built and read with constant-time operations, and each position is appended once and consumed once, so the total work is `O(n)` with `O(n)` auxiliary space. `nums` is only read, never reordered or written, which also rules out the sort-a-copy-of-(value, index) approach's hazard of losing the original positions the answer must report.

On width: with `nums[i]` and `target` each bounded by 1e9 in magnitude, a pair sum or a complement `target - nums[i]` reaches 2e9. That is still inside the signed 32-bit range, whose maximum is 2,147,483,647, but with less than 7% of headroom. The problem asks for signed 64-bit accumulation, and the Java and C++ references follow it: they key their maps by `long` / `long long` and compute the complement at 64-bit width. Nothing in the stated input domain makes a 32-bit intermediate wrap, so this is a margin requirement rather than a trap -- but it is the margin that disappears the moment a variant adds a third term or the bounds are widened.

**Time:** O(n) · **Space:** O(n)
</details>
