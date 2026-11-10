# Calculate Highway Tolls from Ordered Checkpoint Logs
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · Medium · Pattern: Simulation

## Problem
A highway has checkpoints numbered `0..n` along a straight line. `segment_fees[i]` is the toll for driving between checkpoint `i` and checkpoint `i+1` (in either direction), so there are `n` segments.

You receive one day's checkpoint log: a chronologically ordered list of records `(plate, checkpoint)`, each saying that vehicle `plate` was seen at `checkpoint`.

For each vehicle, every pair of **consecutive** records `(c1, c2)` for that vehicle is charged the sum of fees of all segments between `c1` and `c2`. Rules:
- Direction does not matter: a vehicle that reverses (e.g. `2 → 1`) is charged for the segments it travelled back over.
- A repeated checkpoint (`c1 == c2`) costs 0.
- A vehicle's first record only establishes its starting position; a vehicle seen only once pays nothing.
- Records for different vehicles are interleaved; each vehicle is tracked independently.

Return the total toll collected across all vehicles for the day.

## Function signature
```python
from typing import List, Tuple

def total_daily_toll(segment_fees: List[int], records: List[Tuple[str, int]]) -> int:
    ...
```

## Constraints
- `1 <= len(segment_fees) <= 10^5`, `0 <= segment_fees[i] <= 10^4`
- `0 <= len(records) <= 10^6`, `0 <= checkpoint <= len(segment_fees)`
- The total fits in a 64-bit integer

## Examples
**Example 1**
Input: `segment_fees = [5,7,2]`, `records = [("A",0),("B",3),("A",2),("A",1),("B",1),("A",1)]`
Output: `28`
Explanation: A: `0→2` costs `5+7 = 12`, `2→1` (reversing) costs `7`, `1→1` costs `0`. B: `3→1` costs `7+2 = 9`. Total `12 + 7 + 0 + 9 = 28`.

**Example 2** (single sighting)
Input: `segment_fees = [4,6]`, `records = [("X",1)]`
Output: `0`

**Example 3** (round trip)
Input: `segment_fees = [3,3,3]`, `records = [("Q",0),("Q",3),("Q",0)]`
Output: `18`

**Example 4** (empty log)
Input: `segment_fees = [1]`, `records = []` → Output: `0`

<details><summary>Approach (spoiler)</summary>

Build prefix sums `prefix[c]` = total fee from checkpoint 0 to `c`; then the toll between any two checkpoints is `|prefix[c2] - prefix[c1]|` in O(1). Walk the log once, keeping a hash map from plate to its last checkpoint; for every record after a vehicle's first, add the prefix-sum difference and update the map.
**Time:** O(n + R) · **Space:** O(n + V) for V distinct vehicles

```python
from typing import List, Tuple

def total_daily_toll(segment_fees: List[int], records: List[Tuple[str, int]]) -> int:
    prefix = [0]
    for fee in segment_fees:
        prefix.append(prefix[-1] + fee)      # prefix[c] = cost from checkpoint 0 to c
    last = {}
    total = 0
    for plate, cp in records:
        if plate in last:
            total += abs(prefix[cp] - prefix[last[plate]])
        last[plate] = cp
    return total
```
</details>
