# Count Strictly Smaller Later Occurrences for Every Position
> Google · Other · hard · Pattern: Segment Tree / Fenwick, Sorting
> Source: https://prachub.com/interview-questions/count-strictly-smaller-later-occurrences-for-every-position

### Problem

Return counts where counts[i] is the number of indices j>i with nums[j]<nums[i]. Equal later values do not count.

```cpp
vector<int> countSmaller(vector<int>& nums);
```

### Examples

```text
nums = [4,1,3,1] -> [3,0,1,0]
nums = [2,2] -> [0,0]
```

### Constraints

- Length is 1 through 100000.
- Values lie in [-10000,10000].
