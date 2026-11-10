# Separate Nested Function Calls into Exclusive Times
> Google · Other · medium · Pattern: Stack / Parsing
> Source: https://prachub.com/interview-questions/separate-nested-function-calls-into-exclusive-times

### Problem

Given chronological single-threaded call-stack logs id:start:t or id:end:t, return each function ID's total time executing at the top of the stack. A start occurs at the beginning of its timestamp; an end includes its entire timestamp. Calls may recur, including the same ID nested inside itself.

```cpp
class Solution {
public:
    vector<int> exclusiveTime(int n, vector<string>& logs);
};
```

### Examples

**Example 1:**

```text
n = 2, logs = ["0:start:1","1:start:3","1:end:4","0:end:6"]
Output: [4,2]
Explanation: Function 0 owns times 1,2,5,6; function 1 owns 3,4.
```

**Example 2:**

```text
n = 1, logs = ["0:start:2","0:end:2"]
Output: [1]
Explanation: An inclusive end gives one unit.
```

### Constraints

- Function count n: 1..100. Log count: 2..500. IDs are in 0..n-1 and timestamps in 0..1000000000. Start timestamps are pairwise distinct; end timestamps are pairwise distinct. Every start has its corresponding end.

### Clarifying Questions

Honor inclusive ends, recursive IDs and parent suspension during nested calls.

```hint Read the boundary condition
What is the first timestamp that has not yet been charged to a function?
```

### Contract considerations

Honor inclusive ends, recursive IDs and parent suspension during nested calls.
