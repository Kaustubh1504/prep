# Enumerate Telephone-Keypad Letter Choices
> Google · Other · medium · Pattern: Backtracking
> Source: https://prachub.com/interview-questions/enumerate-telephone-keypad-letter-choices

### Problem

The string `keys` contains telephone-keypad digits. Return every letter string obtained by choosing one mapped letter for each digit, preserving the order of the digits. The returned collection may be in any order.

Use this mapping:

| Digit | Letters |
| --- | --- |
| `2` | `abc` |
| `3` | `def` |
| `4` | `ghi` |
| `5` | `jkl` |
| `6` | `mno` |
| `7` | `pqrs` |
| `8` | `tuv` |
| `9` | `wxyz` |

### Examples

**Example 1**

```text
Input: keys = "58"
Output: ["jt", "ju", "jv", "kt", "ku", "kv", "lt", "lu", "lv"]
```

Each answer chooses a letter for `5` followed by a letter for `8`.

**Example 2**

```text
Input: keys = "7"
Output: ["s", "p", "r", "q"]
```

All four mapped letters are required. Their listing order is unrestricted.

### Constraints & Assumptions

- `1 <= keys.length <= 4`
- Every character of `keys` is a digit from `2` through `9`.
- Each result has exactly one letter per input digit, in the corresponding positions.
- Return the complete collection without repeating a letter string. No collection order or particular algorithm is required.
- Empty input and digits `0` or `1` are outside this input domain; no behavior for them is requested.

### Clarifying Questions to Ask

- May letters from two digit positions be swapped? No; each letter must correspond to its digit's position.
- Do repeated digits represent separate choices? Yes. Each occurrence contributes its own letter position.

```hint Check the number of choices
Some keys have three letters and some have four. The complete result must include every permitted combination of these choices.
```

### What a Strong Answer Covers

- A complete enumeration using the stated mapping and exactly one choice at each position.
- A reason that no valid string is missed or repeated, including when digits repeat.
- Correct handling of the four-letter keys and the smallest and largest permitted input lengths.
- Output-sensitive time and space bounds that account for copying the returned strings.

### Follow-up Questions

- How would building the collection iteratively change the temporary storage compared with constructing one unfinished string at a time?
