# Implement a Reusable Locker Allocation System
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Design / Data Structure, Heap / Top-K

## Problem
Implement a bank of `capacity` package lockers numbered `1..capacity`.

- `store(package_id)` — place the package in the **lowest-numbered empty locker** and return that locker number. Reject the store and return `-1` (changing nothing) if the bank is full, `package_id` is empty, or a package with the same id is currently stored.
- `pickup(locker)` — remove and return the package id in `locker`, freeing the locker **immediately** so the very next `store` can reuse it. Return `None` (changing nothing) if `locker` is out of range or empty, including a second pickup of the same locker.
- `last_successful_store()` — return `(package_id, locker)` for the most recent store that succeeded, or `None` if none has. Rejected stores and pickups never change this value (pickups of that package also leave it unchanged; it is a record of the last store, not of current contents).

A package id may be stored again after it has been picked up.

## Function signature
```python
from typing import Optional, Tuple

class LockerBank:
    def __init__(self, capacity: int): ...
    def store(self, package_id: str) -> int: ...
    def pickup(self, locker: int) -> Optional[str]: ...
    def last_successful_store(self) -> Optional[Tuple[str, int]]: ...
```

## Constraints
- `0 <= capacity <= 10^5`
- Up to `2·10^5` operations in total
- Each operation should run in O(log capacity)

## Examples
**Example 1**
Input:
```
b = LockerBank(3)
b.store("p1"), b.store("p2"), b.store("p3"), b.store("p4")
b.pickup(2), b.store("p5"), b.pickup(2), b.pickup(2), b.store("p1")
b.last_successful_store()
```
Output:
```
1, 2, 3, -1
"p2", 2, "p5", None, -1
("p5", 2)
```
Explanation: `p4` is rejected because the bank is full. Picking up locker 2 frees it, so `p5` gets locker 2 (the lowest free). The second pickup of locker 2 in a row finds it empty. Storing `p1` again fails because `p1` is still in locker 1, and the failed store leaves `("p5", 2)` as the last success.

**Example 2** (invalid operations)
Input:
```
b = LockerBank(2)
b.last_successful_store(), b.pickup(1), b.pickup(7), b.store(""), b.store("a"), b.store("a"), b.last_successful_store()
```
Output: `None, None, None, -1, 1, -1, ("a", 1)`

**Example 3** (zero capacity)
Input: `LockerBank(0).store("x")` → Output: `-1`

<details><summary>Approach (spoiler)</summary>

Keep a min-heap of free locker numbers (initially `1..capacity`, which is already heap-ordered), plus two hash maps: `package -> locker` for duplicate detection and `locker -> package` for pickups. `store` validates, pops the smallest free locker and records it; `pickup` validates, deletes both map entries and pushes the locker back onto the heap. Update `last` only on a successful store, after all checks pass, so rejected operations cannot corrupt it.
**Time:** O(log capacity) per store/pickup, O(1) for `last_successful_store` · **Space:** O(capacity)

```python
import heapq
from typing import Dict, List, Optional, Tuple

class LockerBank:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.free: List[int] = list(range(1, capacity + 1))   # already a valid min-heap
        self.locker_of: Dict[str, int] = {}
        self.package_in: Dict[int, str] = {}
        self.last: Optional[Tuple[str, int]] = None

    def store(self, package_id: str) -> int:
        if not package_id or package_id in self.locker_of or not self.free:
            return -1
        locker = heapq.heappop(self.free)
        self.locker_of[package_id] = locker
        self.package_in[locker] = package_id
        self.last = (package_id, locker)
        return locker

    def pickup(self, locker: int) -> Optional[str]:
        pkg = self.package_in.pop(locker, None)
        if pkg is None:
            return None
        del self.locker_of[pkg]
        heapq.heappush(self.free, locker)
        return pkg

    def last_successful_store(self) -> Optional[Tuple[str, int]]:
        return self.last
```
</details>
