# Busiest Rental Car
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · easy · Pattern: Intervals / Sweep Line

## Problem
A rental agency has `n` cars with IDs `0` to `n - 1`, and receives a list of rental requests. `rentals[i] = [pickup_i, return_i]` means the customer takes a car at time `pickup_i` and returns it at `return_i`, with `pickup_i < return_i`. Allocate the cars with these deterministic rules:

1. Handle requests in order of increasing `pickup` time. Break ties by earlier `return` time, then by lower index in the input.
2. A car is **available** for a request if it has never been rented or its last rental was returned at or before the request's pickup time. A car returned at time `t` can be picked up again at `t`.
3. Give the request the available car with the **smallest ID**.
4. If no car is available, **reject** the request. Rejected requests are not delayed or queued.

Return the ID of the car that served the most rentals. If several cars tie, return the smallest ID. If there are no requests, every car has 0 rentals, so the answer is `0`.

## Function signature
```python
def busiest_car(n: int, rentals: list[list[int]]) -> int:
```

## Constraints
- `1 <= n <= 10^5`
- `0 <= len(rentals) <= 10^5`
- `0 <= pickup_i < return_i <= 10^9`

## Examples
**Example 1**
Input: `n = 3, rentals = [[0,10],[1,2],[1,3],[2,5],[3,4],[4,6]]`
Output: `2`
Explanation: [0,10] goes to car 0, [1,2] to car 1 and [1,3] to car 2. [2,5] gets car 1, which was returned at 2. [3,4] gets car 2, returned at 3. [4,6] gets car 2 again, returned at 4. The counts are car 0 = 1, car 1 = 2, car 2 = 3.

**Example 2**
Input: `n = 2, rentals = [[0,10],[1,3],[2,4],[3,5]]`
Output: `1`
Explanation: [0,10] goes to car 0 and [1,3] to car 1. [2,4] is **rejected** because both cars are out. [3,5] gets car 1. Car 1 served 2 rentals and car 0 served 1.

**Example 3** (an edge case)
Input: `n = 2, rentals = [[5,9],[0,3],[3,5]]`
Output: `0`
Explanation: The input is not sorted. Processed in pickup order, car 0 serves all three rentals back to back, because each return time equals the next pickup time.

**Example 4** (an edge case)
Input: `n = 3, rentals = []`
Output: `0`

<details><summary>Approach (spoiler)</summary>

Sort the requests by `(pickup, return, index)` and run an event simulation with two min-heaps. `free` holds the IDs of available cars. `busy` holds `(return_time, car_id)` pairs. Before each request, move every car with `return_time <= pickup` from `busy` back to `free`. Then pop the smallest free ID, or reject the request if `free` is empty. Count the rentals per car and take the maximum, breaking ties by smallest ID.
**Time:** O(m log m + m log n) for m requests · **Space:** O(n + m)

```python
import heapq

def busiest_car(n: int, rentals: list[list[int]]) -> int:
    order = sorted(range(len(rentals)), key=lambda i: (rentals[i][0], rentals[i][1], i))
    free = list(range(n))        # min-heap of available car ids
    busy = []                    # min-heap of (return_time, car_id)
    count = [0] * n
    for i in order:
        start, end = rentals[i]
        while busy and busy[0][0] <= start:      # returned at or before pickup
            _, car = heapq.heappop(busy)
            heapq.heappush(free, car)
        if not free:
            continue                              # no car: request rejected
        car = heapq.heappop(free)
        count[car] += 1
        heapq.heappush(busy, (end, car))
    return max(range(n), key=lambda c: (count[c], -c))
```
</details>
