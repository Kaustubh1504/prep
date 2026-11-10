# Detect a Bounded-Index Pair with Near-Equal Values
> Google · Other · hard · Pattern: Sliding Window
> Source: https://prachub.com/interview-questions/detect-a-bounded-index-pair-with-near-equal-values

### Problem

Return whether there are distinct indices i,j satisfying both `abs(i-j) <= indexDiff` and `abs(nums[i]-nums[j]) <= valueDiff`. Either equality or near equality of values is allowed within the stated tolerance.

```cpp
bool containsNearbyAlmostDuplicate(vector<int>& nums, int indexDiff, int valueDiff);
```

### Examples

```text
Input: nums = [4,1,8,5], indexDiff = 3, valueDiff = 1
Output: true
```

Positions 0 and 3 qualify.

```text
Input: nums = [-5,0,5], indexDiff = 1, valueDiff = 4
Output: false
```

### Constraints

- Length is between 2 and 100000.
- Values lie between -1000000000 and 1000000000.
- `1 <= indexDiff <= nums.length`.
- `0 <= valueDiff <= 1000000000`.
