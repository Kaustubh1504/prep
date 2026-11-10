# Count Complete Digit-to-Letter Decodings
> Google · Other · medium · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/count-complete-digit-to-letter-decodings

### Problem

The codes `"1"` through `"26"` represent the letters A through Z. Given a digit string `s`, count how many ways its entire sequence can be divided into valid one- or two-digit codes. A code cannot begin with zero: `"6"` is valid, `"06"` is not, and `"0"` has no letter.

Return 0 if there is no complete decoding. The input cases guarantee that the final answer fits a signed 32-bit integer.

```cpp
int numDecodings(string s);
```

### Examples

```text
Input: s = "121"
Output: 3
```

The groupings are `1|2|1`, `12|1`, and `1|21`.

```text
Input: s = "100"
Output: 0
```

Neither the final zero on its own nor `00` is a valid code.

### Constraints

- `1 <= s.length <= 100`.
- `s` contains digits only and may start with zeros.
- The final number of complete decodings is at most 2147483647.
