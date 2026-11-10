# Choose Non-Overlapping Weighted Jobs to Maximize Total Profit
> Google · Onsite · medium · Pattern: Intervals / Sweep Line
> Source: https://prachub.com/interview-questions/choose-non-overlapping-weighted-jobs-to-maximize-total-profit

You are given `n` jobs. Job `i` starts at `start_time[i]`, ends at `end_time[i]`, and earns `profit[i]` if you take it. You may take any set of jobs as long as no two of them overlap in time. Return the largest total profit you can earn.

### Function Signature

```python
def max_profit(start_time: list[int], end_time: list[int], profit: list[int]) -> int:
```

### Rules

- Job `i` occupies the half-open time interval `[start_time[i], end_time[i])`. Two jobs overlap when their intervals share any time, so a job that ends at time `x` and a job that starts at time `x` can both be taken.
- The jobs are given in no particular order.

### Constraints

- `1 <= n <= 100000`, with `len(start_time) == len(end_time) == len(profit) == n`
- `1 <= start_time[i] < end_time[i] <= 10^9`
- `1 <= profit[i] <= 10^4`
- The total profit is at most `10^9`, which fits in a 32-bit signed integer.

### Examples

**Example 1**

```text
Input:  start_time = [1, 2, 4, 6, 5]
        end_time   = [4, 6, 7, 9, 8]
        profit     = [20, 30, 25, 15, 40]
Output: 60
```

Take the job `[1, 4)` (profit 20) and the job `[5, 8)` (profit 40). No other compatible set earns more; for example, `[2, 6)` with `[6, 9)` earns 45.

**Example 2**

```text
Input:  start_time = [1, 3, 2]
        end_time   = [3, 5, 4]
        profit     = [5, 6, 10]
Output: 11
```

`[1, 3)` and `[3, 5)` touch at time 3 but do not overlap, so both can be taken for 11, which beats the single job `[2, 4)` worth 10.

<details><summary>Hints (spoiler)</summary>

1. Two jobs are compatible exactly when one ends at or before the moment the other starts; a shared endpoint is allowed.
2. Neither always taking the most profitable remaining job nor always taking the job that finishes first is safe: Example 2 defeats the first rule and Example 1 defeats the second.
3. The input order is arbitrary, so choose an order to process the jobs in that makes it easy to tell, for each job, which jobs could come before it in a schedule.
</details>

<details><summary>Approach (spoiler)</summary>

Sort the jobs by end time and let best[i] be the largest profit you can earn using only the first i jobs in that order, with best[0] = 0. Take the job at sorted position i, with start s and profit p. Every job before it in sorted order ends no later than it does. Such an earlier job is compatible with it exactly when its end time is <= s; a shared endpoint is allowed by the half-open rule. Any earlier job that ends after s also starts before the current job ends, so the two overlap. The compatible jobs therefore form a prefix of the sorted order, and a binary search over the sorted end times finds that prefix's length k. Then best[i + 1] = max(best[i], best[k] + p): an optimal set drawn from the first i + 1 jobs either skips the current job, or contains it plus an optimal set drawn from the k jobs that finish by s. Induction on i shows best[i] is optimal for every prefix, so best[n] is the answer. Jobs with the same end time may be sorted in any order, because none of them is ever counted as compatible with another: each starts strictly before that shared end. The best value must be carried forward (best[i + 1] >= best[i]) so that a later job can build on the best schedule of an earlier prefix, not only on the job just before it. Edge cases: a single job returns its own profit; identical or fully nested jobs collapse to the single most profitable one; touching jobs chain together. The answer never exceeds 10^9, so 32-bit integers suffice in every language.

**Time:** O(n log n) · **Space:** O(n)
</details>
