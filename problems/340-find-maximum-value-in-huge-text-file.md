# Find maximum value in huge text file
> Google · Technical Screen · hard · Pattern: Simulation
> Source: https://prachub.com/interview-questions/find-maximum-value-in-huge-text-file

You are given the path to a **very large** text file on disk. The file has the following properties:

- Each line contains exactly one signed 64-bit integer (in decimal).
- The file size can be tens or hundreds of gigabytes, so it **cannot** be fully loaded into memory.
- You have standard file I/O APIs that allow you to read the file sequentially (e.g., line by line or in chunks).

### Tasks
1. **Single-machine solution**
   Design an algorithm to compute the **maximum integer value** in this file.
   - Assume you have limited RAM (much smaller than the file size).
   - Discuss how you would read the file and track the result.
   - Give high-level pseudocode.
   - Analyze time and space complexity.

2. **Performance improvement / parallelization**
   Suppose you now have a multi-core machine or multiple machines available and want to speed up the computation.
   - How would you modify your approach to take advantage of parallelism (e.g., processing the file in chunks)?
   - Explain how you would combine partial results to get the global maximum.
   - Mention any edge cases or failure scenarios you would consider (e.g., very large values, empty file).

Assume you do not have a database; you are working directly with the file system and your programming language's standard I/O libraries.
