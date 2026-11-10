# Merge Sorted Values into an Existing Array Buffer
> Google · Other · easy · Pattern: Two Pointers
> Source: https://prachub.com/interview-questions/merge-sorted-values-into-an-existing-array-buffer

### Problem

Merge two sorted integer sequences into `nums1`. Its first `m` positions contain its actual sequence, followed by `n` zero-filled spare positions. The array `nums2` contains `n` actual entries. Both actual sequences are sorted in nondecreasing order.

After the call, all `m+n` positions of `nums1` must contain the sorted merge, including every occurrence from both sequences. Its spare zeros are capacity, not input values. Return no replacement array.

```cpp
void merge(vector<int>& nums1, int m, vector<int>& nums2, int n);
```

### Examples

```text
Input: nums1 = [-4,2,9,0,0], m = 3, nums2 = [-1,2], n = 2
nums1 after call: [-4,-1,2,2,9]
```

```text
Input: nums1 = [0,0], m = 0, nums2 = [-2,5], n = 2
nums1 after call: [-2,5]
```

### Constraints

- `nums1.length == m+n` and `nums2.length == n`.
- `0 <= m,n <= 200` and `1 <= m+n <= 200`.
- Actual entries are between -1000000000 and 1000000000, inclusive.
- Only the first `m` entries of the initial `nums1` participate as data; initial spare entries are zero.

### Source follow-up

Can the merge run in `O(m+n)` time?
