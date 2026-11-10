# Maximize Products over Contiguous Nonempty Segments
> Google · Other · medium · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/maximize-products-over-contiguous-nonempty-segments

### Problem

Return the largest product of any nonempty contiguous subarray. A single-element subarray has that element's value. Elements cannot be skipped.

```cpp
int maxProduct(vector<int>& nums);
```

### Examples

```text
Input: nums = [-2,3,-4]
Output: 24
```

The entire subarray has product 24.

```text
Input: nums = [-3,0,-2]
Output: 0
```

The separated negative entries cannot be combined across the zero.

### Constraints

- Length is between 1 and 20000.
- Values lie between -10 and 10.
- The product of every subarray, not only the maximum, fits a signed 32-bit integer.
