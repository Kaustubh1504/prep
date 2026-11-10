# Filter Repeated Robot Status Messages
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Simulation, Topological Sort; Intervals / Sweep Line

## Problem
A robot emits a stream of status events. Each event is a pair `(timestamp, message)`, and events arrive in non-decreasing timestamp order. Showing every event floods the screen, so filter the stream with this rule:

- An event is **displayed** if its message has never been displayed before, or if **strictly more than 10 seconds** have passed since that message was last *displayed* (`timestamp - last_displayed > 10`).
- Otherwise the event is **hidden**. A hidden event does **not** reset the timer: the 10-second window always counts from the last time the message was displayed, not from the last time it appeared.
- Each distinct message is tracked independently. Messages are compared exactly and case-sensitively, so `"Moving"` and `"moving"` are different messages.

Return the displayed events in their original input order.

## Function signature
```python
def filter_messages(events: list[tuple[int, str]]) -> list[tuple[int, str]]:
```

## Constraints
- `0 <= len(events) <= 10^5`
- `0 <= timestamp <= 10^9`, non-decreasing across the list
- `1 <= len(message) <= 100`

## Examples
**Example 1**
Input: `events = [(0,"moving"),(5,"moving"),(10,"moving"),(11,"moving"),(12,"Moving"),(15,"stopped"),(21,"moving"),(22,"moving")]`
Output: `[(0,"moving"),(11,"moving"),(12,"Moving"),(15,"stopped"),(22,"moving")]`
Explanation: `"moving"` is shown at 0. It is hidden at 5 and at 10 (exactly 10 seconds is not enough), then shown at 11. At 21 only 10 seconds have passed since 11, so it is hidden. At 22, 11 seconds have passed, so it is shown. `"Moving"` and `"stopped"` are new messages.

**Example 2** (hidden repeats do not reset the window)
Input: `events = [(1,"ok"),(8,"ok"),(15,"ok"),(22,"ok")]`
Output: `[(1,"ok"),(15,"ok")]`
Explanation: The event at 8 is hidden, but the window still counts from 1, so 15 is shown (14 > 10). The event at 22 is only 7 seconds after 15, so it is hidden.

**Example 3** (empty stream)
Input: `events = []`
Output: `[]`

<details><summary>Approach (spoiler)</summary>

Keep a hash map from each message to the timestamp at which it was last displayed. For each event, display it if the message is absent from the map or `ts - last[msg] > 10`, and update the map **only** when you display it. Updating only on display is what stops hidden repeats from resetting the window. One pass in input order preserves the order. (For an unbounded stream you could evict map entries older than 10 seconds to bound memory.)

**Time:** O(n) · **Space:** O(distinct messages)

```python
def filter_messages(events):
    last_shown = {}
    out = []
    for ts, msg in events:
        if msg not in last_shown or ts - last_shown[msg] > 10:
            out.append((ts, msg))
            last_shown[msg] = ts
    return out
```
</details>
