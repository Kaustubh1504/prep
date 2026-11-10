# Compare Normalized ASCII Phrase Symmetry
> Google · Other · easy · Pattern: Two Pointers
> Source: https://prachub.com/interview-questions/compare-normalized-ascii-phrase-symmetry

### Problem

Check whether a string reads the same backward after removing every non-alphanumeric character and treating uppercase letters as lowercase. Alphanumeric means English letters and decimal digits. If filtering leaves no characters, the result is a palindrome.

```cpp
bool isPalindrome(string s);
```

### Examples

```text
Input: s = "No 'x' in Nixon!"
Output: true
```

Its normalized form is `noxinnixon`.

```text
Input: s = "0P"
Output: false
```

Digits are retained; `0p` is not symmetric.

### Constraints

- The length is between 1 and 200000.
- Every character is printable ASCII.
