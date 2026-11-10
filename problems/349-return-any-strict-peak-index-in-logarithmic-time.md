# Return Any Strict Peak Index in Logarithmic Time
> Google · Other · medium · Pattern: Binary Search
> Source: https://prachub.com/interview-questions/return-any-strict-peak-index-in-logarithmic-time

### Problem

Find any peak in a zero-indexed array and return its index. A peak is strictly greater than each adjacent in-bounds value. Treat the conceptual values beyond either end as negative infinity, so an endpoint can be a peak. If there are several peaks, any one is valid. Use `O(log n)` time.

```cpp
int findPeakElement(vector<int>& nums);
```

### Examples

```text
Input: nums = [2,7,3,8,4]
Valid output: 1
```

Index 3 is also valid; no leftmost or largest-peak rule is imposed.

```text
Input: nums = [-2147483648]
Output: 0
```

### Constraints & Assumptions

- Length is between 1 and 1000.
- Every value fits signed 32-bit range.
- Adjacent entries are unequal.

### What a Strong Answer Covers

- A valid strict local peak, including endpoint cases and multiple valid choices.
- A logarithmic search invariant using the unequal-neighbor guarantee.
- Boundary handling without an overflowing finite negative-infinity sentinel.

### Follow-up Questions

- Why is a singleton peak even at the minimum signed integer value?
- What choices are accepted when several local peaks exist?
