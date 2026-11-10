# Find largest digit-sharing subset
> Google · Online Assessment · easy · Pattern: Hashing / Counting, Bit Manipulation
> Source: https://prachub.com/interview-questions/find-largest-digit-sharing-subset

You are given an array of N integers. Each integer has exactly two decimal digits (i.e., each element is between 10 and 99 inclusive).

You want to choose some of the array elements to form a **group**. A group is **valid** if there exists at least one digit (0–9) that appears in **every** number in the group.

- For example, numbers 52, 25, and 55 can form a valid group because they all contain digit 5.
- Numbers 11, 52, and 34 cannot form a valid group, because there is no single digit that appears in all three numbers.

Your task:

- Determine the **maximum possible size** of a valid group that can be chosen from the array.
- If no two numbers share a digit, the answer can be 1 (any single element is trivially a valid group, since the shared digit condition holds vacuously for one element).

**Input:**
- An integer N (number of elements in the array).
- N integers, each between 10 and 99 inclusive.

**Output:**
- A single integer: the maximum size of a valid group.

You should design an efficient algorithm that works for large N.

<details><summary>Hints (spoiler)</summary>

1. A group is valid iff all its members share one common digit. So you never need to consider arbitrary subsets — just fix the shared digit.
2. For each digit d in 0..9, count how many array elements contain d. The largest such count is the answer.
3. Extract a number's two digits with tens = x // 10 and ones = x % 10 (or use the string representation). Use a set per number so a number like 55 is not double-counted for digit 5.
4. For a non-empty array the answer is at least 1, since any single element is trivially a valid group.
</details>
