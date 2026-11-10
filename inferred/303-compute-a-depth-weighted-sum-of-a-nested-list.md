# Compute a Depth-Weighted Sum of a Nested List
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Stack / Parsing

## Problem
You get a nested list whose elements are integers or further nested lists, nested to uneven depths. An integer's **depth** is the number of lists that enclose it, so the elements of the outermost list are at depth 1. Return the sum of `value × depth` over every integer.

Requirements:
- Empty lists, including empty lists nested inside other lists, contribute 0.
- Integers can be negative.
- Nesting can be very deep, for example 10^5 levels. A naive recursive solution would overflow the call stack (Python's default recursion limit is about 1000), so give an **iterative** solution and compare it with the recursive one.

**Part 2 (variant from the community answers):** the same structure arrives as a string, such as `"[1,[-4,[6]]]"`, which may contain spaces and negative numbers. Compute the same sum in one pass, without building the nested structure.

## Function signature
```python
def depth_sum(nested: list) -> int: ...

def depth_sum_from_string(s: str) -> int: ...
```

## Constraints
- Up to `10^5` integers and lists in total, and nesting depth up to `10^5`
- `-10^4 <= value <= 10^4`
- The string in Part 2 is a well-formed list literal of length up to `10^6`

## Examples
**Example 1**
Input: `[[1,1],2,[1,1]]`
Output: `10`
Explanation: Four 1s at depth 2 give 8, and the 2 at depth 1 gives 2.

**Example 2**
Input: `[1,[4,[6]]]`
Output: `27`
Explanation: 1·1 + 4·2 + 6·3 = 27.

**Example 3** (an edge case: negative values)
Input: `[-3,[2,[-1]]]`
Output: `-2`
Explanation: -3 + 4 - 3 = -2.

**Example 4** (edge cases: empty lists)
`[]` gives `0`, and `[[],[[]]]` gives `0`.

**Example 5** (an edge case: deep nesting)
Input: `5` wrapped in 100,001 lists, `[[[...[5]...]]]`
Output: `500005`

**Part 2**
- `depth_sum_from_string("[ -3, [2, [-1]] ]")` returns `-2`
- `depth_sum_from_string("[[10]]")` returns `20`, which shows that multi-digit numbers are parsed as a whole
- `depth_sum_from_string("[" * 100000 + "7" + "]" * 100000)` returns `700000`

<details><summary>Approach (spoiler)</summary>

The recursive version visits each list with `depth + 1`. It is simple, but its stack depth equals the nesting depth. The iterative version keeps an explicit stack of `(sublist, depth)` pairs. Pop a pair, add `x * depth` for each integer `x`, and push each child list with `depth + 1`. The order of visits doesn't matter, because addition is commutative. For the string variant, scan once while keeping a depth counter that goes up at `[` and down at `]`. Read a whole number (including a leading `-`) and add `number * depth`.
**Time:** O(total elements) or O(len(s)) · **Space:** O(depth) for the list stack, O(1) for the string scan

```python
# Part 1: nested Python lists, iterative (no recursion-depth limit)
def depth_sum(nested: list) -> int:
    total = 0
    stack = [(nested, 1)]                 # (list, depth of its elements)
    while stack:
        lst, d = stack.pop()
        for x in lst:
            if isinstance(x, list):
                stack.append((x, d + 1))
            else:
                total += x * d
    return total

# Part 2: the same structure given as text, e.g. "[1,[-4,[6]]]"
def depth_sum_from_string(s: str) -> int:
    total, depth, i, n = 0, 0, 0, len(s)
    while i < n:
        c = s[i]
        if c == "[":
            depth += 1; i += 1
        elif c == "]":
            depth -= 1; i += 1
        elif c == "-" or c.isdigit():
            j = i + 1
            while j < n and s[j].isdigit():
                j += 1
            total += int(s[i:j]) * depth
            i = j
        else:                             # commas / whitespace
            i += 1
    return total
```
</details>
