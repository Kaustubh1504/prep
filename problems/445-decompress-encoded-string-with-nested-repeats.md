# Decompress encoded string with nested repeats
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Stack / Parsing

## Problem
A string is compressed with the rule `k[encoded]`, meaning the content inside the brackets is repeated exactly `k` times. Encodings can be **nested** (`3[a2[c]]`) and concatenated with plain letters (`2[abc]3[cd]ef`).

### Part 1 — Decode
Given a valid encoded string `s`, return the fully decompressed string.
- `k` is a positive integer and may have several digits (e.g. `10[a]`).
- Digits appear only as repeat counts; every count is immediately followed by `[`, and brackets are balanced.
- Letters are lowercase English. Bracket contents may be empty (`2[]` contributes nothing). An empty input returns `""`.

### Part 2 — Output growth
The decoded output can be exponentially longer than the input (each nesting level multiplies it). Write `decoded_length(s)` that returns the length of the decoded string **without building it**, so callers can decide whether decoding is feasible.

## Function signature
```python
def decode_string(s: str) -> str:
    ...

def decoded_length(s: str) -> int:
    ...
```

## Constraints
- `0 <= len(s) <= 10^4`
- `1 <= k <= 300`
- For `decode_string`, the output length is guaranteed to be at most `10^6`; `decoded_length` has no such limit (use arbitrary precision / 64-bit with overflow checks in other languages)

## Examples
**Example 1**
Input: `s = "3[a2[c]]"`
Output: `"accaccacc"`
Explanation: The inner `2[c]` becomes `cc`, so the outer group is `acc`, repeated 3 times.

**Example 2**
Input: `s = "2[abc]3[cd]ef"`
Output: `"abcabccdcdcdef"`, `decoded_length(s) = 14`

**Example 3** (edge cases)
Input: `"10[a]"` → `"aaaaaaaaaa"`; `"2[]x"` → `"x"`; `""` → `""`
Explanation: Multi-digit counts must be accumulated digit by digit; empty groups contribute nothing.

**Example 4** (growth)
Input: `decoded_length("9[9[9[9[9[9[9[9[9[9[ab]]]]]]]]]]")`
Output: `6973568802`
Explanation: Only 32 input characters, but `2 · 9^10` output characters — far too many to materialise.

<details><summary>Approach (spoiler)</summary>

Scan left to right with a stack. Accumulate digits into `num`; on `[`, push the text built so far together with `num`, then start a fresh buffer; on `]`, pop `(prev, k)` and set the buffer to `prev + buffer * k`; letters append to the buffer. The stack mirrors the nesting, so each closing bracket finishes exactly the innermost open group. For the length, run the same automaton on integers: push the length so far, and on `]` compute `prev + length * k`. Decoding is linear in the output size (each output character is produced a bounded number of times per nesting level), which is why the length check matters.
**Time:** `decode_string` O(|s| + depth · |output|) worst case; `decoded_length` O(|s|) · **Space:** O(|output|) and O(depth) respectively

```python
def decode_string(s: str) -> str:
    stack = []                 # (text_before_bracket, repeat_count)
    cur: list = []
    num = 0
    for ch in s:
        if ch.isdigit():
            num = num * 10 + int(ch)
        elif ch == "[":
            stack.append(("".join(cur), num))
            cur, num = [], 0
        elif ch == "]":
            prev, k = stack.pop()
            cur = [prev + "".join(cur) * k]
        else:
            cur.append(ch)
    return "".join(cur)

def decoded_length(s: str) -> int:
    stack = []                 # (length_before_bracket, repeat_count)
    length = num = 0
    for ch in s:
        if ch.isdigit():
            num = num * 10 + int(ch)
        elif ch == "[":
            stack.append((length, num))
            length, num = 0, 0
        elif ch == "]":
            prev, k = stack.pop()
            length = prev + length * k
        else:
            length += 1
    return length
```
</details>
