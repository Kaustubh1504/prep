# Compare Dotted Revision Values with Missing Zeros
> Google · Other · medium · Pattern: String Processing, Two Pointers
> Source: https://prachub.com/interview-questions/compare-dotted-revision-values-with-missing-zeros

### Problem

Compare two valid version strings as sequences of integer revisions separated by dots. Ignore leading zeros within a revision. Compare revisions from left to right; if one version ends sooner, treat each missing revision as zero. Return -1, 0, or 1 according as `version1` is smaller, equal, or greater.

```cpp
int compareVersion(string version1, string version2);
```

### Examples

```text
Input: version1 = "2.003.0", version2 = "2.3"
Output: 0
```

```text
Input: version1 = "4.12", version2 = "4.9.99"
Output: 1
```

### Constraints

- Each string has length between 1 and 500.
- Only decimal digits and dots occur; both are valid version numbers.
- Every revision value fits in a signed 32-bit integer.
