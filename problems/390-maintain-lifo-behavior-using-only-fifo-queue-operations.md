# Maintain LIFO Behavior Using Only FIFO Queue Operations
> Google · Other · easy · Pattern: Design / Data Structure, Stack / Parsing
> Source: https://prachub.com/interview-questions/maintain-lifo-behavior-using-only-fifo-queue-operations

### Problem

Implement a LIFO stack using only two FIFO queues and their standard operations: push to back, peek/pop from front, size, and empty. A list or deque may simulate a queue only while obeying those operations. Preserve the original stateful class:

```cpp
class MyStack {
public:
    MyStack();
    void push(int x);
    int pop();
    int top();
    bool empty();
};
```

Pop removes and returns the most recently pushed remaining value. Top reads it without removal. Empty reports whether no values remain.

### Examples

```text
MyStack()
push(2)
push(5)
pop() -> 5
top() -> 2
pop() -> 2
empty() -> true
```

```text
MyStack()
empty() -> true
push(8)
top() -> 8
empty() -> false
```

### Constraints

- Pushed values lie between 1 and 9.
- At most 100 total push, pop, top and empty calls occur.
- Every pop and top call is valid on a nonempty stack.

### Optional follow-up

Can the same stack be implemented using only one queue?
