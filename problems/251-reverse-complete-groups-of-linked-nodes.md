# Reverse Complete Groups of Linked Nodes
> Google · Other · hard · Pattern: Linked List
> Source: https://prachub.com/interview-questions/reverse-complete-groups-of-linked-nodes

### Problem

Given a singly linked list's head and a positive integer `k`, reverse the order of the nodes within each consecutive complete group of `k` nodes. Return the head of the modified chain. If the last group has fewer than `k` nodes, leave that trailing group in its original order.

Change the node links themselves. A node's stored value must never be changed; swapping values does not perform the required operation.

Each `ListNode` has an integer `val` and a `next` link. Keep the node-based interface:

```cpp
ListNode* reverseKGroup(ListNode* head, int k);
```

Brackets show the values reached by following the list's links; the input and output are head references.

### Examples

```text
Input: head = [7,1,8,2,9], k = 2
Output: [1,7,2,8,9]
```

The final node is outside any complete pair and stays at the end.

```text
Input: head = [7,1,8,2,9], k = 3
Output: [8,1,7,2,9]
```

### Constraints

- The chain contains `n` nodes, with `1 <= k <= n <= 5000`.
- Every node value is between 0 and 1000, inclusive.
- Preserve each original node and its stored value while changing the links required for the reversal.

### Follow-up

Can you perform the operation using `O(1)` extra space?
