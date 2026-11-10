# Remove Chosen Values from an Array Prefix
> Google · Other · easy · Pattern: Two Pointers
> Source: https://prachub.com/interview-questions/remove-chosen-values-from-an-array-prefix

### Problem

Given the integer array `nums` and integer `val`, remove every occurrence of `val` in place. Return the number `k` of elements whose values differ from `val`.

The first `k` positions of the modified array must contain exactly the retained occurrences, including repeated values that are not equal to `val`. Their order may change. The remaining positions and the array's eventual size are unimportant to this task.

Preserve the original interface:

```cpp
int removeElement(vector<int>& nums, int val);
```

The returned value is only the integer count. The required prefix is an observable mutation of `nums`, not an additional returned array or tuple.

### Examples

```text
Input: nums = [4,1,4,2,1], val = 4
Returned k: 3
One valid first k values: [2,1,1]
```

The prefix `[1,2,1]` is also valid. Both retain the two occurrences of `1` and the one occurrence of `2`.

```text
Input: nums = [], val = 6
Returned k: 0
Required first k values: []
```

### Constraints & Assumptions

- `0 <= nums.length <= 100`.
- Every input entry is between 0 and 50, inclusive.
- `0 <= val <= 100`.
- Modify the supplied array in place and return the retained count.
- Retained occurrences may appear in any order; they need not be sorted or keep their original relative order. Values after the retained prefix are ignored.

### Clarifying Questions to Ask

- Are repeated retained values deduplicated? No; keep each occurrence not equal to `val`.
- Is returning the correct count enough? No; the first `k` positions must also have the correct retained values.
- Must the original relative order remain? No; any order of the retained occurrences is allowed.

```hint Identify the observable part
The judge needs the count and the retained prefix. Values beyond that prefix do not have to be assigned a special marker.
```

### What a Strong Answer Covers

- In-place mutation of the retained prefix alongside the integer return value.
- Exactly the required multiplicities, with every occurrence of `val` excluded.
- Empty input, all-removed input, and a removal value absent from the array.
- A correctness argument that does not depend on one particular retained order.

### Follow-up Questions

- What implementation choices become possible because the retained order may change?
- How can a judge compare the retained occurrences without imposing an output order?
