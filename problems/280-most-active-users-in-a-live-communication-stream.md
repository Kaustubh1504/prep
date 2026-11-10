# Most Active Users in a Live Communication Stream
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Heap / Top-K, Simulation

## Problem
A messaging system emits a stream of delivery events `(message_id, sender, receiver)`. The pipeline delivers **at least once**, so the same `message_id` can show up several times. Only its **first** occurrence counts, and every later copy is ignored.

A user's **activity** is the number of distinct messages they took part in, either as sender or receiver. A message a user sends to themselves (`sender == receiver`) adds 1 to that user's activity, not 2.

### Part 1 — Batch
Given the full list of events and an integer `k`, return the `k` most active users. Order them by activity **descending**, then by user ID **ascending** (lexicographic). If fewer than `k` users exist, return all of them. If `k = 0` or the input is empty, return `[]`.

### Part 2 — Live updates
Wrap the same logic in a streaming class. `record(message_id, sender, receiver)` processes one event and returns `False` if it was a duplicate, otherwise `True`. `top_k(k)` returns the current top-k users with the same ordering, and it can be called at any time between events. Talk about the trade-offs between a cheap `record` and a cheap `top_k`.

## Function signature
```python
# Part 1
def most_active_users(events: list[tuple[str, str, str]], k: int) -> list[str]: ...

# Part 2
class ActivityTracker:
    def record(self, message_id: str, sender: str, receiver: str) -> bool: ...
    def top_k(self, k: int) -> list[str]: ...
```

## Constraints
- Up to `10^5` events, and `0 <= k <= 10^5`
- User IDs and message IDs are non-empty strings
- Up to `10^5` calls to `top_k`, interleaved with the events

## Examples
**Part 1, Example 1**
Input: `events = [("m1","alice","bob"),("m2","bob","carol"),("m1","alice","bob"),("m3","carol","alice"),("m4","dave","bob")], k = 2`
Output: `["bob", "alice"]`
Explanation: The second `m1` is a duplicate. The activities are bob = 3 (m1, m2, m4), alice = 2, carol = 2 and dave = 1. With `k = 10`, the output is `["bob", "alice", "carol", "dave"]`, where alice beats carol on the alphabetical tie-break.

**Part 1, Example 2** (an edge case: a self-message)
Input: `events = [("x","zoe","zoe"),("y","amy","bob")], k = 3`
Output: `["amy", "bob", "zoe"]`
Explanation: All three users have activity 1, so the order is alphabetical.

**Part 2**
```
t = ActivityTracker()
t.record("m1","alice","bob")   -> True ; t.top_k(2) -> ["alice", "bob"]
t.record("m2","carol","dave")  -> True
t.record("m1","alice","bob")   -> False            # duplicate
t.top_k(3)                     -> ["alice", "bob", "carol"]
t.record("m3","dave","alice")  -> True ; t.top_k(2) -> ["alice", "dave"]
```

<details><summary>Approach (spoiler)</summary>

Use a hash set of the `message_id`s already seen to drop duplicates in O(1). Use a hash map from user to count. Taking `{sender, receiver}` as a set handles self-messages. For the batch version, sort by `(-count, user)`. For the live version, `record` stays O(1) and `top_k` uses `heapq.nsmallest(k, (-count, user))` in O(U log k). If `top_k` is called very often, keep the users in a balanced BST or sorted list keyed by `(-count, user)` instead. Each increment then becomes a delete plus an insert in O(log U), and `top_k` becomes O(k). Because counts only ever go up by 1, count buckets with ordered sets are another good option. In production, the `seen` set would get a TTL or a Bloom filter so its memory stays bounded.
**Time:** batch O(N + U log U), live `record` O(1) and `top_k` O(U log k) · **Space:** O(N + U)

```python
import heapq
from collections import defaultdict

# Part 1: batch
def most_active_users(events: list[tuple[str, str, str]], k: int) -> list[str]:
    seen = set()
    count = defaultdict(int)
    for msg_id, sender, receiver in events:
        if msg_id in seen:
            continue                               # duplicate delivery of the same message
        seen.add(msg_id)
        for user in {sender, receiver}:            # a self-message counts once
            count[user] += 1
    ranked = sorted(count, key=lambda u: (-count[u], u))
    return ranked[:k]

# Part 2: live stream
class ActivityTracker:
    def __init__(self) -> None:
        self.seen = set()
        self.count = defaultdict(int)

    def record(self, msg_id: str, sender: str, receiver: str) -> bool:
        if msg_id in self.seen:
            return False
        self.seen.add(msg_id)
        for user in {sender, receiver}:
            self.count[user] += 1
        return True

    def top_k(self, k: int) -> list[str]:
        return [u for _, u in heapq.nsmallest(k, ((-c, u) for u, c in self.count.items()))]
```
</details>
