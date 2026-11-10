# Design set with O(1) random access
> Google · Technical Screen · medium · Pattern: Design / Data Structure, Randomized / Probability
> Source: https://prachub.com/interview-questions/design-set-with-o-1-random-access

Design a data structure ("FancySet") that stores unique integers and supports the following operations, each in average O(1) time:

- `add(x)`: Insert value `x` if it is not already present. Return whether the insert happened.
- `delete(x)`: Remove value `x` if it exists. Return whether a deletion happened.
- `getRandom()`: Return a uniformly random element currently in the set.

Requirements / follow-ups:
- All operations should be average O(1).
- Handle corner cases such as calling `getRandom()` on an empty set (define and justify behavior).
- Discuss how you would make this data structure thread-safe. Compare using a single lock for the whole set vs finer-grained locking (e.g., element-level locks), and explain trade-offs.

<details><summary>Hints (spoiler)</summary>

1. You need both fast membership/index lookup and fast access by numeric position. What two data structures combine to give that?
2. Deleting from the middle of an array is expensive unless you replace the removed element with the last element and update that last element's stored index.
</details>
