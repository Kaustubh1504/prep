# Maintain Stack Values and Historical Prefix Minima
> Google · Other · medium · Pattern: Design / Data Structure, Stack / Parsing
> Source: https://prachub.com/interview-questions/maintain-stack-values-and-historical-prefix-minima

### Problem

Implement a stack that supports these original stateful methods, each in `O(1)` time:

```cpp
class MinStack {
public:
    MinStack();
    void push(int value);
    void pop();
    int top();
    int getMin();
};
```

Construction creates an empty stack. Push adds a value; pop removes the top; top reads it; getMin returns the minimum of all current values. Methods act on the same persistent object.

### Examples

```text
MinStack()
push(4)
push(1)
push(1)
getMin() -> 1
pop()
getMin() -> 1
pop()
top() -> 4
getMin() -> 4
```

```text
MinStack()
push(-2147483648)
push(7)
getMin() -> -2147483648
pop()
top() -> -2147483648
```

Constructor, push and pop return no value; the trace only shows values for queries.

### Constraints

- Pushed values span the full signed 32-bit range.
- Pop, top and getMin are called only when the stack is nonempty.
- At most 30000 calls are made to push, pop, top and getMin.
