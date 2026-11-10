# Deduplicate and Order Batch and Streaming Logs
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · HR Screen · Medium · Pattern: Simulation

## Problem
A log event is a pair `(timestamp, message)`. `timestamp` is an integer and `message` is a non-empty string, compared exactly and case-sensitively. Events can arrive **out of timestamp order**, possibly arbitrarily late, and the same message can arrive many times. Two deduplication policies are supported:

- **`"FIRST"`**: keep the occurrence of a message that **arrived first**, and ignore later arrivals of it.
- **`"LATEST"`**: keep the occurrence with the **greatest timestamp**. If two occurrences have the same timestamp, the one that arrived later wins.

Output ordering: deduplicated events are emitted in increasing `timestamp` order. Ties are broken by `message` in lexicographic order. After deduplication there is at most one pending event per message, so this order is total and deterministic.

**Part 1: batch.** Given the full list of events in arrival order, return the deduplicated events in output order.

**Part 2: streaming.** Implement a class with these operations:
- `add(timestamp, message)`: an event arrives.
- `get_next()`: remove and return the smallest pending event in output order, or `None` if nothing is pending.

In streaming mode, deduplication applies to **pending (unconsumed)** events only. Once an event for a message has been returned by `get_next`, the next arrival of that message is treated as new. While a message is pending:
- Under `"FIRST"`, a new arrival of that message is ignored.
- Under `"LATEST"`, a new arrival with `timestamp >=` the pending timestamp replaces it, and the old version becomes stale and must never be emitted. A new arrival with a smaller timestamp is ignored.

An event that arrives late (with a timestamp earlier than events already emitted) is still accepted and is emitted by the next `get_next`. The ordering guarantee only covers events pending at the same time.

Part 1 should equal "add everything, then call `get_next` until it returns `None`". Support up to 200,000 total operations efficiently.

*Follow-up discussion:* how would you expire deduplication state after a fixed time window when events can arrive arbitrarily late? (For example: keep a per-message last-seen timestamp, evict entries older than `now - window` using a heap keyed by timestamp, and decide what to do with events that are later than the window.)

## Function signature
```python
def dedupe_batch(events: list[tuple[int, str]], policy: str) -> list[tuple[int, str]]: ...

class StreamingDeduper:
    def __init__(self, policy: str): ...            # "FIRST" or "LATEST"
    def add(self, timestamp: int, message: str) -> None: ...
    def get_next(self) -> tuple[int, str] | None: ...
```

## Constraints
- Up to `2 * 10^5` total `add` / `get_next` calls, or batch events
- `0 <= timestamp <= 10^9`
- `1 <= len(message) <= 100`
- Target: O(log n) amortised per operation

## Examples
**Example 1** (batch, both policies)
Input: `events = [(5,"disk full"),(3,"cpu hot"),(9,"disk full"),(3,"net down"),(1,"disk full")]`
Output (`"FIRST"`): `[(3,"cpu hot"),(3,"net down"),(5,"disk full")]`
Output (`"LATEST"`): `[(3,"cpu hot"),(3,"net down"),(9,"disk full")]`
Explanation: Under FIRST, the `5` arrived first among the `"disk full"` events. Under LATEST, `9` is the greatest timestamp. The two events at timestamp 3 are ordered by message.

**Example 2** (streaming: stale versions and late events)
Operations, policy `"LATEST"`:
`add(10,"a")`, `add(4,"b")`, `get_next()`, `add(12,"a")`, `add(2,"c")`, `get_next()`, `get_next()`, `add(1,"a")`, `get_next()`, `get_next()`
Output of the `get_next` calls: `[(4,"b"), (2,"c"), (12,"a"), (1,"a"), None]`
Explanation: `(12,"a")` replaces the pending `(10,"a")`, which is never emitted. `(2,"c")` arrives late but is emitted next. After `"a"` is consumed, `(1,"a")` counts as a new event.

With policy `"FIRST"`, the same operations give: `[(4,"b"), (2,"c"), (10,"a"), (1,"a"), None]`

**Example 3** (empty)
Input: `dedupe_batch([], "LATEST")`
Output: `[]`

<details><summary>Approach (spoiler)</summary>

Split the state into a **hash map**, which holds the truth, and a **min-heap**, which holds the order. `active[message] = (timestamp, seq)` stores the one valid pending version of each message. The heap stores `(timestamp, message, seq)` entries. On `add`, decide from the map and the policy whether the new event wins. If it does, overwrite the map entry and push it onto the heap; the old heap entry stays behind as a stale "fossil". On `get_next`, pop until you reach an entry that matches `active[message]`, then delete it from the map and return it. This is lazy deletion. To keep memory bounded, rebuild the heap from the map whenever stale entries outnumber live ones. An indexed priority queue or a balanced BST keyed by `(timestamp, message)` avoids stale entries altogether.

**Time:** O(log n) amortised per operation · **Space:** O(n)

```python
import heapq
from itertools import count

class StreamingDeduper:
    def __init__(self, policy):
        if policy not in ("FIRST", "LATEST"):
            raise ValueError("policy must be FIRST or LATEST")
        self.policy = policy
        self.active = {}      # message -> (timestamp, seq) of its pending version
        self.heap = []        # (timestamp, message, seq); may hold stale entries
        self.seq = count()

    def add(self, timestamp, message):
        cur = self.active.get(message)
        if cur is not None and (self.policy == "FIRST" or timestamp < cur[0]):
            return                                    # pending version wins
        s = next(self.seq)
        self.active[message] = (timestamp, s)
        heapq.heappush(self.heap, (timestamp, message, s))
        if len(self.heap) > 2 * len(self.active) + 64:  # compact stale entries
            self.heap = [e for e in self.heap if self.active.get(e[1]) == (e[0], e[2])]
            heapq.heapify(self.heap)

    def get_next(self):
        while self.heap:
            ts, msg, s = heapq.heappop(self.heap)
            if self.active.get(msg) == (ts, s):
                del self.active[msg]
                return (ts, msg)
        return None

def dedupe_batch(events, policy):
    d = StreamingDeduper(policy)
    for ts, msg in events:
        d.add(ts, msg)
    out = []
    while (e := d.get_next()) is not None:
        out.append(e)
    return out
```
</details>
