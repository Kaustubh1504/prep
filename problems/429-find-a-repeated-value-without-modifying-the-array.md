# Find a Repeated Value without Modifying the Array
> Google · Other · medium · Pattern: Two Pointers, Binary Search
> Source: https://prachub.com/interview-questions/find-a-repeated-value-without-modifying-the-array

### Problem

nums has n+1 entries drawn from 1..n. Precisely one value occurs more than once; it may occur more than twice. Return that value without changing nums and using O(1) extra space.

```cpp
int findDuplicate(vector<int>& nums);
```

### Examples

```text
nums = [2,5,1,4,3,5] -> 5
nums = [2,2,2] -> 2
```

### Constraints

- 1 <= n <= 100000.
- Length is n+1; every entry is in [1,n].
- Only one distinct value is repeated.

### Optional follow-up

Explain why a duplicate must exist and give a linear-time solution.
