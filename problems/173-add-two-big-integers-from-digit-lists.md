# Add two big integers from digit lists
> Google · Technical Screen · medium · Pattern: Math / Number Theory, Linked List
> Source: https://prachub.com/interview-questions/add-two-big-integers-from-digit-lists

You are given two non-empty singly linked lists (or arrays) representing two non-negative integers. The digits are stored in **reverse order**, and each node contains a single digit from 0 to 9.

Your task is to add the two numbers and return the sum as a new linked list, also in reverse order.

You may assume:
- Each list has at least one node.
- The integers do not contain leading zeros, except the number 0 itself.

### Example
Input:
- List 1: 2 → 4 → 3   (represents the integer 342)
- List 2: 5 → 6 → 4   (represents the integer 465)

Output:
- 7 → 0 → 8   (represents the integer 807, since 342 + 465 = 807)

### Another example
Input:
- List 1: 9 → 9 → 9   (represents 999)
- List 2: 1           (represents 1)

Output:
- 0 → 0 → 0 → 1   (represents 1000)

### Constraints
- Let n be the length of the first list and m be the length of the second list.
- 1 ≤ n, m ≤ 10^5.
- Each node value is an integer in the range [0, 9].

**Task:** Describe an algorithm to perform this addition and construct the resulting linked list in O(n + m) time and O(1) additional space (excluding the space for the output list).

<details><summary>Hints (spoiler)</summary>

1. Walk both arrays from index 0 (the least significant digit) toward the end, just like grade-school column addition.
2. Maintain a single carry variable. At each position, sum the available digits plus the carry; append (sum % 10) and set carry = sum // 10.
3. When one array runs out, keep going with just the carry and the remaining longer array. Don't forget a final carry can add one extra digit (e.g. 999 + 1 -> [0,0,0,1]).
</details>
