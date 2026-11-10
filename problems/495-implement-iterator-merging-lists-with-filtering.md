# Implement iterator merging lists with filtering
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Design / Data Structure

## Problem
You are given several lists (or, more generally, iterables) of integer IDs and a set of **blocked** IDs. Implement an iterator that **merges** the lists by taking elements **round-robin**: the first element of list 0, then of list 1, ..., then the second element of list 0, and so on. Lists that run out are skipped; the relative order of elements within each list is preserved.

While merging, the iterator must:
- **skip blocked IDs** — they are never returned;
- **skip duplicates** — each ID is returned at most once, at its first (non-blocked) occurrence in merge order.

Taking an element from a list uses up that list's turn even if the element is skipped. The iterator must be **lazy**: it must not pre-compute the merged output or copy the input lists (inputs may be generators or very long), and `has_next()` must be idempotent (calling it repeatedly does not consume anything). `next()` raises `StopIteration` when nothing is left. The class should also work with Python's `for` loop.

## Function signature
```python
from typing import Iterable, List, Set

class MergedFilteredIterator:
    def __init__(self, lists: List[Iterable[int]], blocked: Set[int]): ...
    def has_next(self) -> bool: ...
    def next(self) -> int: ...
```

## Constraints
- `0 <= number of lists <= 10^4`
- Total number of elements `<= 10^6`
- IDs and blocked IDs are integers in `[-10^9, 10^9]`

## Examples
**Example 1**
Input: `lists = [[1,2,3],[4,5],[6,7,8,9]]`, `blocked = {5, 8}`
Output: `[1, 4, 6, 2, 7, 3, 9]`
Explanation: Round 1 takes `1, 4, 6`. Round 2 takes `2`, skips the blocked `5`, takes `7`. Round 3: `3`, list 1 is exhausted, `8` is blocked. Round 4: `9`.

**Example 2** (duplicates)
Input: `lists = [[1,2,1],[2,3],[3]]`, `blocked = {}`
Output: `[1, 2, 3]`
Explanation: Merge order is `1,2,3,2,3,1`; repeats are dropped.

**Example 3** (edge cases)
Input: `lists = [[1,2],[],[2,4]]`, `blocked = {1, 4}`
Output: `[2]`
Explanation: An empty list is simply skipped. With `lists = [[7,7,7]]`, `blocked = {7}`, `has_next()` returns `False` immediately; `lists = []` yields nothing.

**Example 4** (idempotent `has_next`)
Input: `it = MergedFilteredIterator([[1],[2]], set())`; `it.has_next(), it.has_next(), it.next(), it.next(), it.has_next()`
Output: `True, True, 1, 2, False`

<details><summary>Approach (spoiler)</summary>

Keep a deque of the underlying iterators in round-robin order. To find the next result, pop the front iterator and pull one element: if the iterator is exhausted, drop it; otherwise push it to the back (its turn is used) and accept the element only if it is neither blocked nor already in a `seen` set. Cache the accepted element in a one-slot "pending" buffer so `has_next()` can look ahead without consuming, and `next()` just hands out the buffer. Each input element is pulled exactly once, so the amortized cost per element is O(1).
**Time:** O(1) amortized per input element (O(total + lists) overall) · **Space:** O(lists + distinct yielded IDs + blocked)

```python
from collections import deque
from typing import Iterable, Iterator, List, Optional, Set

class MergedFilteredIterator:
    def __init__(self, lists: List[Iterable[int]], blocked: Set[int]):
        self._active = deque(iter(lst) for lst in lists)   # round-robin order
        self._blocked = set(blocked)
        self._seen: Set[int] = set()
        self._pending: Optional[int] = None
        self._has_pending = False

    def _advance(self) -> None:
        # Find the next ID that is neither blocked nor already yielded.
        while not self._has_pending and self._active:
            it = self._active.popleft()
            for x in it:
                # Took one element from this list: its turn is used up.
                self._active.append(it)
                if x not in self._blocked and x not in self._seen:
                    self._seen.add(x)
                    self._pending, self._has_pending = x, True
                break
            # if the for-loop found nothing, the list is exhausted and is dropped

    def has_next(self) -> bool:
        self._advance()
        return self._has_pending

    def next(self) -> int:
        if not self.has_next():
            raise StopIteration
        self._has_pending = False
        return self._pending

    def __iter__(self) -> Iterator[int]:
        return self

    def __next__(self) -> int:
        return self.next()
```
</details>
