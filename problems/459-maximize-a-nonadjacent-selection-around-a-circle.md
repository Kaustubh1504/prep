# Maximize a Nonadjacent Selection around a Circle
> Google · Other · medium · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/maximize-a-nonadjacent-selection-around-a-circle

### Problem

Select nonadjacent houses to maximize the collected total when the houses form a circle. The first and last houses are neighbors, so they cannot both be selected when there is more than one house. Return the maximum total.

```cpp
int rob(vector<int>& nums);
```

### Examples

```text
Input: nums = [6,1,2,7]
Output: 8
```

Choose amounts 6 and 2, or amounts 1 and 7.

```text
Input: nums = [8]
Output: 8
```

### Constraints

- Length is between 1 and 100.
- Each amount is between 0 and 1000.
- Adjacent houses cannot both be selected.
