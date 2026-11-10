# Reorder Existing Nodes from Alternating List Ends
> Google · Other · medium · Pattern: Linked List
> Source: https://prachub.com/interview-questions/reorder-existing-nodes-from-alternating-list-ends

### Problem

Reorder the existing nodes of a singly linked list by alternating from its beginning and end. If the original node identities are `L0,L1,...,Lk`, the result is `L0,Lk,L1,L(k-1),...`. Do not change any node's stored value.

```cpp
void reorderList(ListNode* head);
```

Keep the original `ListNode` objects and mutate their next links; the function returns nothing. Display brackets show node values along the chain.

### Examples

```text
Input: head = [2,5,8,11,14]
Chain after call: [2,14,5,11,8]
```

```text
Input: head = [3,6,9,12]
Chain after call: [3,12,6,9]
```

### Constraints

- There are between 1 and 50000 nodes.
- Values are between 1 and 1000, inclusive.
