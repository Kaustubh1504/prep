# Maximum Value from Unit-Weight Items with Limited Copies Under a Capacity
> Google · Technical Screen · medium · Pattern: Greedy
> Source: https://prachub.com/interview-questions/maximum-value-from-unit-weight-items-with-limited-copies-under-a-capacity

You are packing items into a bag that can hold a total weight of at most `capacity`. There are `n` item types. Every copy of item type `i` weighs exactly 1 and is worth `values[i]`, and `counts[i]` identical copies of it are available. This is a bounded knapsack in which every item has the same unit weight.

Return the maximum total value you can pack.

### Function Signature

```python
def max_packed_value(values: list[int], counts: list[int], capacity: int) -> int:
```

`values[i]` and `counts[i]` describe item type `i`.

### Rules

- Choose a whole number of copies `x[i]` of each item type with `0 <= x[i] <= counts[i]`, so that the total weight `x[0] + x[1] + ... + x[n - 1]` is at most `capacity`.
- The total value is the sum of `x[i] * values[i]` over all item types. Return the largest achievable total value.
- The bag does not have to be full. If nothing is packed, the total value is 0.

### Constraints

- `1 <= len(values) == len(counts) <= 10^5`
- `0 <= values[i] <= 10^6`
- `1 <= counts[i] <= 10^9`
- `0 <= capacity <= 10^9`
- The total number of copies, `sum(counts)`, can reach `10^14`, and the answer can reach `10^15`. Both exceed `2^31 - 1`, so use 64-bit integers in languages with fixed-width integer types; both stay below `2^53`.

### Examples

**Example 1**

```text
Input:  values = [6, 10, 3], counts = [2, 1, 5], capacity = 4
Output: 25
```

The best choice packs the single copy worth 10, both copies worth 6 and one copy worth 3: 10 + 6 + 6 + 3 = 25, using all 4 units of capacity.

**Example 2**

```text
Input:  values = [4, 7], counts = [3, 2], capacity = 10
Output: 26
```

Only 5 copies exist, fewer than the capacity of 10, so all of them fit: 3 × 4 + 2 × 7 = 26.

**Example 3**

```text
Input:  values = [5, 0, 9], counts = [1000000000, 3, 1], capacity = 1000000000
Output: 5000000004
```

Packing the copy worth 9 and 999,999,999 copies worth 5 gives 9 + 4,999,999,995 = 5,000,000,004, which does not fit in a 32-bit signed integer. The copies worth 0 add nothing.

<details><summary>Hints (spoiler)</summary>

1. Every copy weighs exactly 1, so packing any k copies uses exactly k units of capacity, whichever item types they come from.
2. capacity can be 10^9 and sum(counts) can be 10^14, so anything that steps through capacity units or individual copies one at a time is too slow.
3. The answer can reach 10^15, beyond the 32-bit range, so accumulate it in a 64-bit integer.
</details>

<details><summary>Approach (spoiler)</summary>

Because every copy weighs exactly 1, packing k copies uses k units of capacity whichever copies they are, and since every value is non-negative, packing an extra copy never lowers the total. Exchange argument: if a packing leaves out an available copy worth a while it holds a copy worth b < a, swapping them keeps the weight the same and raises the total by a - b. So some optimal packing consists of the min(capacity, sum(counts)) most valuable copies. The algorithm sorts the item types by value in descending order and walks them, taking take = min(counts[i], remaining) copies of each type and subtracting take from the remaining capacity, and it stops when the capacity is used up. Invariant: after each processed type, the packed copies are the most valuable copies available and remaining = capacity - copies packed. Ties between equal values do not matter because their copies are interchangeable. Edge cases: capacity 0 returns 0; when sum(counts) <= capacity every copy is packed; copies worth 0 add nothing. Each product take * values[i] is at most 10^9 * 10^6 = 10^15, and the total is at most capacity * 10^6 <= 10^15, so a 64-bit accumulator never overflows and JavaScript numbers stay exact below 2^53. A dynamic program over capacity would need up to 10^9 states, which is far too slow.

**Time:** O(n log n) · **Space:** O(n)
</details>
