# Consolidate On-Call Rotation Segments
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Online Assessment · Medium · Pattern: Intervals / Sweep Line

## Problem
An on-call schedule is given as a list of segments `(name, start, end)`, meaning `name` is on call during the half-open time interval `[start, end)`. Segments are unsorted. They can overlap, both across people and for the same person. A segment with `start == end` is empty and should be ignored.

Produce the consolidated timeline: a list of `(start, end, names)` tuples where
- `names` is the sorted list of **distinct** people on call throughout `[start, end)`, and is non-empty,
- the set of on-call people is constant within each output segment,
- two consecutive output segments that touch (`prev.end == next.start`) always have **different** name sets. Merge them when their sets are equal, including when one person's back-to-back or overlapping segments cause the boundary,
- times when nobody is on call are omitted,
- the output is sorted by `start`.

## Function signature
```python
def consolidate_rotations(segments: list[tuple[str, int, int]]) -> list[tuple[int, int, list[str]]]:
```

## Constraints
- `0 <= len(segments) <= 10^5`
- `0 <= start <= end <= 10^9`
- Names are non-empty strings
- Target: O(n log n) to sort the events, plus the size of the output

## Examples
**Example 1**
Input: `segments = [("Abby",1,10), ("Ben",5,7), ("Carla",6,12), ("David",15,17)]`
Output: `[(1,5,["Abby"]), (5,6,["Abby","Ben"]), (6,7,["Abby","Ben","Carla"]), (7,10,["Abby","Carla"]), (10,12,["Carla"]), (15,17,["David"])]`
Explanation: Nobody is on call during `[12,15)`, so that gap is left out.

**Example 2** (one person's segments that overlap or touch are merged)
Input: `segments = [("Abby",1,4), ("Abby",4,6), ("Ben",2,3), ("Abby",5,8)]`
Output: `[(1,2,["Abby"]), (2,3,["Abby","Ben"]), (3,8,["Abby"])]`
Explanation: From 3 to 8 Abby is the only person on call. The boundaries at 4, 5 and 6 don't change the set, so they disappear.

**Example 3** (empty input and zero-length segments)
Input: `segments = [("Abby",3,3)]`
Output: `[]`

Input: `segments = []`
Output: `[]`

<details><summary>Approach (spoiler)</summary>

Sweep over endpoint events: `+1` for a name at `start`, `-1` at `end`. Sort the events by time and apply all events with the same timestamp together. Keep a multiset (a Counter) of active names, so that one person's overlapping segments are counted correctly. Between two consecutive event times, emit a segment if the active set is non-empty. If the previous output segment ends at the same time and has the same name set, extend it instead of adding a new one. Applying all same-time events before emitting means you never produce zero-length segments.

**Time:** O(n log n + output) · **Space:** O(n)

```python
from collections import Counter

def consolidate_rotations(segments):
    events = []
    for name, s, e in segments:
        if s < e:
            events.append((s, 1, name))
            events.append((e, -1, name))
    events.sort(key=lambda x: x[0])
    active = Counter()
    out = []
    i, n, prev_t = 0, len(events), None
    while i < n:
        t = events[i][0]
        if prev_t is not None and active:
            names = sorted(active)
            if out and out[-1][1] == prev_t and out[-1][2] == names:
                out[-1][1] = t
            else:
                out.append([prev_t, t, names])
        while i < n and events[i][0] == t:
            _, delta, name = events[i]
            active[name] += delta
            if active[name] == 0:
                del active[name]
            i += 1
        prev_t = t
    return [tuple(x) for x in out]
```
</details>
