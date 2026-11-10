# Compact a Sorted Array into Its Distinct Prefix
> Google · Other · easy · Pattern: Two Pointers
> Source: https://prachub.com/interview-questions/compact-a-sorted-array-into-its-distinct-prefix

### Problem

The integer array `nums` is sorted in nondecreasing order. Modify it in place so that each distinct value appears once in the beginning of the same array, retaining the original relative order. Return the number `k` of distinct values.

After the call, `nums[0]` through `nums[k - 1]` must contain those values in sorted order. Positions after this prefix are ignored. Return only the integer `k`; the required prefix is an observable change to the argument, not a replacement array returned by the function.

Preserve the original interface:

```cpp
int removeDuplicates(vector<int>& nums);
```

### Examples

```text
Input: nums = [-4,-4,-1,2,2,2,7]
Returned k: 4
Required first k values: [-4,-1,2,7]
```

The values left after the first four positions do not affect correctness.

```text
Input: nums = [6,6,6]
Returned k: 1
Required first k values: [6]
```

### Constraints

- `1 <= nums.length <= 30000`.
- Every input value is between -100 and 100, inclusive.
- The input is already sorted in nondecreasing order.
- The change is in place; the retained prefix preserves the distinct values' original order.
