# Select the K Closest Sorted Values with Smaller-Value Ties
> Google · Other · medium · Pattern: Binary Search, Two Pointers
> Source: https://prachub.com/interview-questions/select-the-k-closest-sorted-values-with-smaller-value-ties

### Problem

From sorted arr return the k values closest to x, retaining repeated occurrences and sorting the output ascending. Compare absolute distance first; when distances tie, prefer the smaller value.

```cpp
class Solution {
public:
    vector<int> findClosestElements(vector<int>& arr, int k, int x);
};
```

### Examples

**Example 1:**

```text
arr = [0,2,4,6,8], k = 3, x = 5
Output: [2,4,6]
Explanation: Two and eight tie at distance three, so prefer two.
```

**Example 2:**

```text
arr = [1,1,3,7], k = 2, x = -2
Output: [1,1]
Explanation: Both occurrences of one are selected.
```

### Constraints

- The array is sorted ascending and has 1..10000 entries; repeats are allowed by the source examples. Requested k is in 1..arr.length. Both array values and x are in -10000..10000.

### Clarifying Questions

Apply the smaller-value tie-break and return values ascending with their multiplicities.

```hint Read the boundary condition
When too many candidates remain, which extreme is safe to discard?
```

### Contract considerations

Apply the smaller-value tie-break and return values ascending with their multiplicities.
