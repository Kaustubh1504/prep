# Find the nearest common manager of K employees in a reporting tree
> Google · Onsite · medium · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/find-the-nearest-common-manager-of-k-employees-in-a-reporting-tree

A company's reporting structure forms a tree. Employees are numbered `0` to `n - 1`. Every employee except one has exactly one direct manager; the remaining employee is at the top of the hierarchy and has no manager.

Given the reporting structure and a list of `k` distinct employees, return their nearest common manager: the employee farthest from the top who appears in the management chain of every listed employee.

### Function Signature

```python
def nearest_common_manager(manager: list[int], employees: list[int]) -> int:
```

### Rules

- `manager[i]` is the direct manager of employee `i`, or `-1` if employee `i` is the top of the hierarchy.
- The chain of employee `e` is `e` itself, then `manager[e]`, then that employee's manager, and so on up to the top employee.
- An employee `x` is a common manager of the list when `x` is in the chain of every listed employee. Because each chain starts with the employee, if one listed employee is above all the others (directly or indirectly), the answer is that listed employee.
- The top employee is in every chain, so a common manager always exists. All common managers lie on one path to the top, so exactly one of them is farthest from the top. Return its number.

### Constraints

- `2 <= n <= 100000`, where `n = len(manager)`
- Exactly one index `i` has `manager[i] == -1`. Every other `manager[i]` is in `[0, n - 1]`, and following managers from any employee reaches the top employee without revisiting anyone.
- `2 <= k <= n`, where `k = len(employees)`
- The values in `employees` are distinct, and each is in `[0, n - 1]`.
- The hierarchy may be a single chain, so an employee can be up to `n - 1` levels below the top.

### Examples

**Example 1**

```text
Input:  manager = [-1, 0, 0, 1, 1, 2, 3], employees = [6, 4]
Output: 1
```

Employee 6's chain is 6, 3, 1, 0 and employee 4's chain is 4, 1, 0. Employees 1 and 0 appear in both chains, and 1 is farther from the top.

**Example 2**

```text
Input:  manager = [-1, 0, 0, 1, 1, 2, 3], employees = [6, 4, 5]
Output: 0
```

Employee 5's chain is 5, 2, 0, so the only employee in all three chains is the top employee 0.

**Example 3**

```text
Input:  manager = [-1, 0, 0, 1, 1, 2, 3], employees = [3, 6]
Output: 3
```

Employee 3 is the direct manager of employee 6, and 3 is the first entry of its own chain, so 3 is the nearest common manager.

<details><summary>Hints (spoiler)</summary>

1. Every chain ends at the top employee, so the top is always a common manager; the question is how far below the top you can go while staying in every chain.
2. An employee x is a common manager exactly when every listed employee is x itself or somewhere below x.
3. The hierarchy can be a single chain n - 1 levels deep, so prefer work that does not grow the call stack with the depth.
</details>

<details><summary>Approach (spoiler)</summary>

An employee x is in the chain of employee e exactly when e is x or somewhere below x, so x is a common manager exactly when all k listed employees are x or below x. Build each employee's list of direct reports, then list everyone in breadth-first order starting from the top employee (found by its -1 entry, at any index), so every employee appears after its manager. Give each listed employee a count of 1 and walk that order backward, adding each employee's count into its manager's count. Invariant: when the backward walk reaches v, every employee below v has already been visited (they all come later in breadth-first order), so v's count is final and equals the number of listed employees that are v or below v. The common managers are the answer and the employees above it on its path to the top; nobody below the answer reaches count k (that would be a common manager farther from the top), and every employee above it is visited after it, so the first employee whose count equals k is the nearest common manager. The top employee always reaches k, so an answer always exists. Edge cases: a listed employee above all the others counts itself and is returned; the top employee may be listed, may sit at any index, and manager numbers need not be smaller than the employee's own number; the walk uses explicit arrays rather than recursion, so a single chain n - 1 levels deep is safe. Every value stays within [-1, 100000], so 32-bit integers suffice in every language.

**Time:** O(n) · **Space:** O(n)
</details>
