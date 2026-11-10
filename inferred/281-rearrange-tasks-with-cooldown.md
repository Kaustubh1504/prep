# Rearrange Tasks With Cooldown
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · medium · Pattern: Greedy, Heap / Top-K

## Problem
You get a list of tasks, where each task is a string label (for example `"A"`) and labels can repeat. You also get a cooldown `n >= 0`. One CPU runs one task or sits idle in each time slot. If two copies of the same task run, at least `n` slots must separate them. So if `"A"` runs at time `t`, the next `"A"` can run no earlier than `t + n + 1`.

Return an actual **schedule**: a list of task labels and `"idle"` entries in which every task appears exactly as many times as in the input. The schedule must have the **minimum possible length**. It must not start or end with idle slots that aren't needed. If the input is empty, return `[]`.

To keep the output deterministic, at each slot run the available task (one whose cooldown has expired) with the **most remaining copies**. Break ties by the lexicographically smallest label. Insert `"idle"` only when no task is available. You should also explain why this greedy rule produces the optimal length, which is `max(len(tasks), (f_max - 1)·(n + 1) + c_max)`. Here `f_max` is the highest frequency and `c_max` is how many labels have that frequency.

## Function signature
```python
def schedule_tasks(tasks: list[str], n: int) -> list[str]:
```

## Constraints
- `0 <= len(tasks) <= 10^4`
- Labels are uppercase letters, so there are at most 26 distinct labels
- `0 <= n <= 100`

## Examples
**Example 1**
Input: `tasks = ["A","A","A","B","B","B"], n = 2`
Output: `["A","B","idle","A","B","idle","A","B"]`
Explanation: The length is (3-1)·3 + 2 = 8, which is optimal.

**Example 2**
Input: `tasks = ["A","A","A","B","B","B","C","C","D"], n = 2`
Output: `["A","B","C","A","B","C","A","B","D"]`
Explanation: There are enough different tasks to fill every gap, so no idle slots are needed. The length equals the number of tasks.

**Example 3** (an edge case: a single label)
Input: `tasks = ["A","A","A","A"], n = 3`
Output: `["A","idle","idle","idle","A","idle","idle","idle","A","idle","idle","idle","A"]`

**Example 4** (edge cases)
`schedule_tasks(["A","A","A","B"], 0)` returns `["A","A","A","B"]` because there is no cooldown. `schedule_tasks([], 2)` returns `[]`.

<details><summary>Approach (spoiler)</summary>

Simulate the timeline using a max-heap of available tasks keyed by `(-remaining, label)` and a FIFO queue of tasks cooling down, each tagged with the time it becomes available again. In each slot, first move tasks whose cooldown has ended back into the heap. Then run the heap's top task, or go idle if the heap is empty. Because every task has the same cooldown, the queue stays sorted by release time. Running the task with the most remaining copies is optimal: the most frequent label forces `f_max - 1` full frames of length `n + 1`, and serving labels in frequency order fills those frames before any idle slot is used, so the schedule reaches the lower bound.
**Time:** O(L · log σ), where L is the output length and σ ≤ 26 is the number of distinct labels · **Space:** O(σ) plus the output

```python
import heapq
from collections import Counter, deque

def schedule_tasks(tasks: list[str], n: int) -> list[str]:
    ready = [(-c, t) for t, c in Counter(tasks).items()]   # (-remaining, name)
    heapq.heapify(ready)
    cooling = deque()                  # (time it becomes available, -remaining, name)
    out = []
    time = 0
    while ready or cooling:
        while cooling and cooling[0][0] <= time:
            _, negc, t = cooling.popleft()
            heapq.heappush(ready, (negc, t))
        if ready:
            negc, t = heapq.heappop(ready)
            out.append(t)
            if negc + 1 < 0:
                cooling.append((time + n + 1, negc + 1, t))
        else:
            out.append("idle")
        time += 1
    return out
```
</details>
