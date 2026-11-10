# Expand Recursive Key-Value Placeholders in a Template
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Graph BFS / DFS, Stack / Parsing

## Problem
You are given a template string and a dictionary `mapping` from keys to values. The template may contain placeholders of the form `%KEY%`. Expanding the template replaces every placeholder with the fully expanded value of `KEY`.

Values in `mapping` are themselves templates: a value may contain placeholders, which must be expanded recursively until no placeholders remain. All other text, in both the template and the values, is copied literally.

Use these rules:
- **Escaping:** the two-character sequence `%%` stands for one literal `%` character. Text produced by an escape is never re-parsed as part of a placeholder.
- **Placeholder syntax:** a single `%` starts a placeholder, and the next `%` closes it. The text between them is the key, which is non-empty. If a `%` that opens a placeholder has no closing `%`, raise `ValueError`.
- **Unknown key:** if a placeholder names a key that isn't in `mapping`, raise `KeyError`.
- **Cycles:** if expanding a key requires expanding that same key again (for example `A -> %B%`, `B -> %A%`, or `A -> %A%`), raise `ValueError`.
- **Efficiency:** each key's value should be expanded at most once, even if it's referenced many times, so memoize expanded values.

Return the fully expanded string.

## Function signature
```python
def expand_template(template: str, mapping: dict[str, str]) -> str:
```

## Constraints
- `0 <= len(template) <= 10^5`
- `0 <= len(mapping) <= 10^4`; the total length of all values is `<= 10^5`
- Keys are non-empty and contain no `%`
- The expanded output may be much longer than the input. Aim for time linear in input size plus output size.

## Examples
**Example 1**
Input: `template = "Hello %NAME%, welcome to %CITY%!"`, `mapping = {"NAME": "%FIRST% %LAST%", "FIRST": "Ada", "LAST": "Lovelace", "CITY": "London"}`
Output: `"Hello Ada Lovelace, welcome to London!"`
Explanation: `NAME` expands to `%FIRST% %LAST%`, which in turn expands to `Ada Lovelace`.

**Example 2** (escapes inside values)
Input: `template = "100%% sure: %A%"`, `mapping = {"A": "%B%%B%", "B": "x%%"}`
Output: `"100% sure: x%x%"`
Explanation: `B` expands to `x%`. `A` is two copies of `B`. The `%` that comes from the escape is not treated as a placeholder delimiter.

**Example 3** (error policies)
Input: `template = "%A%"`, `mapping = {"A": "%B%", "B": "%A%"}`
Output: raises `ValueError` (cycle A -> B -> A)

Input: `template = "%X%"`, `mapping = {}`
Output: raises `KeyError` (unknown key `X`)

Input: `template = "50% off"`, `mapping = {}`
Output: raises `ValueError` (the `%` is unterminated; write `50%% off` for a literal percent sign)

<details><summary>Approach (spoiler)</summary>

Treat keys as nodes in a dependency graph, with an edge `K -> J` when K's value references J. Expanding a key is a DFS over this graph with memoization. Parse a string left to right: copy literal characters, turn `%%` into `%`, and replace `%KEY%` with `resolve(KEY)`. `resolve` returns the memoized result when one exists. Otherwise it marks the key as "visiting", parses its value, then stores the result. Meeting a key that is already in the visiting set means a back edge, so there is a cycle. Each value is parsed once, so the work is linear in the input plus the output.

**Time:** O(input + output) · **Space:** O(number of keys + output)

```python
def expand_template(template, mapping):
    memo, visiting = {}, set()

    def parse(s):
        out, i, n = [], 0, len(s)
        while i < n:
            if s[i] != '%':
                out.append(s[i]); i += 1
            elif i + 1 < n and s[i + 1] == '%':
                out.append('%'); i += 2
            else:
                j = s.find('%', i + 1)
                if j == -1:
                    raise ValueError(f"unterminated placeholder at index {i}")
                out.append(resolve(s[i + 1:j]))
                i = j + 1
        return ''.join(out)

    def resolve(key):
        if key in memo:
            return memo[key]
        if key not in mapping:
            raise KeyError(key)
        if key in visiting:
            raise ValueError(f"cycle detected at key {key}")
        visiting.add(key)
        memo[key] = parse(mapping[key])
        visiting.remove(key)
        return memo[key]

    return parse(template)
```
</details>
