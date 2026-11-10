# Solve Quickselect, Tree Distance, and Prefix Substrings
> Google · Onsite · medium · Pattern: Tree Traversal / BST, String Processing
> Source: https://prachub.com/interview-questions/solve-quickselect-tree-distance-and-prefix-substrings

You are given three independent coding tasks.

1. **Implement Quickselect**
   - Given an unsorted integer array `nums` and an integer `k`, return the `k`-th smallest element, where `k` is 1-indexed.
   - Duplicates may appear in the array.
   - Discuss different approaches, their time complexities, and how you would choose a pivot for Quickselect.
   - Implement one valid approach.

2. **Find the distance between two nodes in a tree**
   - You are given an undirected tree as a list of edges and two target nodes `u` and `v`.
   - Return the number of edges on the unique path between `u` and `v`.
   - If `u == v`, return `0`.
   - If either node does not exist, return `-1`.
   - You may assume the input edges form a valid tree unless otherwise specified. Be prepared to discuss how you would validate duplicate edges or invalid tree input.

3. **Count substrings with a given prefix**
   - Given a string `s` and a non-empty string `target`, count how many substrings of `s` have `target` as their prefix.
   - A substring `s[i:j]` is valid if its first `len(target)` characters exactly equal `target`.
   - Return the count as a 64-bit integer.
   - Follow-up: return the length of the shortest valid substring. If no valid substring exists, return `-1`.

<details><summary>Hints (spoiler)</summary>

1. Partition the array around a pivot like Quicksort, but only continue into the side that can contain the answer.
2. A 3-way partition is especially helpful when many elements are equal to the pivot.
</details>
