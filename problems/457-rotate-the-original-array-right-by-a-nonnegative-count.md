# Rotate the Original Array Right by a Nonnegative Count
> Google · Other · medium · Pattern: Two Pointers
> Source: https://prachub.com/interview-questions/rotate-the-original-array-right-by-a-nonnegative-count

### Problem

Rotate the original integer array to the right by k positions, where k is nonnegative. Elements wrapping past the end reappear at the beginning in the same circular order.

```cpp
void rotate(vector<int>& nums, int k);
```

Modify nums; return nothing.

### Examples

```text
Input: nums = [2,4,6,8,10], k = 2
Array after call: [8,10,2,4,6]
```

```text
Input: nums = [-3,0,7], k = 7
Array after call: [7,-3,0]
```

### Constraints

- Array length is between 1 and 100000.
- Entries span the full signed 32-bit range.
- `0 <= k <= 100000`.

### Optional follow-up

Describe at least three approaches, and include an in-place `O(1)` extra-space solution.
