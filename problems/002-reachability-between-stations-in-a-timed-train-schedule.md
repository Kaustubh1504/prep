# Reachability Between Stations in a Timed Train Schedule
> Google · Onsite · medium · Pattern: Graph BFS / DFS
> Source: https://prachub.com/interview-questions/reachability-between-stations-in-a-timed-train-schedule

You are given a train timetable. Each train makes one trip from a departure station to an arrival station, leaving at its departure time and arriving at its arrival time. You start at station `source`. Return whether you can reach station `destination` by taking a sequence of trains, where each train after the first departs from the station where the previous one arrived, no earlier than the previous train's arrival time.

### Function Signature

```python
def can_reach(trains: list[tuple[str, str, int, int]], source: str, destination: str) -> bool:
```

Each train is `(departure_station, arrival_station, departure_time, arrival_time)`.

### Rules

- At the start you are at `source` and can wait there as long as you like, so you can board any train that departs from `source`, whatever its departure time.
- Transfers take no time: after arriving at a station at time `t`, you can board any train that departs from that station at time `t` or later, but not one that departs before `t`.
- You may wait at any station for any length of time, take any number of trains, and pass through the same station more than once.
- A train is boarded only at its departure station and left only at its arrival station; it makes no intermediate stops.
- If `source == destination`, return `True`.
- `source` and `destination` may be stations that appear in no train.

### Constraints

- `0 <= len(trains) <= 10^5`
- Station names are non-empty strings of at most 10 letters and digits.
- `0 <= departure_time < arrival_time <= 10^9` for every train.
- Each train's departure station differs from its arrival station.
- `trains` is in no particular order and may contain identical entries.

### Examples

**Example 1**

```text
Input:  trains = [("A", "Y", 1, 20), ("A", "Y", 2, 5), ("Y", "B", 6, 9)], source = "A", destination = "B"
Output: True
```

The train leaving A at 1 reaches Y at 20, too late for the train leaving Y at 6. The train leaving A at 2 reaches Y at 5, and from there the train leaving Y at 6 reaches B at 9.

**Example 2**

```text
Input:  trains = [("A", "Y", 1, 20), ("A", "Y", 2, 5), ("Y", "B", 4, 9)], source = "A", destination = "B"
Output: False
```

The earliest you can be at Y is time 5, but the only train from Y to B leaves at 4.

**Example 3**

```text
Input:  trains = [("A", "C", 0, 3), ("C", "D", 3, 4), ("D", "B", 2, 8), ("D", "B", 4, 7)], source = "A", destination = "B"
Output: True
```

You reach C at 3 and can board the train that leaves C at 3. You reach D at 4: the train leaving D at 2 has already gone, but the train leaving D at 4 reaches B at 7.

<details><summary>Hints (spoiler)</summary>

1. Because you can wait anywhere for free, being at a station earlier never allows fewer onward trains than being there later.
2. A train is only useful if you can be at its departure station no later than its departure time; ask what you must already know about that station when you consider the train.
3. In Example 1 the first train you might notice into Y arrives too late; make sure a station's best arrival time can still improve after you have first reached it.
</details>

<details><summary>Approach (spoiler)</summary>

Keep, for every station, the earliest time at which you can be standing there. The source starts at -1, below every departure time, because you may board any of its trains; every other station starts unknown. Sort the trains by departure time and scan them once. A train (u, v, d, a) can be boarded exactly when earliest[u] is known and earliest[u] <= d; when it can, set earliest[v] = min(earliest[v], a). Waiting is free, so being at a station earlier dominates being there later, and the earliest arrival alone decides which trains leaving that station are catchable. Invariant: when a train departing at d is examined, every train that could deliver you to its departure station by time d has already been examined, because such a train arrives at or before d and departs strictly before its arrival, hence strictly before d. So earliest[u] is already final as far as this train is concerned, and ties in departure time may be processed in any order, since no train can enable another train with the same departure time. By induction on departure order, the scan records exactly the stations reachable from the source, each with its true earliest arrival, and the answer is whether the destination was recorded. Edge cases: source == destination returns True even with an empty timetable or stations that appear in no train; an empty timetable, a source with no outgoing trains, or a destination that never appears as an arrival station returns False; arriving back at the source never raises its value above -1, so trains leaving the source stay boardable at any time; duplicate trains are harmless.

**Time:** O(n log n) · **Space:** O(n)
</details>
