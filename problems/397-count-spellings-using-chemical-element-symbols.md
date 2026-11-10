# Count Spellings Using Chemical Element Symbols
> Google · Onsite · medium · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/count-spellings-using-chemical-element-symbols

# Count Spellings Using Chemical Element Symbols

## Problem

Given a list of valid chemical element symbols and a target word, count how many distinct ways the entire word can be segmented into symbols. Matching is case-insensitive, symbols may be reused, and different boundary placements count as different spellings.

Implement:

```python
def count_symbol_spellings(symbols: list[str], word: str) -> int:
    ...
```

The input symbol list is the complete source of truth; the function must not rely on a built-in periodic table.

## Constraints

- `1 <= len(symbols) <= 200`
- Every symbol contains one or two ASCII letters.
- Symbols are unique under case-insensitive comparison.
- `0 <= len(word) <= 100_000`
- `word` contains only ASCII letters.
- Return an arbitrary-precision integer.
- The empty word has one valid spelling: choose no symbols.

## Example

```python
symbols = ["P", "H", "Y", "Si", "C", "S", "Cs", "I"]
count_symbol_spellings(symbols, "Physics")
```

The result is `4`, corresponding to these boundary choices:

```text
P-H-Y-Si-C-S
P-H-Y-Si-Cs
P-H-Y-S-I-C-S
P-H-Y-S-I-Cs
```

## Performance Goal

Avoid enumerating and storing every complete spelling. State the time and auxiliary-space complexity of your approach.

<details><summary>Hints (spoiler)</summary>

1. Dynamic programming needs only the counts one and two positions back.
2. Normalize both symbols and word to one case once.
</details>

<details><summary>Approach (spoiler)</summary>

Let dp[i] count spellings of the first i letters. Add dp[i-1] when the final one-letter slice is a symbol and dp[i-2] when the final two-letter slice is a symbol. Only two prior values are needed.

**Time:** O(number of symbols + word length) expected · **Space:** O(number of symbols)
</details>
