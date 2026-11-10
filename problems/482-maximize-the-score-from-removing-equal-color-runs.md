# Maximize the Score from Removing Equal-Color Runs
> Google · Other · hard · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/maximize-the-score-from-removing-equal-color-runs

### Problem

Given the sequence boxes, repeatedly remove a contiguous nonempty run of k boxes of one color and earn k*k points. Remaining boxes close the gap. Return the maximum total score after removing every box.

```cpp
class Solution {
public:
    int removeBoxes(vector<int>& boxes);
};
```

### Examples

**Example 1:**

```text
boxes = [2,1,2]
Output: 5
Explanation: Remove the middle box for 1, then the two 2s for 4.
```

**Example 2:**

```text
boxes = [4,4,3,3]
Output: 8
Explanation: Removing each two-box run gives 4+4.
```

### Constraints

- Box count: 1..100. Each color is encoded by an integer in 1..100.

### Clarifying Questions

Keep the score quadratic in removed-run length and retain state for same-colored boxes that can merge later.

```hint Read the boundary condition
What extra information must an interval state remember about boxes saved beside its right endpoint?
```

### Contract considerations

Keep the score quadratic in removed-run length and retain state for same-colored boxes that can merge later.
