# Find the Longest Balanced Binary Segment
> Google · Other · medium · Pattern: Prefix Sum, Hashing / Counting
> Source: https://prachub.com/interview-questions/find-the-longest-balanced-binary-segment

### Problem

Return the greatest length of a contiguous subarray of nums containing equally many zeros and ones. Return zero if none exists.

```cpp
class Solution {
public:
    int findMaxLength(vector<int>& nums);
};
```

### Examples

**Example 1:**

```text
nums = [1,0,0,1,1,0]
Output: 6
Explanation: The whole array contains three of each value.
```

**Example 2:**

```text
nums = [1,1,1]
Output: 0
Explanation: Every nonempty segment has more ones than zeros.
```

### Constraints

- The array contains 1..100000 entries, each either zero or one.

### Clarifying Questions

Explain why matching prefix balances imply equal counts and why the earliest occurrence is retained.

```hint Read the boundary condition
Can equal zero and one counts be converted into a zero-sum condition?
```

### Contract considerations

Explain why matching prefix balances imply equal counts and why the earliest occurrence is retained.
