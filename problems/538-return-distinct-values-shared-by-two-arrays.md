# Return Distinct Values Shared by Two Arrays
> Google · Other · easy · Pattern: Hashing / Counting
> Source: https://prachub.com/interview-questions/return-distinct-values-shared-by-two-arrays

### Problem

Return every value that appears in both nums1 and nums2, exactly once. The source accepts any output order.

```cpp
vector<int> intersection(vector<int>& nums1, vector<int>& nums2);
```

### Examples

```text
nums1=[3,3,5,7], nums2=[7,3,7] -> [3,7]
nums1=[1], nums2=[2] -> []
```

### Constraints

- Each length is 1 through 1000.
- Values lie in [0,1000].

### Follow-up Questions

Explain how the permitted output freedom is preserved without losing required values or occurrences.

### What a Strong Answer Covers

Mark presence in the first array and clear a mark when it is emitted during a scan of the second. Explain why every produced result satisfies the source contract and why no required result is omitted.
