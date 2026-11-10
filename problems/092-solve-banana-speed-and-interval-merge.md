# Solve Banana Speed and Interval Merge
> Google · Technical Screen · medium · Pattern: Binary Search, Intervals / Sweep Line
> Source: https://prachub.com/interview-questions/solve-banana-speed-and-interval-merge

During two technical phone screens for a new graduate software engineering role, the candidate was asked to solve two coding problems: minimum eating speed and merging overlapping intervals.

### Constraints & Assumptions

- Provide clear algorithms, correctness reasoning, complexity, and edge cases.
- For minimum eating speed, each hour can be spent on only one pile.
- For interval merging, intervals overlap when the next start is less than or equal to the current merged end.
- Use sorted or binary-search approaches where appropriate.

### Clarifying Questions to Ask

- Are `piles` and `h` always positive?
- Is `h` at least the number of piles?
- Are interval endpoints inclusive?
- Can intervals be empty or unsorted?

### Part 1 - Minimum Eating Speed

Given `piles` and `h`, return the minimum integer speed `k` such that all piles can be eaten within `h` hours.

#### What This Part Should Cover

- Binary search on answer from 1 to `max(piles)`.
- Feasibility function using sum of `ceil(pile / k)`.
- Why feasibility is monotonic.
- Complexity and edge cases.

### Part 2 - Merge Overlapping Intervals

Given intervals `[start, end]`, merge all overlapping intervals and return non-overlapping intervals sorted by start.

#### What This Part Should Cover

- Sort by start.
- Maintain current merged interval.
- Extend on overlap, otherwise append and start a new interval.
- Complexity and edge cases.

### What a Strong Answer Covers

- Recognizes monotonic binary search for eating speed.
- Uses integer-safe ceiling division.
- Correctly defines interval overlap.
- Gives clean code and complexity for both problems.

### Follow-up Questions

- How would you avoid floating-point division in the banana problem?
- What if `h` is smaller than the number of piles?
- How do you merge touching intervals like `[1,3]` and `[3,5]`?
- How would you handle streaming intervals?

<details><summary>Hints (spoiler)</summary>

1. If speed k finishes in time, any larger speed also finishes in time. This monotonicity lets you binary search on the answer.
2. The answer lies in [1, max(piles)]: speed 1 is the slowest, and max(piles) finishes every pile in at most one hour.
3. Hours needed at speed k is sum of ceil(pile / k). Use integer-safe ceiling: (pile + k - 1) // k to avoid floating point.
</details>
