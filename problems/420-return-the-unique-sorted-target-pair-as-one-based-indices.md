# Return the Unique Sorted Target Pair as One-Based Indices
> Google · Other · medium · Pattern: Two Pointers
> Source: https://prachub.com/interview-questions/return-the-unique-sorted-target-pair-as-one-based-indices

### Problem

In a nondecreasing sorted array, find the unique pair of different positions whose values sum to `target`. Return the two one-based indices in increasing order. Do not reuse an element, and use only constant extra space.

```cpp
vector<int> twoSum(vector<int>& numbers, int target);
```

### Examples

```text
Input: numbers = [-4,-1,2,6,10], target = 5
Output: [2,4]
```

Values -1 and 6 make the target.

```text
Input: numbers = [3,3], target = 6
Output: [1,2]
```

Equal values can occupy distinct valid positions.

### Constraints

- Length is between 2 and 30000.
- Values and target lie between -1000 and 1000.
- The array is sorted in nondecreasing order.
- Exactly one index-pair solution exists.
