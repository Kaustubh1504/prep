# Maintain streaming median and loosemedian
> Google · Onsite · medium · Pattern: Heap / Top-K
> Source: https://prachub.com/interview-questions/maintain-streaming-median-and-loosemedian

# Maintain streaming median and loosemedian

Design a data structure for an online stream of positive integers supporting insert
(x). After each insertion, output:
(a) the median of all values seen so far (for an even count, define the median as the average of the two middle values); and
(b) the 'loose median' interval [2^k, 2^(k+
1)] where k is the unique integer satisfying 2^k < median < 2^(k+
1). Describe the algorithms and data structures, their time and space complexities, and how to implement bit operations to compute 2^k from the median. Discuss how you would handle boundary cases (e.g., median equals a power of two, zero/negative numbers, or non-integer medians).

### Clarifying Questions to Ask
- Clarify input sizes, value ranges, mutability, return format, and tie-breaking.
- State the target time and space complexity before coding.
- Call out edge cases such as empty inputs, duplicates, invalid values, overflow, and boundary sizes.

### What a Strong Answer Covers
- A clear algorithm with the right data structures and enough pseudocode or code-level detail to implement it.
- A correctness argument that explains why the algorithm covers all required cases.
- Time and space complexity, plus at least one alternative approach when relevant.
- Focused tests for normal cases, edge cases, and failure modes.

### Follow-up Questions
- How would the approach change if the input were streaming or too large for memory?
- What invariants would you assert in production code?
- Which tests would catch off-by-one, duplicate, or tie-breaking bugs?

<details><summary>Hints (spoiler)</summary>

1. Maintain two heaps: a max-heap for the lower half and a min-heap for the upper half. Keep their sizes balanced so the median is at the heap tops.
2. For an even count the median is the average of the two heap tops and can be a non-integer such as 3.5; for an odd count it is the larger heap's top.
3. The loose median k = floor(log2(median)). Compute the bounds as 1<<k and 1<<(k+1). Because log2 of a float can be slightly off near a power of two, verify and nudge k with a small while-loop so that 2^k <= median < 2^(k+1).
4. When the median equals a power of two (e.g. 8), it sits on the lower boundary, giving [8, 16].
</details>
