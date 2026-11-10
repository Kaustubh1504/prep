# Decode Uppercase Spreadsheet Column Titles
> Google · Other · easy · Pattern: Math / Number Theory
> Source: https://prachub.com/interview-questions/decode-uppercase-spreadsheet-column-titles

### Problem

Convert an uppercase spreadsheet column title to its positive column number. Letters represent digits A=1 through Z=26: after Z comes AA=27, AB=28, and so on.

```cpp
int titleToNumber(string columnTitle);
```

### Examples

```text
Input: columnTitle = "AZ"
Output: 52
```

```text
Input: columnTitle = "AAA"
Output: 703
```

### Constraints

- Length is between 1 and 7.
- Only uppercase English letters occur.
- The title lies from A through FXSHRXW in spreadsheet column-number order, inclusive.
