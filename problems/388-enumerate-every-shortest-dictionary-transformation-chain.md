# Enumerate Every Shortest Dictionary Transformation Chain
> Google · Other · hard · Pattern: Graph BFS / DFS, Backtracking
> Source: https://prachub.com/interview-questions/enumerate-every-shortest-dictionary-transformation-chain

### Problem

Return all shortest word-transformation sequences from `beginWord` to `endWord`. Each step changes exactly one letter. Every word after the first must belong to `wordList`; the starting word need not. Each sequence includes both endpoints. Return an empty collection if no sequence exists. No order between the returned sequences is prescribed.

```cpp
vector<vector<string>> findLadders(string beginWord, string endWord, vector<string>& wordList);
```

### Examples

```text
Input: beginWord = "red", endWord = "tax",
       wordList = ["ted","tex","red","tax","tad","den","rex","pee"]
One valid output:
[["red","ted","tex","tax"],["red","ted","tad","tax"],["red","rex","tex","tax"]]
```

```text
Input: beginWord = "ab", endWord = "cd", wordList = ["ad","bd"]
Output: []
```

### Constraints & Assumptions

- Word length is between 1 and 5 and is the same for all words.
- The dictionary has between 1 and 500 unique words.
- All words use lowercase English letters, and the endpoints differ.
- The source bounds the sum of the shortest transformation sequences by 100000.

### What a Strong Answer Covers

- Every shortest sequence, including multiple shortest parents of one word.
- Dictionary membership after the starting word and the unreachable case.
- Search cost and the unavoidable size of all returned sequences.

### Follow-up Questions

- What happens if `endWord` is absent from the dictionary?
- Why can two shortest sequences share the same penultimate word?
