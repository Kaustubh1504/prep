# Keep One Representative of Each Sorted List Value
> Google · Other · easy · Pattern: Linked List
> Source: https://prachub.com/interview-questions/keep-one-representative-of-each-sorted-list-value

### Problem

Given the head of a sorted singly linked list, remove excess copies so each distinct value appears once. Return the head of the resulting sorted linked list. A value that appeared repeatedly must still have one representative.

The supplied `ListNode` has `val` and `next` fields:

```cpp
ListNode* deleteDuplicates(ListNode* head);
```

Brackets in examples display values along the pointer chain.

### Examples

```text
Input: head = [-3,-3,0,0,0,5]
Output list: [-3,0,5]
```

```text
Input: head = [7,7,7]
Output list: [7]
```

### Constraints

- There are between 0 and 300 nodes.
- Every node value is between -100 and 100, inclusive.
- The input list is sorted in ascending order, allowing equal values.
