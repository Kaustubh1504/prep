# Find shared objects across two log files
> Google · Technical Screen · medium · Pattern: Simulation
> Source: https://prachub.com/interview-questions/find-shared-objects-across-two-log-files

You are given two large log files representing activity on two different days. Each line of each log has three fields:

- `timestamp`: a time value (you may treat it as an opaque string or integer)
- `obj_id`: identifier of an object (string or integer)
- `client_id`: identifier of a client (string or integer)

The logs are not necessarily sorted by any field.

Define an object as **interesting** if:

1. Its `obj_id` appears at least once in day 1's log **and** at least once in day 2's log; and
2. Across all of its appearances in both days combined, it is associated with at least **two distinct** `client_id` values.

### Tasks

1. Design and implement a function that, given file handles (or streaming iterators) for the two log files, returns the set of all such interesting `obj_id`s.
2. For your initial, straightforward in-memory solution (you may assume both logs fit in memory), state the time and space complexity in terms of the total number of log records.
3. Follow-up (memory constrained): Now assume the logs are very large and **cannot** both fit into memory at once.
   - You may still sequentially scan each file and you may perform external sorting.
   - Describe how you would modify your approach to work under this memory constraint.
   - Analyze the time and space complexity of this memory-efficient solution.

<details><summary>Hints (spoiler)</summary>

1. Track which days each object appears in and its set of clients.
</details>
