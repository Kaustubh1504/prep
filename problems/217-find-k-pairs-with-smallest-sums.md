# Find k pairs with smallest sums
> Google · Technical Screen · easy · Pattern: Heap / Top-K
> Source: https://prachub.com/interview-questions/find-k-pairs-with-smallest-sums

You are given two **sorted** integer arrays `arr1` and `arr2` (each sorted in non-decreasing order), and an integer `k`.

Consider all possible pairs formed by taking one element from `arr1` and one element from `arr2`. For indices `i` and `j`, the pair is `(arr1[i], arr2[j])` with sum `arr1[i] + arr2[j]`.

Your task is to return the **k pairs** `(arr1[i], arr2[j])` with the smallest sums. If there are fewer than `k` total possible pairs, return all possible pairs.

You may return the pairs in any order.

---
### Function Signature (one possible form)
```text
kSmallestPairs(arr1: List[int], arr2: List[int], k: int) -> List[Tuple[int, int]]
```

---
### Example
```text
arr1 = [1, 7, 11]
arr2 = [2, 4, 6]
k = 3
```
All possible pairs and their sums are:
- (1, 2) -> 3
- (1, 4) -> 5
- (1, 6) -> 7
- (7, 2) -> 9
- (7, 4) -> 11
- (7, 6) -> 13
- (11, 2) -> 13
- (11, 4) -> 15
- (11, 6) -> 17

The 3 pairs with the smallest sums are:
```text
[(1, 2), (1, 4), (1, 6)]
```
(The order among these returned pairs does not matter.)

Explain an efficient algorithm to solve this problem and analyze its time and space complexity. You may assume the arrays are large, so a solution that explicitly generates and sorts all `len(arr1) * len(arr2)` pairs is too slow.

<details><summary>Hints (spoiler)</summary>

1. Seed a min-heap with the first pair from each arr1 index.
2. After popping (i,j), push (i,j+1).
</details>
