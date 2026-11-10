# Implement Employee Management and Expression Evaluation
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Stack / Parsing

## Problem
This onsite has two independent parts: maintaining a reporting hierarchy, and evaluating nested function-call arithmetic. The original input format isn't known (the community comments complain about it), so the format below is the most natural interpretation.

### Part 1 — Org chart
Design an `OrgChart` built with a CEO ID. It must keep the invariant that every employee except the CEO has exactly one manager, and the reporting relation forms a tree.
- `add_employee(emp, manager)`: add `emp` reporting to `manager`. Return `False` without changing anything if `emp` already exists or `manager` doesn't exist. Otherwise return `True`.
- `remove_employee(emp)`: remove `emp`, and make each of `emp`'s direct reports report to `emp`'s manager instead. The CEO can't be removed. Return `False` if the removal is impossible.
- `direct_reports(emp)`: the IDs of `emp`'s direct reports, sorted lexicographically, or `[]` for an unknown employee.
- `chain_of_command(emp)`: the list `[emp, manager, manager's manager, ..., CEO]`, or `[]` for an unknown employee.

### Part 2 — Function-style expression evaluator
Evaluate a string such as `"add(1, mul(2, 3))"`. The grammar is:
`expr := INT | NAME "(" [expr ("," expr)*] ")"`. Integers may be negative, and arbitrary whitespace may appear.
- `add(...)` and `mul(...)` take any number of arguments, including none. `add()` is `0` and `mul()` is `1`.
- `sub(a, b)` is `a - b`. `div(a, b)` is integer division **truncated toward zero**, and it raises an error when `b == 0`.

Expressions can be nested very deeply, so the evaluator must not rely on recursion.

## Function signature
```python
# Part 1
class OrgChart:
    def __init__(self, ceo: str) -> None: ...
    def add_employee(self, emp: str, manager: str) -> bool: ...
    def remove_employee(self, emp: str) -> bool: ...
    def direct_reports(self, emp: str) -> list[str]: ...
    def chain_of_command(self, emp: str) -> list[str]: ...

# Part 2
def evaluate(expr: str) -> int: ...
```

## Constraints
- Part 1: up to `10^5` operations. `add`, `remove` (proportional to the number of reports moved) and `direct_reports` (proportional to the output) should be fast. `chain_of_command` takes O(depth).
- Part 2: `1 <= len(expr) <= 10^6`, nesting depth up to `10^5`, and the input is well-formed

## Examples
**Part 1**
```
o = OrgChart("ceo")
o.add_employee("ann","ceo"), o.add_employee("bob","ann"), o.add_employee("cat","ann"), o.add_employee("dan","bob")
                                     -> True, True, True, True
o.add_employee("bob","ceo")          -> False      # bob already exists
o.add_employee("eve","zed")          -> False      # unknown manager
o.direct_reports("ann")              -> ["bob", "cat"]
o.chain_of_command("dan")            -> ["dan", "bob", "ann", "ceo"]
o.remove_employee("ann")             -> True
o.direct_reports("ceo")              -> ["bob", "cat"]   # ann's reports moved up
o.chain_of_command("dan")            -> ["dan", "bob", "ceo"]
o.remove_employee("ceo")             -> False
o.remove_employee("ann")             -> False      # already gone
o.chain_of_command("ann")            -> []
```

**Part 2**
- `evaluate("add(1, mul(2, 3))")` returns `7`
- `evaluate("sub(10, div(7, 2))")` returns `7`
- `evaluate("mul(add(1,2,3), sub(0, -4))")` returns `24`
- Edge cases: `evaluate("div(-7, 2)")` returns `-3` (truncation, not floor). `evaluate("42")` returns `42`, `evaluate("-5")` returns `-5`, `evaluate("add()")` returns `0` and `evaluate("mul()")` returns `1`.
- Deep nesting: `evaluate("add(1," * 50000 + "0" + ")" * 50000)` returns `50000`

<details><summary>Approach (spoiler)</summary>

**Part 1:** Keep two hash maps, `manager[emp]` and `reports[emp]`, where each `reports` entry is a set. Removing an employee updates three places: the parent's report set, each moved child's manager, and the parent's set again as the children are added. That preserves the tree invariant. `chain_of_command` follows the manager pointers up to the CEO. **Time:** O(1) add, O(r) remove, O(r log r) direct_reports, O(depth) chain.

**Part 2:** Tokenise the string into names, integers (with an optional `-`), `(`, `,` and `)`. Then evaluate with an explicit stack of `(function, collected_args)` frames. A name pushes a new frame. An integer is appended to the top frame's arguments. A `)` pops the frame, applies the function, and appends the result to the frame below, or stores it as the final result if no frame is left. This is recursive descent with the call stack made explicit, so deep nesting can't overflow. **Time:** O(len(expr)) · **Space:** O(depth).

```python
# Part 1
class OrgChart:
    def __init__(self, ceo: str) -> None:
        self.ceo = ceo
        self.manager = {ceo: None}
        self.reports = {ceo: set()}

    def add_employee(self, emp: str, manager: str) -> bool:
        if emp in self.manager or manager not in self.manager:
            return False
        self.manager[emp] = manager
        self.reports[emp] = set()
        self.reports[manager].add(emp)
        return True

    def remove_employee(self, emp: str) -> bool:
        if emp not in self.manager or emp == self.ceo:
            return False
        boss = self.manager.pop(emp)
        self.reports[boss].discard(emp)
        for r in self.reports.pop(emp):          # reports move up to emp's manager
            self.manager[r] = boss
            self.reports[boss].add(r)
        return True

    def direct_reports(self, emp: str) -> list[str]:
        return sorted(self.reports.get(emp, ()))

    def chain_of_command(self, emp: str) -> list[str]:
        if emp not in self.manager:
            return []
        chain = []
        while emp is not None:
            chain.append(emp)
            emp = self.manager[emp]
        return chain

# Part 2
def evaluate(expr: str) -> int:
    tokens, i = [], 0
    while i < len(expr):
        c = expr[i]
        if c.isspace():
            i += 1
        elif c in "(),":
            tokens.append(c); i += 1
        elif c.isalpha():
            j = i
            while j < len(expr) and expr[j].isalpha():
                j += 1
            tokens.append(expr[i:j]); i = j
        else:                                     # integer, possibly negative
            j = i + 1
            while j < len(expr) and expr[j].isdigit():
                j += 1
            tokens.append(int(expr[i:j])); i = j

    def apply(name: str, args: list[int]) -> int:
        if name == "add":
            return sum(args)
        if name == "mul":
            r = 1
            for a in args:
                r *= a
            return r
        if name == "sub":
            return args[0] - args[1]
        if name == "div":
            if args[1] == 0:
                raise ZeroDivisionError("division by zero")
            q = abs(args[0]) // abs(args[1])
            return q if (args[0] >= 0) == (args[1] >= 0) else -q   # truncate toward zero
        raise ValueError(f"unknown function {name}")

    # iterative evaluation with an explicit stack of (function name, args so far)
    stack, result, k = [], None, 0
    while k < len(tokens):
        t = tokens[k]
        if isinstance(t, int):
            if stack:
                stack[-1][1].append(t)
            else:
                result = t
            k += 1
        elif t == ",":
            k += 1
        elif t == ")":
            name, args = stack.pop()
            v = apply(name, args)
            if stack:
                stack[-1][1].append(v)
            else:
                result = v
            k += 1
        else:                                     # function name, followed by "("
            stack.append((t, []))
            k += 2
    return result
```
</details>
