# Implement FIFO Operations with Two Stacks
> Google · Other · easy · Pattern: Design / Data Structure, Stack / Parsing
> Source: https://prachub.com/interview-questions/implement-fifo-operations-with-two-stacks

### Problem

Implement MyQueue with its original constructor and push, pop, peek and empty methods. push appends a value, pop removes and returns the oldest value, peek returns it without removal, and empty reports whether no values remain. Use only two stacks and standard stack operations: push, top/peek, pop, size and emptiness. A list or deque may serve as a stack only through those operations.

```cpp
class MyQueue {
public:
    MyQueue();
    void push(int x);
    int pop();
    int peek();
    bool empty();
};
```

### Examples

```text
MyQueue(); push(4); push(7); peek() -> 4; pop() -> 4; empty() -> false
MyQueue(); empty() -> true; push(9); pop() -> 9; empty() -> true
```

### Constraints

- Pushed values are in [1,9].
- At most 100 method calls occur.
- Every pop and peek call is valid.

### Optional follow-up

Explain how amortized O(1) operations give O(n) total work for n operations.
