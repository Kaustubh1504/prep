# Shuffle array using random integer API
> Google · Technical Screen · hard · Pattern: Randomized / Probability
> Source: https://prachub.com/interview-questions/shuffle-array-using-random-integer-api

You are given an array `nums` of length `n` representing a deck of distinct cards.

You **do not** have access to a built-in shuffle function, but you are given the following API:

```python
rand_int(l, r)  # returns a uniformly random integer in [l, r], inclusive
```

### Task
Implement a function `shuffle(nums)` that randomly permutes the array **in place** such that **every one of the `n!` permutations is equally likely**.

### Requirements
- You may only use `rand_int(l, r)` as your source of randomness.
- The algorithm should run in `O(n)` time and `O(1)` extra space.
- You may assume `rand_int` itself is perfectly uniform and independent between calls.

Describe your algorithm, argue why the resulting permutation is uniform, and give the time and space complexity.

<details><summary>Hints (spoiler)</summary>

1. Think about filling the array from the end: which card should go into the last unshuffled position?
2. After choosing a random index from the remaining prefix, a swap can place that chosen card without needing extra memory.
</details>
