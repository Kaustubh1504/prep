# Track the Running Median of an Integer Stream
> Google · Onsite · medium · Pattern: Heap / Top-K, Simulation
> Source: https://prachub.com/interview-questions/track-the-running-median-of-an-integer-stream

## Track the Running Median of an Integer Stream

### Problem

Implement `runningMedianTwice(values) -> mediansTwice`.

Process `values` from left to right. After each insertion, compute the median of the prefix seen so far and append twice that median to the result. This encoding avoids floating-point output:

- For an odd-length prefix, append two times its middle sorted value.
- For an even-length prefix, append the sum of its two middle sorted values.

Return one integer for every input value, in prefix order. The input must not be mutated.

### Constraints

- `0 <= values.length <= 200,000`.
- `-1,000,000,000 <= values[i] <= 1,000,000,000`.
- Use signed 64-bit arithmetic when adding or doubling values.
- Target `O(n log n)` time and `O(n)` auxiliary space.

```hint Trace both prefix parities
Before selecting a data structure, write the expected result after each insertion for a stream with duplicates and with values arriving in descending order.
```

### Examples

```text
values = [5, 2, 8, 1]
mediansTwice = [10, 7, 10, 7]
```

The prefix medians are `5`, `3.5`, `5`, and `3.5`.

```text
values = [-2, -2, 4]
mediansTwice = [-4, -4, -4]
```

### Discussion Requirements

- Explain how two priority queues can maintain the lower and upper portions of the stream and which balance invariant is required.
- If every value lies in a small fixed integer range, compare the heap solution with a frequency table and a maintained order statistic.
- If the query changes from median to an arbitrary rank `k`, explain which structures still work and what additional balancing or order-statistic support is needed.

<details><summary>Hints (spoiler)</summary>

1. Write out the answer after each insertion for a short stream by hand. Notice that only the one or two middle elements of the sorted prefix ever matter -- everything else in the prefix is irrelevant to the answer at that step.
2. Re-sorting the whole prefix after every insertion is O(n^2 log n) and will not finish on the largest input. You only need the largest element of the smaller half and the smallest element of the larger half after each step. Which container hands you one of those in O(log n) per update?
3. Whatever you keep, fix the size relationship between the two halves first -- either equal sizes, or one half exactly one element larger -- and restore it after every insertion before you read the answer. Getting that invariant wrong is what makes odd-length and even-length prefixes disagree.
</details>

<details><summary>Approach (spoiler)</summary>

The reference keeps the prefix split across two heaps rather than storing it
sorted.

`lower` is a max-heap holding the smaller half of the values seen so far, and
`upper` is a min-heap holding the larger half. Every element of `lower` is <=
every element of `upper`, so `lower`'s root is the largest value in the bottom
half and `upper`'s root is the smallest value in the top half -- exactly the one
or two elements that sit in the middle of the sorted prefix.

For each incoming value, the reference does three things:

1. **Place it.** If `lower` is non-empty and the value is <= `lower`'s root, it
   belongs in the bottom half; otherwise it goes to `upper`. This preserves the
   "everything in lower <= everything in upper" property.
2. **Rebalance.** Restore the size invariant `len(lower) == len(upper)` or
   `len(lower) == len(upper) + 1` by moving at most one root across. Only one
   move is ever needed, because a single insertion changes a size by one.
3. **Read the answer in O(1).** With that invariant, an odd-length prefix always
   has its middle at `lower`'s root, so the answer is `2 * lower_root`. An
   even-length prefix has its two middles at the two roots, so the answer is
   `lower_root + upper_root`. No sorting, no scanning, no floating point.

Each step performs a constant number of heap pushes and pops, so the total work
is O(n log n) and the two heaps together hold n elements, giving O(n) auxiliary
space. The input is only read, never sorted in place, so the caller's list is
left untouched.

The doubled encoding is what keeps every value an exact integer. Since
|values[i]| <= 1e9, both `2 * m` and `a + b` are bounded by 2e9 in absolute
value. That overflows a signed 32-bit integer, which is why the Java and C++
references accumulate and return 64-bit values; it is comfortably inside the
exact-integer range of a double, so the JavaScript reference agrees bit for bit
with the other three.

**Time:** O(n log n) · **Space:** O(n)
</details>
