# Evaluate a Lisp-Style Expression Language with let, add and mult Scoping
> Google · Other · medium · Pattern: Stack / Parsing
> Source: https://prachub.com/interview-questions/evaluate-a-lisp-style-expression-language-with-let-add-and-mult-scoping

Reported from a Google software engineering coding interview.

Write an evaluator for a tiny Lisp-like expression language. Given one valid expression as a string, return its integer value.

An expression is one of the following:

- **Integer literal**: an optional leading `-` followed by one or more digits, such as `7` or `-12`.
- **Variable**: a lowercase letter followed by zero or more lowercase letters or digits, such as `x` or `v1`. Its value comes from the nearest enclosing binding (see Rules).
- **Addition**: `(add e1 e2)` evaluates to the value of `e1` plus the value of `e2`.
- **Multiplication**: `(mult e1 e2)` evaluates to the value of `e1` times the value of `e2`.
- **Binding**: `(let v1 e1 v2 e2 ... vn en body)` with `n >= 1`. Working left to right, evaluate `e1` and bind `v1` to it, then evaluate `e2` and bind `v2` to it, and so on. The value of the whole `let` is the value of `body`. After the `let` keyword there is always an odd number of elements; the last one is the body and the others form variable-expression pairs.

### Function Signature

```python
def evaluate_lisp(expression: str) -> int:
```

### Rules

- Each `let` opens a new scope. Its bindings are visible to its own later expressions, to its body, and to everything nested inside them, but not outside the `let`.
- Inside one `let`, an expression may use variables bound earlier in the same `let`, and binding a name a second time in the same `let` replaces the earlier value from that point on.
- A variable is looked up in the innermost scope that binds it, then in the next scope outward, and so on. Every variable that is referenced is bound in some enclosing scope.
- `add`, `mult` and `let` are keywords and never appear as variable names.
- Tokens are separated by exactly one space; an opening parenthesis is immediately followed by a keyword, and a closing parenthesis directly follows the last token of its expression. There are no leading or trailing spaces.

### Constraints

- `1 <= len(expression) <= 2000`
- The expression is always valid.
- Every literal, every intermediate result and the final answer lie in the 32-bit signed range `[-2^31, 2^31 - 1]`.

### Examples

**Example 1**

- Input: `expression = "(let a 5 (add a (let a 2 b 3 (mult a b))))"`
- Output: `11`
- Explanation: the inner `let` binds `a = 2` and `b = 3`, so its body is `2 * 3 = 6`. Back in the outer scope `a` is 5, so the sum is `5 + 6 = 11`.

**Example 2**

- Input: `expression = "(let n 4 n (mult n -2) (add n 1))"`
- Output: `-7`
- Explanation: `n` is bound to 4, then rebound to `4 * -2 = -8`; the body evaluates to `-8 + 1 = -7`.

**Example 3**

- Input: `expression = "(let x 1 (add (let x 10 x) x))"`
- Output: `11`
- Explanation: the inner `let` evaluates to 10, and its binding of `x` ends with it, so the second operand of `add` sees the outer `x = 1`.
