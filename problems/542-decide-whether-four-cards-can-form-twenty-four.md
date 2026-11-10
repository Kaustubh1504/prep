# Decide Whether Four Cards Can Form Twenty-Four
> Google · Other · hard · Pattern: Stack / Parsing
> Source: https://prachub.com/interview-questions/decide-whether-four-cards-can-form-twenty-four

### Problem

Use all four cards exactly once in a parenthesized expression with binary +, -, *, /. Division is real division. Unary minus and concatenating card digits are forbidden. Return whether any permitted expression has exact value 24.

```cpp
class Solution {
public:
    bool judgePoint24(vector<int>& cards);
};
```

### Examples

**Example 1:**

```text
cards = [3,3,8,8]
Output: true
Explanation: 8/(3-8/3) = 24 uses real division.
```

**Example 2:**

```text
cards = [1,1,1,1]
Output: false
Explanation: A pair of ones can only produce 0,1,2 (or undefined division); combining the resulting two pairs reaches at most 4, and the three-plus-one parenthesizations likewise cannot reach 24.
```

### Constraints

- Exactly four card entries are supplied; each integer lies in 1..9.

### Clarifying Questions

Use every card once, support noninteger intermediates and reject division by zero.

```hint Read the boundary condition
Can combining two available values recursively cover every parenthesized binary expression?
```

### Contract considerations

Use every card once, support noninteger intermediates and reject division by zero.
