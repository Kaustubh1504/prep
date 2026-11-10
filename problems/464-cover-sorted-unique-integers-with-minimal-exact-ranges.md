# Cover Sorted Unique Integers with Minimal Exact Ranges
> Google · Other · easy · Pattern: Intervals / Sweep Line, Sorting
> Source: https://prachub.com/interview-questions/cover-sorted-unique-integers-with-minimal-exact-ranges

### Problem

Given a sorted array of distinct integers, return the smallest sorted list of inclusive ranges covering exactly its values. No input value may be covered twice and no absent integer may be included. Format a singleton as `"a"` and a longer range as `"a->b"`.

```cpp
vector<string> summaryRanges(vector<int>& nums);
```

### Examples

```text
Input: nums = [-3,-2,0,1,2,7]
Output: ["-3->-2","0->2","7"]
```

```text
Input: nums = [-2147483648,-2147483647,2147483647]
Output: ["-2147483648->-2147483647","2147483647"]
```

### Constraints

- Length is between 0 and 20.
- Values span the full signed 32-bit range.
- All values are unique and in increasing order.
