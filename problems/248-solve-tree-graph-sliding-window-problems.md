# Solve tree, graph, sliding-window problems
> Google · Technical Screen · medium · Pattern: Tree Traversal / BST, Graph BFS / DFS, Sliding Window
> Source: https://prachub.com/interview-questions/solve-tree-graph-sliding-window-problems

{"blocks": [{"key": "80e32402", "text": "Question", "type": "header-two", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {}}, {"key": "8a4e0662", "text": "LeetCode 103. Binary Tree Zigzag Level Order Traversal – given a binary tree root, return its zigzag level-order traversal.", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {}}, {"key": "a7f92834", "text": "LeetCode 207. Course Schedule – given course prerequisites, determine if all courses can be finished by detecting cycles with topological sort.", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {}}, {"key": "2ddfd283", "text": "LeetCode 340. Longest Substring with At Most K Distinct Characters – given string s and integer k, return the length of the longest substring containing at most k distinct characters.", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {}}, {"key": "baf30a96", "text": "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/description/ https://leetcode.com/problems/course-schedule/description/ https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/description/", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {}}], "entityMap": {}}

<details><summary>Hints (spoiler)</summary>

1. A breadth-first search naturally processes the tree one level at a time.
2. You can collect each level left-to-right, then reverse every other level before appending it to the answer.
</details>
