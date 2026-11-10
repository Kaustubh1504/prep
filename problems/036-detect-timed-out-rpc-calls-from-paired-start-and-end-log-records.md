# Detect timed-out RPC calls from paired start and end log records
> Google · Onsite · medium · Pattern: Simulation, Sorting
> Source: https://prachub.com/interview-questions/detect-timed-out-rpc-calls-from-paired-start-and-end-log-records

A service writes a log record when a remote procedure call (RPC) starts and another when it ends. Given the log, in time order, and a timeout, report every call that ran for longer than the timeout. A call that has started but has no end record is still running when the log ends, and it counts as timed out if it has already been running for longer than the timeout at that point.

### Function Signature

```python
def timed_out_calls(logs: list[tuple[int, int, str]], timeout: int) -> list[int]:
```

Each record is `(call_id, timestamp, kind)`, where `kind` is `"start"` or `"end"`.

### Rules

- Records are listed in non-decreasing order of `timestamp`.
- Each `call_id` has exactly one `"start"` record and at most one `"end"` record. If a call has an end record, it appears later in the list than that call's start record.
- Let `now` be the timestamp of the last record in the list. A call's running time is `end_timestamp - start_timestamp` if it has an end record, and `now - start_timestamp` otherwise.
- A call is timed out when its running time is strictly greater than `timeout`. A running time exactly equal to `timeout` is not a timeout.
- Return the `call_id` of every timed-out call, sorted by start timestamp in ascending order, with ties broken by `call_id` in ascending order. Because every call has the same timeout, this is also the order in which their deadlines expire. Return an empty list if no call timed out.

### Constraints

- `1 <= len(logs) <= 200000`
- `0 <= call_id <= 10^9`
- `0 <= timestamp <= 10^9`
- `0 <= timeout <= 10^9`
- Every sum `start_timestamp + timeout` is at most `2 * 10^9`, which fits in a 32-bit signed integer.

### Examples

**Example 1**

```text
Input:  logs = [(1, 0, "start"), (2, 1, "start"), (1, 3, "end"), (3, 4, "start"), (2, 9, "end"), (3, 10, "end")], timeout = 5
Output: [2, 3]
```

Call 1 ran 3 - 0 = 3 units. Call 2 ran 9 - 1 = 8 units and call 3 ran 10 - 4 = 6 units, both more than 5. Call 2 started at time 1 and call 3 at time 4, which gives the order.

**Example 2**

```text
Input:  logs = [(7, 2, "start"), (8, 2, "start"), (8, 6, "end"), (9, 7, "start")], timeout = 4
Output: [7]
```

The log ends at time 7. Call 7 has no end record and has been running for 7 - 2 = 5 units, which is more than 4. Call 8 ran exactly 6 - 2 = 4 units, which is not more than the timeout. Call 9 has no end record and has been running for 7 - 7 = 0 units.

**Example 3**

```text
Input:  logs = [(5, 0, "start"), (4, 0, "start"), (5, 10, "end"), (4, 10, "end")], timeout = 3
Output: [4, 5]
```

Both calls ran 10 units and both started at time 0, so the tie is broken by `call_id`.

<details><summary>Hints (spoiler)</summary>

1. now comes only from the last record in the list, whatever kind of record it is; it is not necessarily the last end time.
2. For each call you need its start timestamp and, if it has one, its end timestamp; a call without an end record is measured up to now.
3. Order the answer by start timestamp first and by call_id only when start timestamps are equal, and remember that a running time exactly equal to timeout does not count.
</details>

<details><summary>Approach (spoiler)</summary>

Algorithm: take now as the timestamp of the last record in the list, whatever its kind. Scan the log once and store, in a hash map, the end timestamp of every call that has an end record. Scan the log again; for each start record, the call's finish time is its stored end timestamp if one exists and now otherwise, so its running time is finish - start_timestamp. Keep the call as the pair (start_timestamp, call_id) when that running time is strictly greater than timeout. Sort the kept pairs lexicographically and return their call_ids.

Invariant and correctness: after the first scan the map holds exactly the calls that have an end record, so the finish time chosen in the second scan matches the definition of running time for both ended and unended calls, and the strict comparison matches the timeout rule. Each call_id has exactly one start record, so every call is examined exactly once and the (start_timestamp, call_id) keys are distinct; sorting them lexicographically therefore produces exactly the required order (start timestamp ascending, then call_id ascending) with no tie left undecided.

Edge cases: a single start record makes now equal to its start, so it has run 0 units and the result is empty; a call whose start and end share a timestamp runs 0 units and never times out, even with timeout 0; a running time exactly equal to timeout is excluded; an unended call is measured to the last record even when that record is another call's start, not to the last end record. Every value stays at or below 2 * 10^9, so 32-bit integers are sufficient.

**Time:** O(n log n) · **Space:** O(n)
</details>
