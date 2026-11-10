# Build the Shortest Palindrome by Prepending Only
> Google · Other · hard · Pattern: Two Pointers
> Source: https://prachub.com/interview-questions/build-the-shortest-palindrome-by-prepending-only

### Problem

Add characters only in front of s to make it a palindrome. Return the shortest resulting palindrome. Preserve all existing characters and their order; appending at the end or inserting inside s is not allowed.

```cpp
string shortestPalindrome(string s);
```

### Examples

```text
Input: s = "abb"
Output: "bbabb"
```

```text
Input: s = "race"
Output: "ecarace"
```

### Constraints

- Length is between 0 and 50000.
- Only lowercase English letters occur.
