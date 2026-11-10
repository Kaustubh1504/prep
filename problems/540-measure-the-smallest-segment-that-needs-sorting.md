# Measure the Smallest Segment that Needs Sorting
> Google · Other · medium · Pattern: Sorting
> Source: https://prachub.com/interview-questions/measure-the-smallest-segment-that-needs-sorting

### Problem

Return the minimum length of one contiguous segment whose nondecreasing sort would make all of nums nondecreasing. Return zero when nums is already sorted.

```cpp
class Solution {
public:
    int findUnsortedSubarray(vector<int>& nums);
};
```

### Examples

**Example 1:**

```text
nums = [1,5,3,4,6]
Output: 3
Explanation: Sorting [5,3,4] fixes the whole array.
```

**Example 2:**

```text
nums = [2,2,2]
Output: 0
Explanation: Equality is allowed in sorted order.
```

### Constraints

- Input length: 1..10000. Every number lies in -100000..100000.

### Clarifying Questions

Find inversion boundaries that account for distant values and recognize an already-sorted array.

```hint Read the boundary condition
Which values are smaller than something already seen from the left?
```

### Contract considerations

Find inversion boundaries that account for distant values and recognize an already-sorted array.

### Optional follow-up

Can you solve the problem in O(n) time?
