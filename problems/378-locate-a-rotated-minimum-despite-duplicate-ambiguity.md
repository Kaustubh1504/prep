# Locate a Rotated Minimum despite Duplicate Ambiguity
> Google · Other · hard · Pattern: Binary Search
> Source: https://prachub.com/interview-questions/locate-a-rotated-minimum-despite-duplicate-ambiguity

### Problem

Return the minimum value in an array obtained by rotating a sorted nondecreasing array right between one and its length times. Values may repeat, and a full-length rotation may leave it sorted. Reduce unnecessary search work as much as possible while handling duplicates correctly.

```cpp
int findMin(vector<int>& nums);
```

### Examples

```text
Input: nums = [4,4,7,1,2,4]
Output: 1
```

```text
Input: nums = [5,5,5]
Output: 5
```

### Constraints

- Length is between 1 and 5000.
- Every value lies between -5000 and 5000.
- The array is a rotation of a sorted nondecreasing sequence.

### Optional follow-up

How do duplicate values affect runtime compared with the distinct-value rotated-array problem, and why?
