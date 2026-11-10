# Sliding-Window Mean After Removing the Largest K Values
> Google · Technical Screen · medium · Pattern: Sliding Window, Heap / Top-K
> Source: https://prachub.com/interview-questions/sliding-window-mean-after-removing-the-largest-k-values

For every contiguous window of a fixed size, remove the largest `k` values by multiplicity and compute the mean of the remaining values. Process sliding updates incrementally rather than sorting each complete window again.

Implement `trimmed_window_means(nums: int[], window: int, k: int) -> string[]`. Return means in window order as reduced fractions `numerator/denominator`, using a positive denominator. This exact fraction encoding is an explicit practice representation that avoids cross-language floating-point rounding differences.

### Constraints & Assumptions

- `1 <= len(nums) <= 200000`, `1 <= window <= len(nums)`, and `0 <= k < window`.
- Values range from -1,000,000 through 1,000,000. Use a sufficiently wide integer for window sums.
- Remove exactly `k` occurrences, not `k` distinct values. Equal values on the partition boundary may be represented in either group as long as the multiset counts are correct.
- For `k == 0`, retain the whole window. A window that would retain zero values is excluded by the input contract.
- Reduce each fraction by the greatest common divisor of the absolute numerator and denominator. Zero is `0/1`; an integer mean such as 5 is `5/1`.
- Aim for `O(n log window)` processing with `O(window)` maintained state, apart from the returned results.

### Examples

```text
nums = [1,9,2,8], window = 3, k = 1
result = ["3/2","5/1"]
```

```text
nums = [-1,1,3], window = 2, k = 0
result = ["0/1","2/1"]
```

Explain how insertions, removals, duplicate values, and rebalancing preserve the retained sum. For the reported large-data/stream follow-up, describe which state must remain in memory and why a new window does not require a full sort.

```hint Maintain a size and an ordering invariant
Partition the window into the removed largest values and the retained values. Keep their sizes correct and ensure no retained value is larger than a removed value.
```

<details><summary>Approach (spoiler)</summary>

Partition each window into low, the window-k smallest occurrences, and high, the removed k largest occurrences. Maintain low's sum and enforce max(low)<=min(high) whenever both groups are nonempty. Insert relative to low's largest boundary; remove the outgoing occurrence; then move boundary values until low has the required size. During initial fill and the brief removal step its target is min(window-k,current count). These boundary moves preserve ordering, so low is exactly the required retained multiset and its tracked sum is correct. Equal boundary values are interchangeable; Java counted TreeMaps and C++ multisets can remove any equal occurrence. Python/JavaScript use index-tagged max/min heaps and active-index group membership to distinguish duplicates. Deletions adjust logical counts/sum immediately, and stale heap heads are discarded before boundary access. When physical heaps exceed four times the window, rebuilding from active entries removes hidden stale entries. This prevents monotone streams from growing memory with n: rebuilding requires enough intervening deletions to amortize its O(window) Python heapify or O(window log window) JavaScript reinsertion cost. Each update has O(log window) amortized work, and maintained state is O(window). Reduce sum/(window-k) by gcd(abs(sum),window-k); the denominator stays positive and zero becomes 0/1. Wide sums fit signed 64-bit and exact JavaScript integers. In a true stream, retain the two groups, retained sum, deletion bookkeeping, and a window-sized FIFO to identify the next outgoing value. The callable can read that outgoing value from its existing input; neither setting sorts each new window.

**Time:** O(n log(window + 1)) amortized plus exact fraction formatting · **Space:** O(window) maintained state, excluding input and returned output
</details>
