# Solve three coding problems
> Google · Onsite · easy · Pattern: Intervals / Sweep Line, Backtracking, Math / Number Theory
> Source: https://prachub.com/interview-questions/solve-three-coding-problems

The interview note described the following coding questions:

1. **Find the N-th license plate in lexicographic order**
   - A license plate has exactly 6 characters: the first 3 are uppercase letters `A-Z`, and the last 3 are digits `0-9`.
   - Example format: `AAA000`.
   - Consider all valid license plates sorted in lexicographic order as strings.
   - Given an integer `N` (1-indexed), return the `N`-th license plate.

2. **Count Android-style 3x3 unlock patterns**
   - You have a 3x3 grid of dots, like the standard Android lock screen.
   - A valid pattern is a sequence of distinct dots.
   - Moving from one dot to another is allowed unless the straight line between them passes through another dot that has not been visited yet.
   - Count the total number of valid unlock patterns that use between 4 and 9 dots, inclusive.

3. **Return intersections of two interval lists**
   - You are given two lists of closed intervals.
   - Within each list, intervals are sorted by start time and do not overlap with each other.
   - Return all intervals where the two lists overlap.

<details><summary>Hints (spoiler)</summary>

1. There are exactly 1000 possible numeric suffixes for each 3-letter prefix.
2. Use n - 1 to get a zero-based index, then split it into a letter-part index and a digit-part index.
</details>
