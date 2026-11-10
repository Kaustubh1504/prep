# Return All Minimum-Height Roots of an Undirected Tree
> Google · Other · medium · Pattern: Graph BFS / DFS, Topological Sort
> Source: https://prachub.com/interview-questions/return-all-minimum-height-roots-of-an-undirected-tree

### Problem

Given a tree with node labels 0 through n-1, return all roots minimizing the greatest root-to-leaf edge distance. Return the root labels in any order.

```cpp
vector<int> findMinHeightTrees(int n, vector<vector<int>>& edges);
```

### Examples

```text
n=5, edges=[[0,1],[1,2],[2,3],[3,4]] -> [2]
n=2, edges=[[0,1]] -> [0,1]
```

### Constraints

- 1 <= n <= 20000; there are n-1 distinct undirected edges.
- Endpoints are distinct valid labels.
- The input is guaranteed connected and acyclic.

### Follow-up Questions

Explain how the permitted output freedom is preserved without losing required values or occurrences.

### What a Strong Answer Covers

Find a longest tree path by two traversals, then return its one middle vertex or two middle vertices. Explain why every produced result satisfies the source contract and why no required result is omitted.
