# Clone Connected Graph Nodes without Sharing Original Objects
> Google · Other · medium · Pattern: Graph BFS / DFS
> Source: https://prachub.com/interview-questions/clone-connected-graph-nodes-without-sharing-original-objects

### Problem

Given a node reference in a connected undirected graph, return the corresponding node reference in a deep copy of the graph. Each original node must have a separate new counterpart with the same value and corresponding cloned neighbors. The clone must not reuse original nodes.

The supplied custom `Node` contains `int val` and `vector<Node*> neighbors`:

```cpp
Node* cloneGraph(Node* node);
```

Adjacency lists below display the graph; they are not the function argument or return type. Neighbor collections are unordered. The starting node has value 1; display indices are one-based node labels.

### Examples

```text
Original adjacency: [[2,3],[1,3],[1,2]]
Clone adjacency:    [[2,3],[1,3],[1,2]]
```

All three returned nodes are new objects, with the same triangle connectivity.

```text
Original adjacency: [[]]
Clone adjacency:    [[]]
```

This is one isolated node, not an empty graph.

### Constraints

- The graph has between 0 and 100 nodes; an empty input is null.
- Node values are unique integers between 1 and 100.
- There are no repeated edges or self-loops.
- Every graph node is reachable from the supplied starting node.
