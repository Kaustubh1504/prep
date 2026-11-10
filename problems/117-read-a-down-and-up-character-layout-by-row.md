# Read a Down-and-Up Character Layout by Row
> Google · Other · medium · Pattern: String Processing, Simulation
> Source: https://prachub.com/interview-questions/read-a-down-and-up-character-layout-by-row

### Problem

Convert the string `text` by placing its characters into `rowCount` rows. Start at the top row, travel down one row for each successive character, then travel upward after reaching the bottom. Continue reversing direction at the top and bottom until every character has been placed.

Return the characters read across row `0`, then row `1`, and so on. Within a row, preserve the order in which its characters were placed. The displayed shape supplies no extra characters: do not insert padding spaces into the result.

With one row, the output equals the input. When the row count is at least the string length, reading the used rows also gives the original input.

The original callable is `convert`, taking a string and a positive row count and returning a string.

### Examples

**Example 1**

```text
Input: text = "ABCDEFG", rowCount = 3
Output: "AEBDFCG"
```

The row contents are `"AE"`, `"BDF"`, and `"CG"`, read in that order.

**Example 2**

```text
Input: text = "A,b.C", rowCount = 2
Output: "AbC,."
```

The two row contents are `"AbC"` and `",."`. Commas, periods, and letter case are preserved.

### Constraints

- The string length is between `1` and `1000`.
- Characters are uppercase or lowercase English letters, commas, or periods.
- `1 <= rowCount <= 1000`.
