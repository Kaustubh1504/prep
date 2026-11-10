# Solve Grid and Counting Problems
> Google · Technical Screen · medium · Pattern: Graph BFS / DFS
> Source: https://prachub.com/interview-questions/solve-grid-and-counting-problems

A software engineering intern phone screen included two coding tasks:

1. **Count islands in a grid**

   Given an `m x n` grid of characters where `'1'` represents land and `'0'` represents water, return the number of islands. An island is formed by connecting adjacent land cells horizontally or vertically. You may assume all four edges of the grid are surrounded by water.

2. **Count ways to form a target word**

   Given an array of uppercase letters, count how many different ways you can choose letters from the array so that the chosen letters can be rearranged to spell `GOOGLE`. Each array element can be used at most once, and letters at different indices are considered different choices even if they contain the same character.

Design efficient algorithms for both tasks, and discuss the time and space complexity of your approach.

<details><summary>Hints (spoiler)</summary>

1. Whenever you find an unvisited land cell, start a DFS or BFS to mark the entire island.
2. Only 4-directional neighbors matter: up, down, left, and right.
</details>
