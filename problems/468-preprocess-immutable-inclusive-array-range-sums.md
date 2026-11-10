# Preprocess Immutable Inclusive Array Range Sums
> Google · Other · easy · Pattern: Prefix Sum, Design / Data Structure
> Source: https://prachub.com/interview-questions/preprocess-immutable-inclusive-array-range-sums

### Problem

Implement `NumArray(vector<int>& nums)` and sumRange(left,right). The array remains unchanged after construction; each query returns the sum over the zero-based inclusive interval left..right. Preserve the stateful constructor/query API.

```cpp
class NumArray {
public:
    NumArray(vector<int>& nums);
    int sumRange(int left, int right);
};
```

### Examples

```text
NumArray([4,-2,7]); sumRange(0,1) -> 2; sumRange(1,2) -> 5
NumArray([-5]); sumRange(0,0) -> -5
```

### Constraints

- Length is 1 through 10000; values lie in [-100000,100000].
- 0 <= left <= right < length.
- At most 10000 sumRange calls occur.
