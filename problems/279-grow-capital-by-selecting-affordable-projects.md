# Grow Capital by Selecting Affordable Projects
> Google · Other · hard · Pattern: Heap / Top-K, Greedy, Sorting
> Source: https://prachub.com/interview-questions/grow-capital-by-selecting-affordable-projects

### Problem

You start with capital w and may complete at most k distinct projects. Project i requires your current capital to be at least capital[i]; completing it adds profits[i] without spending the required capital. Return the largest possible final capital. The result fits a signed 32-bit integer.

```cpp
class Solution {
public:
    int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital);
};
```

### Examples

**Example 1:**

```text
k = 2, w = 1, profits = [2,5,3], capital = [1,3,2]
Output: 8
Explanation: Choose profit 2, then profit 5: capital 1 -> 3 -> 8.
```

**Example 2:**

```text
k = 3, w = 0, profits = [4,8], capital = [1,2]
Output: 0
Explanation: Neither project can be started.
```

### Constraints

- Project count n: 1..100000; both profits and capital have n entries. Selection limit k: 1..100000. Initial w: 0..1000000000. Each profit: 0..10000; each capital requirement: 0..1000000000.

### Clarifying Questions

Distinguish the minimum capital needed to begin a project from a cost deducted on completion; enforce distinct projects and the at-most-k limit.

```hint Read the boundary condition
Once a project becomes affordable, can increasing capital make it unavailable?
```

### Contract considerations

Distinguish the minimum capital needed to begin a project from a cost deducted on completion; enforce distinct projects and the at-most-k limit.
