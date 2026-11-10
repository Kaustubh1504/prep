# Recover a Signed Value among Threefold Repetitions
> Google · Other · medium · Pattern: Bit Manipulation, Math / Number Theory
> Source: https://prachub.com/interview-questions/recover-a-signed-value-among-threefold-repetitions

### Problem

Every value in `nums` appears exactly three times except one value that appears once. Return that value. Your solution must take linear time and constant extra space.

```cpp
int singleNumber(vector<int>& nums);
```

### Examples

```text
Input: nums = [6,-4,6,6]
Output: -4
```

```text
Input: nums = [0,-2147483648,0,0]
Output: -2147483648
```

### Constraints

- Length is between 1 and 30000.
- Every value fits a signed 32-bit integer, including -2147483648.
- The once/three-times frequency guarantee holds exactly.
