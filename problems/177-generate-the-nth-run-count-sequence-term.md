# Generate the nth Run-Count Sequence Term
> Google · Other · medium · Pattern: String Processing, Simulation
> Source: https://prachub.com/interview-questions/generate-the-nth-run-count-sequence-term

### Problem

A sequence of digit strings begins with `"1"`. Construct each later term by describing the consecutive runs in the preceding term:

- Split the preceding string into maximal runs of identical digits, keeping their left-to-right order.
- For each run, write its length in decimal, immediately followed by the digit in that run.
- Join those descriptions to form the next term.

For instance, applying this transformation to `"444116"` produces `"342116"`: three `4`s, two `1`s, and one `6`.

Given the positive integer `term`, return that numbered sequence element as a string. Numbering starts at `1`, so the first element is `"1"`.

### Examples

**Example 1**

```text
Input: term = 5
Output: "111221"
```

The fourth element is `"1211"`. Its runs describe one `1`, one `2`, and two `1`s, producing the fifth element.

**Example 2**

```text
Input: term = 6
Output: "312211"
```

The fifth element, `"111221"`, has three `1`s, two `2`s, and one `1`.

### Constraints

- `1 <= term <= 30`

### Optional Follow-up

Can you generate the requested term with an iterative implementation?
