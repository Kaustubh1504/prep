# Count Position Matches and Remaining Digit Matches
> Google · Other · medium · Pattern: Hashing / Counting
> Source: https://prachub.com/interview-questions/count-position-matches-and-remaining-digit-matches

### Problem

Return a Bulls and Cows hint for secret and guess. Bulls are equal digits at equal positions. Cows are the remaining guess digits that can match remaining secret digits after rearrangement. Match each occurrence at most once. Format the result exactly as "xAyB".

```cpp
string getHint(string secret, string guess);
```

### Examples

```text
secret="1234", guess="1243" -> "2A2B"
secret="1100", guess="1011" -> "1A2B"
```

### Constraints

- Both digit strings have equal length in [1,1000].
- Duplicate decimal digits are allowed.
