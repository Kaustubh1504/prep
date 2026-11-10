# Solve Two Coding Interview Problems
> Google · Onsite · medium · Pattern: Stack / Parsing
> Source: https://prachub.com/interview-questions/solve-two-coding-interview-problems

You are asked to solve two independent coding problems.

### Problem 1: Evaluate Nested Math Expressions

Implement a function that evaluates a string expression containing nested function-style arithmetic calls.

Supported operations:
- `add(a, b)`: returns `a + b`
- `sub(a, b)`: returns `a - b`

Operands may be integers or nested expressions. Whitespace may appear anywhere and should be ignored.

Examples:
```text
Input:  "add(1, sub(1, 0))"
Output: 2

Input:  "sub(add(3, 4), sub(10, 6))"
Output: 3
```

Requirements:
- Parse and evaluate the expression correctly.
- Support nested expressions of arbitrary depth within reasonable stack limits.
- Handle multi-digit and negative integers if they appear.

### Problem 2: Compute Maximum Chain Reaction

You are given a list of bombs. Each bomb is represented as `[x, y, r]`, where `(x, y)` is its position on a 2D plane and `r` is its blast radius.

If bomb `i` explodes, it will trigger bomb `j` if the Euclidean distance between their centers is less than or equal to `i`'s radius. Triggered bombs explode immediately and may trigger more bombs.

Return the maximum number of bombs that can explode if you choose exactly one bomb to detonate initially.

Example:
```text
Input: bombs = [[0,0,2], [2,0,2], [5,0,1]]
Output: 2
Explanation: Detonating bomb 0 triggers bomb 1, but neither bomb can trigger bomb 2.
```

Requirements:
- Model the chain reactions correctly.
- Avoid floating-point precision issues when comparing distances.
- Return the largest number of bombs reachable from any starting bomb.

<details><summary>Hints (spoiler)</summary>

1. Think of the expression as a simple grammar: an expression is either an integer or an operator followed by two expressions inside parentheses.
2. Use a shared index while parsing so each character is processed only once.
</details>
