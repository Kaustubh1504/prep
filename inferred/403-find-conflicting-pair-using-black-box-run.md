# Find conflicting pair using black-box run()
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · hard · Pattern: Binary Search, Design / Data Structure

## Problem
A test suite contains `n` distinct test IDs `tests`. Every test passes on its own, but **exactly one pair** of tests conflicts: a run fails if and only if **both** tests of that pair are included in the same run. Which other tests are in the run, and their order, does not matter.

You cannot inspect the tests; you can only call a costly black-box oracle:

- `run(subset) -> bool` — executes the given sub-list of tests and returns `True` if the run **fails** (both conflicting tests are in `subset`), `False` if it passes.

Return the conflicting pair as a tuple `(x, y)` ordered by their position in `tests` (`x` appears before `y`). Minimise the number of `run` calls: your solution should use `O(log n)` calls — at most `2 * ceil(log2 n)`. You may assume `run(tests)` fails (the pair exists). With `n == 2` the answer is known without any call.

## Function signature
```python
from typing import Callable, List, Tuple

def find_conflicting_pair(tests: List[int], run: Callable[[List[int]], bool]) -> Tuple[int, int]:
    ...
```

## Constraints
- `2 <= n <= 10^5`; test IDs are distinct integers
- Exactly one conflicting pair exists
- Each `run` call is expensive; the number of calls is the main cost measure (the total size of subsets passed is O(n log n))

## Examples
**Example 1**
Input: `tests = [10,20,30,40,50,60,70,80]`, hidden conflicting pair `{30, 70}`
Output: `(30, 70)` using 6 calls
Explanation: Binary search for the shortest failing prefix: `[10..50]` passes, `[10..70]` fails, `[10..60]` passes, so the shortest failing prefix ends at 70, which must be one culprit. Then binary search the start of the shortest failing window ending at 70: `[40..70]` passes, `[20..70]` fails, `[30..70]` fails, so 30 is the other culprit.

**Example 2** (an edge case)
Input: `tests = [4, 9]`, hidden pair `{9, 4}`
Output: `(4, 9)` using 0 calls
Explanation: With only two tests, they must be the pair; the result is ordered by position in `tests`.

**Example 3**
Input: `tests = [0, 1, ..., 999]`, hidden pair `{999, 0}`
Output: `(0, 999)` using 18 calls (≤ `2 * ceil(log2 1000) = 20`)

<details><summary>Approach (spoiler)</summary>

Failure of a prefix is monotone: `tests[:p]` fails iff it contains the later culprit (the earlier one is then included automatically). So binary search the smallest failing prefix length `p`; `tests[p-1]` is the later culprit. Now consider windows `tests[s:p]`, which all contain the later culprit; they fail iff `s` is at or before the earlier culprit — again monotone — so binary search the largest failing `s`, and `tests[s]` is the earlier culprit. Each phase is a binary search over at most `n` positions, giving at most `2·ceil(log2 n)` calls, which matches the information-theoretic lower bound of `log2(n choose 2) ≈ 2 log2 n` up to a constant.
**Time:** O(log n) oracle calls, O(n log n) total subset size · **Space:** O(n) per subset passed

```python
from typing import Callable, List, Tuple

def find_conflicting_pair(tests: List[int], run: Callable[[List[int]], bool]) -> Tuple[int, int]:
    n = len(tests)
    # 1) Smallest p such that tests[:p] fails -> tests[p-1] is the later culprit.
    lo, hi = 2, n
    while lo < hi:
        mid = (lo + hi) // 2
        if run(tests[:mid]):
            hi = mid
        else:
            lo = mid + 1
    p = lo
    # 2) Largest s such that tests[s:p] still fails -> tests[s] is the earlier culprit.
    lo, hi = 0, p - 2
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if run(tests[mid:p]):
            lo = mid
        else:
            hi = mid - 1
    return tests[lo], tests[p - 1]


# Example oracle used for testing:
def make_run(a: int, b: int) -> Callable[[List[int]], bool]:
    def run(subset: List[int]) -> bool:
        s = set(subset)
        return a in s and b in s
    return run
```
</details>
