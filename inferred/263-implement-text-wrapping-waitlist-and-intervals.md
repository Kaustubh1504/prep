# Implement text wrapping, waitlist, and intervals
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Intervals / Sweep Line

## Problem
This onsite round has three independent parts. The overview names word wrapping, a FIFO waitlist that supports deletions, and interval overlap / resource allocation. Each part below uses the most standard version.

### Part 1 — Greedy word wrap
You get a string `text` and a line width `width`. Split `text` into words on whitespace and pack them greedily into lines. Each line holds as many words as fit, with words separated by **one** space and no leading or trailing spaces, and its length is at most `width`. A word longer than `width` is hard-split into chunks of `width` characters, each on its own line. The final chunk may then share a line with the words that follow it. Return the list of lines. If `text` contains no words, return `[]`.

### Part 2 — Waitlist with cancellations
Design a restaurant waitlist with these operations:
- `join(name)`: add a party to the back. If the name is already waiting, return `False`, otherwise `True`.
- `leave(name)`: remove a waiting party from anywhere in the line. Return `False` if it isn't there.
- `serve()`: remove and return the party at the front, or `None` if the waitlist is empty.
- `position(name)`: the party's 1-based position, or `-1` if it isn't waiting.

`join`, `leave` and `serve` must run in O(1). `position` may run in O(n). Discuss how you would speed it up, for example with a Fenwick tree over join order.

### Part 3 — Minimum rooms for overlapping intervals
You get meeting intervals `[start, end)`, which are half-open, so a meeting ending at `t` doesn't overlap one starting at `t`. Return the minimum number of rooms needed to hold all meetings, which equals the maximum number of meetings overlapping at once. A result greater than 1 means some pair of meetings overlaps.

## Function signature
```python
# Part 1
def wrap_text(text: str, width: int) -> list[str]: ...

# Part 2
class Waitlist:
    def join(self, name: str) -> bool: ...
    def leave(self, name: str) -> bool: ...
    def serve(self) -> str | None: ...
    def position(self, name: str) -> int: ...

# Part 3
def min_rooms(intervals: list[list[int]]) -> int: ...
```

## Constraints
- Part 1: `1 <= width <= 10^4`, `0 <= len(text) <= 10^6`
- Part 2: up to `10^5` operations
- Part 3: `0 <= len(intervals) <= 10^5`, `0 <= start < end <= 10^9`

## Examples
**Part 1, Example 1**
Input: `text = "the quick brown fox jumps over the lazy dog", width = 10`
Output: `["the quick", "brown fox", "jumps over", "the lazy", "dog"]`

**Part 1, Example 2** (an edge case: an over-long word)
Input: `text = "a supercalifragilistic word", width = 8`
Output: `["a", "supercal", "ifragili", "stic", "word"]`
Explanation: The long word is cut into 8-character chunks. Its last chunk, `"stic"`, cannot also fit `" word"` within 8 characters, so `"word"` starts a new line.

**Part 1, Example 3** (an edge case)
`wrap_text("   ", 5)` returns `[]`, and `wrap_text("hello", 5)` returns `["hello"]`.

**Part 2**
```
w = Waitlist()
w.join("ann"), w.join("bob"), w.join("cat"), w.join("bob")   -> True, True, True, False
w.position("cat")   -> 3
w.leave("bob")      -> True
w.leave("zed")      -> False
w.position("cat")   -> 2
w.serve(), w.serve(), w.serve()   -> "ann", "cat", None
```

**Part 3**
- `min_rooms([[0,30],[5,10],[15,20]])` returns `2`
- `min_rooms([[1,4],[2,5],[3,6]])` returns `3`
- Edge cases: `min_rooms([[1,5],[5,9]])` returns `1` (the meetings only touch), and `min_rooms([])` returns `0`

<details><summary>Approach (spoiler)</summary>

**Part 1:** Scan the words once. If a word fits on the current line, append it with a space. Otherwise flush the line and start a new one. Before placing a word longer than `width`, emit full `width`-sized chunks of it. Greedy filling is the correct rule for "fill each line as much as possible". **Time** O(len(text)), **Space** O(len(text)).

**Part 2:** An insertion-ordered hash map (`OrderedDict`, or a hash map pointing into a doubly linked list) gives O(1) append, O(1) removal by key, and O(1) pop from the front. **Space** O(n).

**Part 3:** Sort by start time and keep a min-heap of the end times of rooms in use. If the earliest-ending room is free by the current start (`end <= start`), reuse it. Otherwise open a new room. The answer is the heap size. **Time** O(n log n), **Space** O(n).

```python
import heapq
from collections import OrderedDict
from typing import Optional

# Part 1
def wrap_text(text: str, width: int) -> list[str]:
    lines, cur = [], ""
    for word in text.split():
        while len(word) > width:              # hard-split an over-long word
            if cur:
                lines.append(cur)
                cur = ""
            lines.append(word[:width])
            word = word[width:]
        if not word:
            continue
        if not cur:
            cur = word
        elif len(cur) + 1 + len(word) <= width:
            cur += " " + word
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines

# Part 2
class Waitlist:
    def __init__(self) -> None:
        self.q = OrderedDict()                # insertion-ordered hash map = FIFO with O(1) delete

    def join(self, name: str) -> bool:
        if name in self.q:
            return False
        self.q[name] = None
        return True

    def leave(self, name: str) -> bool:
        if name not in self.q:
            return False
        del self.q[name]
        return True

    def serve(self) -> Optional[str]:
        if not self.q:
            return None
        name, _ = self.q.popitem(last=False)
        return name

    def position(self, name: str) -> int:
        for i, n in enumerate(self.q):        # O(n); fine for occasional queries
            if n == name:
                return i + 1
        return -1

# Part 3
def min_rooms(intervals: list[list[int]]) -> int:
    ends = []
    for s, e in sorted(intervals):
        if ends and ends[0] <= s:
            heapq.heapreplace(ends, e)
        else:
            heapq.heappush(ends, e)
    return len(ends)
```
</details>
