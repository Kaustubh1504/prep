# Minimize calls to find all bad test pairs
> Google · Technical Screen · medium · Pattern: Binary Search
> Source: https://prachub.com/interview-questions/minimize-calls-to-find-all-bad-test-pairs

You have \(n\) atomic tests \(t_1, t_2, \dots, t_n\).

You are given access to a black-box function:

```python
bool runTest(set<Test> S)
```

which behaves as follows:

- `runTest(S) == True` if the subset \(S\) contains **no** incompatible (bad) pair of tests.
- `runTest(S) == False` if the subset \(S\) contains **at least one** incompatible (bad) pair of tests.

There is some unknown set of unordered **bad pairs** \((t_i, t_j)\), where \(i\ne j\). You do **not** know in advance which pairs are bad or how many bad pairs there are.

Your goal is to discover **all** bad pairs while making as few calls to `runTest` as possible. You may adaptively choose each subset \(S\) based on the results of previous calls.

### Tasks

1. Design an algorithm that, using only calls to `runTest`, finds **all** bad pairs \((t_i, t_j)\).
2. Analyze the number of calls to `runTest` your algorithm requires, as a function of:
   - \(n\): the total number of tests, and
   - \(k\): the total number of bad pairs.
3. Argue why your algorithm is correct (i.e., why it will eventually find every bad pair and not report any good pair as bad).

You do not need to provide full production code, but describe the algorithm clearly enough that it could be implemented.

<details><summary>Hints (spoiler)</summary>

1. If a candidate set C is internally compatible, then runTest({v} union C) tells you whether v conflicts with at least one element of C.
2. Process tests from right to left so that when handling v, all bad pairs inside the suffix v + 1 ... n - 1 are already known and can be used to build compatible groups.
</details>
