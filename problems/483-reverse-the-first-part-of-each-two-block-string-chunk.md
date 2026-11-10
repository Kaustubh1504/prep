# Reverse the First Part of Each Two-Block String Chunk
> Google · Other · easy · Pattern: String Processing, Two Pointers
> Source: https://prachub.com/interview-questions/reverse-the-first-part-of-each-two-block-string-chunk

### Problem

For each consecutive block of 2k characters in s, reverse its first k characters and leave the rest unchanged. If the final block has fewer than k characters, reverse all of them; if it has between k and 2k characters, reverse exactly its first k.

```cpp
class Solution {
public:
    string reverseStr(string s, int k);
};
```

### Examples

**Example 1:**

```text
s = "hijklmnop", k = 3
Output: "jihklmpon"
Explanation: Reverse hij, leave klm, then reverse nop.
```

**Example 2:**

```text
s = "wxyz", k = 6
Output: "zyxw"
Explanation: The remaining block is shorter than k.
```

### Constraints

- String length: 1..10000; characters are English lowercase. Block parameter k: 1..10000.

### Clarifying Questions

Handle both incomplete-block cases and keep the second k characters of each complete block unchanged.

```hint Read the boundary condition
Where does each new 2k-character block begin?
```

### Contract considerations

Handle both incomplete-block cases and keep the second k characters of each complete block unchanged.
