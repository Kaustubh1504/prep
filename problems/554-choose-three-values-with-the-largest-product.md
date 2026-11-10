# Choose Three Values with the Largest Product
> Google · Other · easy · Pattern: Design / Data Structure
> Source: https://prachub.com/interview-questions/choose-three-values-with-the-largest-product

### Problem

Select three distinct array positions in nums and return the largest product of their values. Values may be negative, positive or zero.

```cpp
class Solution {
public:
    int maximumProduct(vector<int>& nums);
};
```

### Examples

**Example 1:**

```text
nums = [-10,-9,2,3]
Output: 270
Explanation: (-10)*(-9)*3 beats the three largest values.
```

**Example 2:**

```text
nums = [-5,-4,-2,-1]
Output: -8
Explanation: The three values closest to zero give (-4)*(-2)*(-1).
```

### Constraints

- There are 3..10000 input numbers, each in -1000..1000.

### Clarifying Questions

Consider two negative factors as well as the three largest values.

```hint Read the boundary condition
When can very negative numbers improve a product?
```

### Contract considerations

Consider two negative factors as well as the three largest values.
