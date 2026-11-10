# Minimum Cars for Rental Requests
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Intervals / Sweep Line, Heap / Top-K

## Problem
A car rental company receives a batch of rental requests. Each request is a tuple `(request_id, pickup_time, return_time)` with a **unique** `request_id` and integer times satisfying `pickup_time < return_time`. A car rented by a request is unavailable during `[pickup_time, return_time)`; a car returned at time `t` can be picked up again by another request at time `t`.

Find the **minimum number of cars** the company needs to satisfy every request, and produce one concrete assignment of cars to requests that achieves it.

Assignment rules (to make the output deterministic):
- Process requests in order of `pickup_time`, breaking ties by `request_id` (string order).
- Cars are numbered `0, 1, 2, ...` in the order they are first needed.
- When a request is processed, give it the **lowest-numbered** car that is free at its pickup time; only if none is free, bring a new car into service.

Return `(num_cars, assignment)` where `assignment` maps each `request_id` to its car number. An empty request list needs `0` cars. If any request has `pickup_time >= return_time`, raise `ValueError`.

## Function signature
```python
from typing import Dict, List, Tuple

def min_cars(requests: List[Tuple[str, int, int]]) -> Tuple[int, Dict[str, int]]:
    ...
```

## Constraints
- `0 <= len(requests) <= 10^5`
- `0 <= pickup_time < return_time <= 10^9`
- `request_id` values are unique strings

## Examples
**Example 1**
Input: `requests = [("r1",1,4), ("r2",2,5), ("r3",4,7), ("r4",5,6), ("r5",8,9)]`
Output: `(2, {"r1": 0, "r2": 1, "r3": 0, "r4": 1, "r5": 0})`
Explanation: At most two rentals overlap at any moment (e.g. at time 2). Car 0 is returned by `r1` at 4 exactly when `r3` picks up; car 1 is returned by `r2` at 5 when `r4` picks up; by time 8 both are free and the lowest-numbered car 0 is reused.

**Example 2** (an edge case)
Input: `requests = [("a",0,10), ("b",0,10), ("c",10,20)]`
Output: `(2, {"a": 0, "b": 1, "c": 0})`
Explanation: `a` and `b` overlap fully, so two cars are needed. A return at time 10 frees the car for a pickup at time 10, so `c` reuses car 0. (With `requests = []` the answer is `(0, {})`.)

<details><summary>Approach (spoiler)</summary>

Sort by pickup time and sweep. Keep a min-heap of busy cars keyed by return time and a min-heap of free car numbers. Before handling a request, move every car whose return time is `<= pickup` from busy to free; then take the smallest free car, or open a new one if none is free. A new car is opened only when every existing car is busy at that pickup instant, so the count equals the maximum number of simultaneously active rentals — a lower bound for any valid schedule — which proves optimality.
**Time:** O(n log n) · **Space:** O(n)

```python
import heapq
from typing import Dict, List, Tuple

def min_cars(requests: List[Tuple[str, int, int]]) -> Tuple[int, Dict[str, int]]:
    order = sorted(requests, key=lambda r: (r[1], r[0]))
    free = []   # car numbers available now
    busy = []   # (return_time, car)
    assignment: Dict[str, int] = {}
    cars = 0
    for rid, pickup, ret in order:
        if pickup >= ret:
            raise ValueError(f"request {rid}: pickup must be before return")
        while busy and busy[0][0] <= pickup:
            heapq.heappush(free, heapq.heappop(busy)[1])
        if free:
            car = heapq.heappop(free)
        else:
            car = cars
            cars += 1
        assignment[rid] = car
        heapq.heappush(busy, (ret, car))
    return cars, assignment
```
</details>
