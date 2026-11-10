# Detect Equal Values within an Index Radius
> Google · Other · easy · Pattern: Sliding Window, Two Pointers
> Source: https://prachub.com/interview-questions/detect-equal-values-within-an-index-radius

### Problem

Return whether two different array positions hold equal values and are at most k indices apart. Both value equality and the index-distance bound must hold.

```cpp
bool containsNearbyDuplicate(vector<int>& nums, int k);
```

### Examples

```text
Input: nums = [3,8,3], k = 2
Output: true
```

```text
Input: nums = [3,8,3], k = 1
Output: false
```

### Constraints

- Length is between 1 and 100000.
- Values lie between -1000000000 and 1000000000.
- `0 <= k <= 100000`.
