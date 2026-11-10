# Write an Integer Using Base Seven Digits
> Google · Other · easy · Pattern: Math / Number Theory
> Source: https://prachub.com/interview-questions/write-an-integer-using-base-seven-digits

### Problem

Return the base-seven string for num, using digits 0 through 6 and a leading minus sign only for negative values. Zero is represented by "0".

```cpp
class Solution {
public:
    string convertToBase7(int num);
};
```

### Examples

**Example 1:**

```text
num = 50
Output: "101"
Explanation: 50 = 1*49 + 0*7 + 1.
```

**Example 2:**

```text
num = -15
Output: "-21"
Explanation: 15 = 2*7 + 1.
```

### Constraints

- Input num ranges from -10000000 through 10000000, inclusive.

### Clarifying Questions

Preserve the sign and ensure every output digit is in the base-seven alphabet.

```hint Read the boundary condition
What does the remainder of division by seven tell you about the last digit?
```

### Contract considerations

Preserve the sign and ensure every output digit is in the base-seven alphabet.
