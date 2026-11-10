# Find the Largest Supported Citation Threshold
> Google · Other · medium · Pattern: Sorting
> Source: https://prachub.com/interview-questions/find-the-largest-supported-citation-threshold

### Problem

Return the largest integer h for which at least h papers each have at least h citations. citations contains one nonnegative count per paper.

```cpp
int hIndex(vector<int>& citations);
```

### Examples

```text
citations = [4,0,4,2,1] -> 2
citations = [0,0] -> 0
```

### Constraints

- There are 1 through 5000 papers.
- Each citation count is in [0,1000].
