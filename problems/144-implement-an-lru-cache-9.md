# Implement an LRU cache
> Google · Onsite · medium · Pattern: Design / Data Structure
> Source: https://prachub.com/interview-questions/implement-an-lru-cache-9

Design a key-value cache with a fixed capacity. It must support:
- `get(key)`: return the value for the key if it exists, otherwise return `-1`.
- `put(key, value)`: insert or update the key. If the cache is full, evict the least recently used key before inserting the new one.

Both operations should run in O(1) average time.

<details><summary>Hints (spoiler)</summary>

1. You need one structure for O(1) key lookup and another structure that can remove and reinsert nodes in O(1) when recency changes.
2. A doubly linked list with dummy head and tail nodes makes it easy to move a key to the most recently used position and evict the least recently used key.
</details>
