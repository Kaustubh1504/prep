# Evaluate Postfix Arithmetic with Truncating Integer Division
> Google · Other · medium · Pattern: Stack / Parsing
> Source: https://prachub.com/interview-questions/evaluate-postfix-arithmetic-with-truncating-integer-division

### Problem

Evaluate a valid arithmetic expression written in reverse Polish notation. Tokens are integer operands or the binary operators `+`, `-`, `*`, and `/`. Division truncates toward zero, and no division by zero occurs. Return the resulting integer.

```cpp
int evalRPN(vector<string>& tokens);
```

### Examples

```text
Input: tokens = ["8","3","-","2","*"]
Output: 10
```

```text
Input: tokens = ["-7","3","/"]
Output: -2
```

### Constraints

- There are between 1 and 10000 tokens.
- Numeric tokens represent integers between -200 and 200.
- The expression is valid, and its answer and every intermediate calculation fit signed 32-bit integers.
