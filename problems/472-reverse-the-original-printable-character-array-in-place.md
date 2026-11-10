# Reverse the Original Printable-Character Array In Place
> Google · Other · easy · Pattern: Two Pointers
> Source: https://prachub.com/interview-questions/reverse-the-original-printable-character-array-in-place

### Problem

Reverse s by modifying its original character array in place, using O(1) extra memory. The function returns void. Preserve every printable ASCII character exactly, including spaces and punctuation.

```cpp
void reverseString(vector<char>& s);
```

### Examples

```text
s = ["a","!","B"," "] -> [" ","B","!","a"]
s = ["x"] -> ["x"]
```

### Constraints

- Array length is 1 through 100000.
- Every entry is a printable ASCII character.
