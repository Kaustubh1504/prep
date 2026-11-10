# Remove a Linked Node by Its Distance from the Tail
> Google · Other · medium · Pattern: Linked List
> Source: https://prachub.com/interview-questions/remove-a-linked-node-by-its-distance-from-the-tail

### Problem

Given the head of a singly linked list and an integer `n`, remove the node that is `n` positions from the tail, counting the tail as position 1. Return the head of the remaining list. If removing the only node leaves an empty list, return null.

Each `ListNode` contains an integer `val` and a `next` link. Preserve the linked-node interface:

```cpp
ListNode* removeNthFromEnd(ListNode* head, int n);
```

Brackets in the examples show the node values in traversal order. `[]` denotes a null head.

### Examples

```text
Input: head = [8,3,6,1,4], n = 3
Output: [8,3,1,4]
```

```text
Input: head = [7], n = 1
Output: []
```

```text
Input: head = [5,9], n = 1
Output: [5]
```

### Constraints

- The input has `sz` nodes, where `1 <= sz <= 30`.
- Node values range from 0 through 100.
- `1 <= n <= sz`, so the requested position always exists.

### Follow-up

Can you remove the requested node with one forward traversal rather than first counting the list and then restarting?
