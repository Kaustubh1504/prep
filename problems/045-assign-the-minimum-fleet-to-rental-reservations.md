# Assign the Minimum Fleet to Rental Reservations
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Easy · Pattern: Intervals / Sweep Line, Heap / Top-K

## Problem
A car-rental company receives a list of reservations. Each reservation is `(reservation_id, pickup_time, return_time)` with `pickup_time < return_time`. A vehicle is busy during the half-open interval `[pickup_time, return_time)`: a vehicle returned at time `t` can be picked up by another reservation at exactly time `t`.

Vehicles are numbered `1, 2, 3, ...`. Assign every reservation to a vehicle so that no vehicle serves two overlapping reservations, using the **minimum possible number of vehicles**. To make the assignment deterministic, follow these rules exactly:
1. Process reservations in order of `pickup_time`, then `return_time`, then `reservation_id` (all ascending).
2. When processing a reservation, every vehicle whose current reservation has `return_time <= pickup_time` becomes available.
3. If any vehicle is available, assign the **lowest-numbered** available vehicle. Otherwise add a new vehicle numbered `fleet_size + 1`.

Return a pair `(fleet_size, assignment)` where `assignment` is a list of `(reservation_id, vehicle_number)` pairs sorted by `reservation_id`. For no reservations, return `(0, [])`.

## Function signature
```python
from typing import List, Tuple

def assign_fleet(reservations: List[Tuple[str, int, int]]) -> Tuple[int, List[Tuple[str, int]]]:
    ...
```

## Constraints
- `0 <= len(reservations) <= 10^5`
- `0 <= pickup_time < return_time <= 10^9`
- Reservation ids are unique non-empty strings

## Examples
**Example 1**
Input: `reservations = [("r1",1,4),("r2",2,6),("r3",4,7),("r4",6,9),("r5",7,8)]`
Output: `(2, [("r1",1),("r2",2),("r3",1),("r4",2),("r5",1)])`
Explanation: At most two reservations overlap at any time. `r3` picks up at 4 exactly when vehicle 1 is returned; `r4` reuses vehicle 2 at time 6; `r5` reuses vehicle 1 at time 7.

**Example 2** (identical times: tie broken by id)
Input: `reservations = [("b",5,10),("a",5,10),("c",10,12)]`
Output: `(2, [("a",1),("b",2),("c",1)])`
Explanation: `a` is processed before `b`, so it gets vehicle 1. At time 10 both vehicles are free and `c` takes the lowest number.

**Example 3** (lowest-numbered free vehicle)
Input: `reservations = [("x",1,3),("y",3,5),("z",2,3)]`
Output: `(2, [("x",1),("y",1),("z",2)])`

<details><summary>Approach (spoiler)</summary>

Sort by `(pickup, return, id)` and sweep. Keep a min-heap of busy vehicles keyed by return time and a min-heap of free vehicle numbers. Before each reservation, move every busy vehicle with `return <= pickup` into the free heap; take the smallest free number or open a new vehicle. A new vehicle is only opened when every existing vehicle is busy at `pickup`, so the fleet size equals the maximum overlap, which is optimal.
**Time:** O(n log n) · **Space:** O(n)

```python
import heapq
from typing import List, Tuple

def assign_fleet(reservations: List[Tuple[str, int, int]]) -> Tuple[int, List[Tuple[str, int]]]:
    order = sorted(reservations, key=lambda r: (r[1], r[2], r[0]))
    busy = []   # (return_time, vehicle)
    free = []   # vehicle numbers available, smallest first
    fleet = 0
    out = []
    for rid, pickup, ret in order:
        while busy and busy[0][0] <= pickup:
            heapq.heappush(free, heapq.heappop(busy)[1])
        if free:
            v = heapq.heappop(free)
        else:
            fleet += 1
            v = fleet
        out.append((rid, v))
        heapq.heappush(busy, (ret, v))
    out.sort()
    return fleet, out
```
</details>
