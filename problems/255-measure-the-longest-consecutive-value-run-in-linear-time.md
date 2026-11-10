# Measure the Longest Consecutive Value Run in Linear Time
> Google · Other · medium · Pattern: Hashing / Counting
> Source: https://prachub.com/interview-questions/measure-the-longest-consecutive-value-run-in-linear-time

### Problem

Return the length of the longest run of consecutive integer values present in an unsorted array. The values need not be adjacent in the input. Repeated copies of a value do not extend a run. Your algorithm must run in `O(n)` time.

```cpp
int longestConsecutive(vector<int>& nums);
```

### Examples

```text
Input: nums = [12,4,9,6,5,4,7]
Output: 4
```

The run is 4,5,6,7.

```text
Input: nums = []
Output: 0
```

### Constraints

- The length is between 0 and 100000.
- Each value lies between -1000000000 and 1000000000, inclusive.
