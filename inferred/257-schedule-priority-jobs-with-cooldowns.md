# Schedule Priority Jobs with Cooldowns
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Onsite · medium · Pattern: Intervals / Sweep Line

## Problem
Design a scheduler for **recurring** jobs. Each job has a string `job_id`, an integer `priority` (higher runs first) and a non-negative integer `cooldown`. Time is measured only in calls to `get_next()`, with the k-th call being "call k".

- `add_job(job_id, priority, cooldown)`: register a new job. It is eligible right away. If `job_id` is already registered, it is a **duplicate**: do nothing and return `False`. Otherwise return `True`.
- `get_next()`: return the ID of the **highest-priority eligible** job, or `None` if no job is eligible. That includes the case where no jobs exist. An empty call still counts as a call, so it still advances cooldowns. Ties in priority go to the job that was **added earliest**. A job returned on call `t` stays registered (it recurs) but is **ineligible for the next `cooldown` calls**. It becomes eligible again on call `t + cooldown + 1`. With `cooldown = 0`, it can be returned again on the very next call.
- `update_job(job_id, priority, cooldown)`: change an existing job's priority and cooldown. The job keeps its original insertion order for tie-breaking. If it is cooling down right now, its current cooldown still runs out at the same call, and the new cooldown applies starting from its next retrieval. Returns `False` if the job doesn't exist.
- `remove_job(job_id)`: unregister a job. Returns `False` if it doesn't exist. If the same ID is added again later, it counts as a new job: it is immediately eligible and placed last in insertion order.

Every operation should run in O(log N) amortised time, where N is the number of jobs. Scanning all jobs on each call is too slow for large workloads.
*Discussion follow-up:* how would you make this safe for several worker threads calling `get_next()` at once? (For example, one lock around the heaps, or sharding with per-shard locks and a merge step.)

## Function signature
```python
class JobScheduler:
    def __init__(self) -> None: ...
    def add_job(self, job_id: str, priority: int, cooldown: int) -> bool: ...
    def update_job(self, job_id: str, priority: int, cooldown: int) -> bool: ...
    def remove_job(self, job_id: str) -> bool: ...
    def get_next(self) -> str | None: ...
```

## Constraints
- Up to `2 * 10^5` operations in total
- `-10^9 <= priority <= 10^9`
- `0 <= cooldown <= 10^9`

## Examples
**Example 1**
```
s = JobScheduler()
s.add_job("A", 5, 2); s.add_job("B", 3, 0); s.add_job("C", 5, 1)
[s.get_next() for _ in range(6)]  ->  ["A", "C", "B", "A", "C", "B"]
```
Explanation: On call 1, A and C tie at priority 5. A was added first, so A runs and is ineligible for calls 2–3. Call 2 returns C, which is then ineligible for call 3. Call 3 returns B. On call 4, A is eligible again (1 + 2 + 1 = 4), and so on.

**Example 2** (edge cases: empty call, duplicate ID, every job cooling down)
```
s = JobScheduler()
s.get_next()            -> None
s.add_job("X", 1, 1)    -> True
s.add_job("X", 9, 0)    -> False      # duplicate ignored
[s.get_next() for _ in range(4)]  ->  ["X", None, "X", None]
```

**Example 3** (update and remove)
```
s = JobScheduler()
s.add_job("A", 1, 0); s.add_job("B", 2, 0)
s.get_next(), s.get_next()   -> "B", "B"
s.update_job("A", 3, 0)
s.get_next(), s.get_next()   -> "A", "A"
s.remove_job("A")
s.get_next(), s.get_next()   -> "B", "B"
s.remove_job("B")
s.get_next()                 -> None
```

<details><summary>Approach (spoiler)</summary>

Use two heaps. The **ready** heap is ordered by `(-priority, insertion_seq)` and holds eligible jobs. The **waiting** heap is ordered by `eligible_at_call` and holds jobs that are cooling down. Each `get_next` increments the call counter, moves every waiting job whose `eligible_at <= t` into ready, pops the best ready job, and pushes it into waiting with `eligible_at = t + cooldown + 1`. Updates and removals use **lazy deletion**. Each job stores `(seq, version)`, and an update bumps the version and pushes a fresh entry, so any heap entry whose `(seq, version)` no longer matches the job's record gets discarded when popped. Re-adding a removed ID gets a new `seq`, so old entries can never come back to life.
**Time:** O(log N) amortised per operation · **Space:** O(N + number of stale entries)

```python
from __future__ import annotations
import heapq
from typing import Optional

class JobScheduler:
    def __init__(self) -> None:
        self.jobs = {}      # job_id -> [priority, cooldown, seq, version, eligible_at]
        self.ready = []     # (-priority, seq, version, job_id)
        self.waiting = []   # (eligible_at, seq, version, job_id)
        self.calls = 0      # number of get_next calls so far
        self.seq = 0        # insertion counter for tie-breaking

    def _live(self, seq: int, ver: int, job_id: str) -> bool:
        j = self.jobs.get(job_id)
        return j is not None and j[2] == seq and j[3] == ver

    def _push(self, job_id: str) -> None:
        pr, _, seq, ver, elig = self.jobs[job_id]
        if elig > self.calls:
            heapq.heappush(self.waiting, (elig, seq, ver, job_id))
        else:
            heapq.heappush(self.ready, (-pr, seq, ver, job_id))

    def add_job(self, job_id: str, priority: int, cooldown: int) -> bool:
        if job_id in self.jobs:
            return False                          # duplicate id is rejected
        self.jobs[job_id] = [priority, cooldown, self.seq, 0, 0]
        self.seq += 1
        self._push(job_id)
        return True

    def update_job(self, job_id: str, priority: int, cooldown: int) -> bool:
        j = self.jobs.get(job_id)
        if j is None:
            return False
        j[0], j[1] = priority, cooldown
        j[3] += 1                                 # old heap entries become stale
        self._push(job_id)
        return True

    def remove_job(self, job_id: str) -> bool:
        return self.jobs.pop(job_id, None) is not None   # heap entries die lazily

    def get_next(self) -> Optional[str]:
        self.calls += 1
        t = self.calls
        while self.waiting and self.waiting[0][0] <= t:
            _, seq, ver, jid = heapq.heappop(self.waiting)
            if self._live(seq, ver, jid):
                heapq.heappush(self.ready, (-self.jobs[jid][0], seq, ver, jid))
        while self.ready:
            _, seq, ver, jid = heapq.heappop(self.ready)
            if not self._live(seq, ver, jid):
                continue
            j = self.jobs[jid]
            j[4] = t + j[1] + 1                   # skipped for the next `cooldown` calls
            heapq.heappush(self.waiting, (j[4], seq, ver, jid))
            return jid
        return None
```
</details>
