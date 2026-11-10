# Recover the Value Left after Pair Cancellation
> Google · Other · easy · Pattern: Bit Manipulation
> Source: https://prachub.com/interview-questions/recover-the-value-left-after-pair-cancellation

### Problem

In a nonempty integer array, every distinct value occurs exactly twice except one value that occurs once. Return the single-occurrence value. Use linear time and constant extra space.

```cpp
int singleNumber(vector<int>& nums);
```

### Examples

```text
Input: nums = [-7,4,-7,4,9]
Output: 9
```

```text
Input: nums = [0]
Output: 0
```

### Constraints

- Length is between 1 and 30000.
- Values are between -30000 and 30000, inclusive.
- Exactly one value occurs once and every other value occurs twice.
