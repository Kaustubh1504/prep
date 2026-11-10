# Determine if a 14-tile hand is winning
> Google · Technical Screen · medium · Pattern: Backtracking
> Source: https://prachub.com/interview-questions/determine-if-a-14-tile-hand-is-winning

You are given an integer array `tiles` of length 14 representing a Mahjong-like hand. Each integer is a tile value from 1 to 9 (single suit). You may reorder the tiles.

A hand is **winning** if it can be partitioned into:
- **1 pair**: two identical tiles, and
- **4 melds** (each meld uses 3 tiles), where each meld is either:
  - a **triplet**: three identical tiles (e.g., 7,7,7), or
  - a **sequence**: three consecutive values (e.g., 2,3,4).

Each tile can be used at most once.

Return `true` if the hand is winning, otherwise return `false`.

Assumptions/constraints:
- `tiles.length == 14`
- `1 <= tiles[i] <= 9`
- Each value can appear multiple times (as in a real tile set).

<details><summary>Hints (spoiler)</summary>

1. Count how many times each value from 1 to 9 appears instead of working directly with the raw array.
2. Try every possible pair first. After removing a pair, recursively remove the smallest remaining tile as part of either a triplet or a sequence.
</details>
