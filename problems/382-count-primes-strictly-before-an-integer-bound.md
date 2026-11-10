# Count Primes Strictly before an Integer Bound
> Google · Other · medium · Pattern: Math / Number Theory
> Source: https://prachub.com/interview-questions/count-primes-strictly-before-an-integer-bound

### Problem

Return how many prime numbers are strictly smaller than n. A prime is an integer at least 2 whose only positive divisors are 1 and itself. Do not include n even when it is prime.

```cpp
int countPrimes(int n);
```

### Examples

```text
Input: n = 12
Output: 5
```

The primes are 2,3,5,7,11.

```text
Input: n = 2
Output: 0
```

### Constraints

- `0 <= n <= 5000000`.
