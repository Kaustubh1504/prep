# Count Distinct Value Pairs with a Fixed Gap
> Google · Other · medium · Pattern: Hashing / Counting, Two Pointers
> Source: https://prachub.com/interview-questions/count-distinct-value-pairs-with-a-fixed-gap

### Problem

Return the number of distinct unordered value pairs in nums whose absolute difference is k. The two occurrences used by a pair must have different indices; repeated copies of the same value pair are counted only once.

```cpp
class Solution {
public:
    int findPairs(vector<int>& nums, int k);
};
```

### Examples

**Example 1:**

```text
nums = [0,2,2,4,6], k = 2
Output: 3
Explanation: The distinct pairs are (0,2), (2,4), (4,6).
```

**Example 2:**

```text
nums = [5,5,5,7], k = 0
Output: 1
Explanation: Only (5,5) has two distinct occurrences.
```

### Constraints

- Array size: 1..10000. Values: -10000000..10000000. Required gap k: 0..10000000.

### Clarifying Questions

Separate the k=0 duplicate-occurrence requirement from positive gaps and count unique value pairs.

```hint Read the boundary condition
For a positive gap, which member can uniquely identify an unordered pair?
```

### Contract considerations

Separate the k=0 duplicate-occurrence requirement from positive gaps and count unique value pairs.
