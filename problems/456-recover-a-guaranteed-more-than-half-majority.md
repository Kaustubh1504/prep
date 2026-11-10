# Recover a Guaranteed More-Than-Half Majority
> Google · Other · easy · Pattern: Hashing / Counting
> Source: https://prachub.com/interview-questions/recover-a-guaranteed-more-than-half-majority

### Problem

Return the value occurring more than `floor(n/2)` times in a nonempty integer array. The input is guaranteed to contain such a majority value.

```cpp
int majorityElement(vector<int>& nums);
```

### Examples

```text
Input: nums = [5,1,5,2,5]
Output: 5
```

```text
Input: nums = [-3,-3,8,-3]
Output: -3
```

### Constraints

- Length is between 1 and 50000.
- Values lie between -1000000000 and 1000000000.
- A value occurring strictly more than half the time always exists.

### Optional follow-up

Can you solve this in linear time with `O(1)` extra space?
