# Find shortest path with blocked nodes
> Google · Onsite · medium · Pattern: Shortest Path, Graph BFS / DFS
> Source: https://prachub.com/interview-questions/find-shortest-path-with-blocked-nodes

{"blocks": [{"key": "e8053ffe", "text": "Question", "type": "header-two", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {}}, {"key": "d3d6bebb", "text": "Given an unweighted graph, a start node, an end node, and a block_set of nodes that cannot be traversed, return the length of the shortest path from start to end. Follow-up: discuss edge cases and how you would optimize space for the BFS solution. Follow-up: if nodes in block_set are traversable but incur additional cost, how would you find the fastest path?", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {}}], "entityMap": {}}

<details><summary>Hints (spoiler)</summary>

1. Use BFS from start while skipping any neighbor that is blocked or already visited.
2. Return the level at which you first dequeue end; if start == end and not blocked, the answer is 0.
3. For space optimization, consider bidirectional BFS from start and end on the unblocked subgraph.
4. If blocked nodes are traversable with extra cost, model entering a blocked node as higher edge weight and use Dijkstra's algorithm.
</details>

<details><summary>Approach (spoiler)</summary>

Build an adjacency list and run breadth-first search (BFS) from start. Maintain a visited array and a set of blocked nodes. If start or end is blocked, return -1 immediately. BFS explores the graph in increasing distance layers; when end is first reached, the current layer number is the shortest path length. Skip pushing any neighbor that is blocked or already visited. If the queue empties without reaching end, return -1. Space/time can be improved in practice using bidirectional BFS from both start and end over the unblocked nodes. If blocked nodes were traversable with extra cost, convert the problem to a weighted shortest path and use Dijkstra's algorithm.

**Time:** O(n + m), where m = len(edges) · **Space:** O(n + m)
</details>
