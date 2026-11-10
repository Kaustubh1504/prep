# Design compressed vector and compute dot product
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · easy · Pattern: Design / Data Structure

## Problem
Very long integer vectors often consist of long runs of repeated values. Design a `CompressedVector` class that stores a vector in **run-length encoded** form and supports a dot product **without decompressing** either vector.

Requirements:
- `CompressedVector(nums)` builds the compressed form of a plain list. Adjacent equal values must be merged into a single run, so the internal list `runs` holds `(value, count)` pairs with `count >= 1` and no two adjacent runs sharing a value.
- `CompressedVector.from_runs(runs)` builds a vector directly from `(value, count)` pairs (which may be enormous); it normalises the input by dropping zero-length runs and merging adjacent runs with equal values. A negative count raises `ValueError`.
- `len(v)` returns the logical (decompressed) length.
- Iterating over `v` (`for x in v`) yields the logical elements one by one, lazily.
- `v.dot(w)` returns `sum(v[i] * w[i])` over all logical positions. The two vectors' run boundaries generally do **not** line up. If the logical lengths differ, raise `ValueError`. The dot product of two empty vectors is `0`.

Results can exceed 64 bits (Python integers are unbounded; in Java/C++ discuss overflow and use `long`/128-bit or `BigInteger` as appropriate).

## Function signature
```python
from typing import Iterator, List, Tuple

class CompressedVector:
    def __init__(self, nums: List[int]): ...
    @classmethod
    def from_runs(cls, runs: List[Tuple[int, int]]) -> "CompressedVector": ...
    def __len__(self) -> int: ...
    def __iter__(self) -> Iterator[int]: ...
    def dot(self, other: "CompressedVector") -> int: ...
```

## Constraints
- Number of runs per vector `<= 10^5`
- Logical length up to `10^15` (via `from_runs`); `-10^9 <= value <= 10^9`
- `dot` must run in O(runs(v) + runs(w))

## Examples
**Example 1**
Input: `u = CompressedVector([1,1,1,2,2,3])`, `v = CompressedVector([4,4,5,5,5,5])`, `u.dot(v)`
Output: `u.runs = [(1,3),(2,2),(3,1)]`, `v.runs = [(4,2),(5,4)]`, dot = `48`
Explanation: Overlapping segments: `1·4·2 + 1·5·1 + 2·5·2 + 3·5·1 = 8 + 5 + 20 + 15 = 48`.

**Example 2** (huge runs, misaligned boundaries)
Input: `a = from_runs([(2, 10^9), (0, 5)])`, `b = from_runs([(3, 5·10^8), (7, 5·10^8 + 5)])`, `a.dot(b)`
Output: `10000000000`
Explanation: `2·3·5·10^8 + 2·7·5·10^8 + 0·7·5 = 3·10^9 + 7·10^9`. Decompressing would need a billion elements.

**Example 3** (edge cases)
Input: `from_runs([(5,0),(1,2),(1,1)]).runs`; `CompressedVector([]).dot(CompressedVector([]))`; `CompressedVector([1,1,1,2,2,3]).dot(CompressedVector([1]))`
Output: `[(1,3)]`; `0`; raises `ValueError`
Explanation: The zero-length run is dropped and equal neighbours are merged; empty vectors have dot product 0; mismatched lengths are rejected.

<details><summary>Approach (spoiler)</summary>

Store the vector as a list of `(value, count)` runs, merging on append so the representation is canonical. For the dot product, walk both run lists with two pointers, tracking how much of each current run has been consumed. At each step the overlap is `min(remaining_a, remaining_b)`; add `value_a * value_b * overlap` and advance whichever run (or both) is exhausted. Each step finishes at least one run, so the loop runs at most `runs(a) + runs(b)` times regardless of the logical length. A sparse vector is the special case where most runs have value 0.
**Time:** O(r1 + r2) for `dot`, O(r) for `len` (cache it if called often) · **Space:** O(r)

```python
from typing import Iterator, List, Tuple

class CompressedVector:
    def __init__(self, nums: List[int]):
        self.runs: List[Tuple[int, int]] = []   # (value, count), adjacent values differ
        for x in nums:
            self._append(x, 1)

    @classmethod
    def from_runs(cls, runs: List[Tuple[int, int]]) -> "CompressedVector":
        cv = cls([])
        for value, count in runs:
            if count < 0:
                raise ValueError("run length must be non-negative")
            if count:
                cv._append(value, count)
        return cv

    def _append(self, value: int, count: int) -> None:
        if self.runs and self.runs[-1][0] == value:
            self.runs[-1] = (value, self.runs[-1][1] + count)
        else:
            self.runs.append((value, count))

    def __len__(self) -> int:
        return sum(c for _, c in self.runs)

    def __iter__(self) -> Iterator[int]:
        for value, count in self.runs:
            for _ in range(count):
                yield value

    def dot(self, other: "CompressedVector") -> int:
        if len(self) != len(other):
            raise ValueError("vectors must have the same length")
        a, b = self.runs, other.runs
        i = j = 0
        used_a = used_b = 0          # how much of the current run has been consumed
        total = 0
        while i < len(a) and j < len(b):
            take = min(a[i][1] - used_a, b[j][1] - used_b)
            total += a[i][0] * b[j][0] * take
            used_a += take
            used_b += take
            if used_a == a[i][1]:
                i, used_a = i + 1, 0
            if used_b == b[j][1]:
                j, used_b = j + 1, 0
        return total
```
</details>
