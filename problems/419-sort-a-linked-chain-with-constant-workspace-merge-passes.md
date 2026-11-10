# Sort a Linked Chain with Constant-Workspace Merge Passes
> Google · Other · medium · Pattern: Linked List, Sorting
> Source: https://prachub.com/interview-questions/sort-a-linked-chain-with-constant-workspace-merge-passes

### Problem

Return the head of a singly linked list after sorting it in ascending, nondecreasing value order. Keep the original `ListNode` pointer interface; `ListNode` contains `val` and `next`.

```cpp
ListNode* sortList(ListNode* head);
```

Brackets show values along a chain and are not array parameters. Equal values are allowed; no extra identity tie ordering is required.

### Examples

```text
Input chain: [7,-2,4,0]
Output chain: [-2,0,4,7]
```

```text
Input chain: []
Output chain: []
```

### Constraints

- There are between 0 and 50000 nodes.
- Values range from -100000 to 100000.

### Optional follow-up

Can you sort in `O(n log n)` time using only `O(1)` extra memory?
