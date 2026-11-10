# Place a Binary Tree in Its Prescribed String Grid
> Google · Other · medium · Pattern: Tree Traversal / BST
> Source: https://prachub.com/interview-questions/place-a-binary-tree-in-its-prescribed-string-grid

### Problem

Construct a string grid for root. Let h be tree height in edges, so the grid has h+1 rows and 2^(h+1)-1 columns. Put root at row 0 and the middle column. A node at (r,c) places its children at row r+1 and columns c-2^(h-r-1) and c+2^(h-r-1), respectively. Fill every unused cell with "" and store node values as decimal strings.

```cpp
class Solution {
public:
    vector<vector<string>> printTree(TreeNode* root);
};
```

### Examples

**Example 1:**

```text
root = [7,2,9]
Output: [["","7",""],["2","","9"]]
Explanation: Height one gives three columns.
```

**Example 2:**

```text
root = [-4]
Output: [["-4"]]
Explanation: Height zero gives one row and one column.
```

### Constraints

- Tree size: 1..1024 nodes. Node values are in -99..99, and tree depth in nodes is in 1..10.

### Clarifying Questions

Use the exact row and column formulas and retain empty strings rather than spaces or null values.

```hint Read the boundary condition
How does each child's reserved column interval relate to its parent's interval?
```

### Contract considerations

Use the exact row and column formulas and retain empty strings rather than spaces or null values.
