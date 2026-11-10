# Reverse Only Vowel Occurrences in an ASCII String
> Google · Other · easy · Pattern: Two Pointers, String Processing
> Source: https://prachub.com/interview-questions/reverse-only-vowel-occurrences-in-an-ascii-string

### Problem

Reverse the sequence of vowels in s while leaving every nonvowel position unchanged. Vowels are a,e,i,o,u in either case; move each vowel's actual character, preserving its case.

```cpp
string reverseVowels(string s);
```

### Examples

```text
s = "a-bE" -> "E-ba"
s = "rhythm!" -> "rhythm!"
```

### Constraints

- String length is 1 through 300000.
- Characters are printable ASCII.
