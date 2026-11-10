# Implement Trie Insert and Exact-Word Search
> Google · Technical Screen · medium · Pattern: Trie
> Source: https://prachub.com/interview-questions/implement-trie-insert-and-exact-word-search

## Problem

Implement a trie that supports `insert(word)` and `search(word)`. Insert adds a
lowercase word. Search returns true only when the complete word was previously
inserted; a stored word merely sharing the requested prefix is not a match.
Process a sequence of operations and return the results of all searches.

### Constraints & Assumptions

- There are at most 200,000 operations.
- Every word has length between 1 and 1,000.
- The total number of characters across all operations is at most 1,000,000.
- Words contain lowercase English letters.

### Clarifications

- Inserting the same word repeatedly is allowed and has no additional effect.
- A node must distinguish an inserted word ending there from a prefix only.
- Return booleans in the same order as search operations appear.

### Examples

```text
operations = [insert("apple"), search("apple"), search("app"), insert("app"), search("app")]
output = [true, false, true]
```

### Hints

```hint Represent prefixes
Each edge consumes one character and each node represents the prefix along its path.
```

```hint Mark complete words
Reaching the final character is not enough unless the terminal node records an insertion.
```

<details><summary>Hints (spoiler)</summary>

1. Let every trie node represent one consumed prefix.
2. Mark a node separately when an inserted word ends there.
</details>

<details><summary>Approach (spoiler)</summary>

Each trie node represents the prefix spelled by the path from the root and stores one child per next lowercase character plus a terminal flag. Insert follows or creates the word's edges and marks only its final node terminal. Search follows the requested edges; a missing edge proves the word was never inserted, while reaching all characters succeeds only when the final node is terminal. Therefore shared prefixes reuse nodes without confusing a prefix with an exact stored word.

**Time:** O(C), where C is the total number of characters across all operations · **Space:** O(I + r), where I is the number of distinct inserted-prefix characters and r is the number of searches
</details>
