# Remove Every Matching Node from a Linked Chain
> Google · Other · easy · Pattern: Linked List
> Source: https://prachub.com/interview-questions/remove-every-matching-node-from-a-linked-chain

### Problem

Remove every node whose value equals val from a singly linked list, and return the new head. Keep the remaining nodes in their existing list order.

```cpp
ListNode* removeElements(ListNode* head, int val);
```

Use the original ListNode fields val and next. Brackets display chain values, not an array API.

### Examples

```text
Input chain: [4,2,4,3,4], val = 4
Output chain: [2,3]
```

```text
Input chain: [5,5], val = 5
Output chain: []
```

### Constraints

- There are between 0 and 10000 nodes.
- Node values lie between 1 and 50.
- The removal value lies between 0 and 50.
