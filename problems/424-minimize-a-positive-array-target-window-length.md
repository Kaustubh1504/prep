# Minimize a Positive-Array Target Window Length
> Google · Other · medium · Pattern: Sliding Window
> Source: https://prachub.com/interview-questions/minimize-a-positive-array-target-window-length

### Problem

Return the smallest length of a nonempty contiguous subarray whose sum is at least target. If no such subarray exists, return 0. All input values and the target are positive.

```cpp
int minSubArrayLen(int target, vector<int>& nums);
```

### Examples

```text
Input: target = 10, nums = [1,2,3,7,2]
Output: 2
```

The pair 3,7 meets the target, and no single value does.

```text
Input: target = 8, nums = [1,2,3]
Output: 0
```

### Constraints

- Target is between 1 and 1000000000.
- Length is between 1 and 100000.
- Each value is between 1 and 10000.

### Optional follow-up

After finding an `O(n)` solution, provide an `O(n log n)` alternative.
