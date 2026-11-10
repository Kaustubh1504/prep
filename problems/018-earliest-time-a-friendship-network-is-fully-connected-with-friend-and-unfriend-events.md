# Earliest Time a Friendship Network Is Fully Connected with Friend and Unfriend Events
> Google · Onsite · medium · Pattern: Union-Find, Sorting
> Source: https://prachub.com/interview-questions/earliest-time-a-friendship-network-is-fully-connected-with-friend-and-unfriend-events

There are `n` people in a social network, labeled `0` to `n - 1`. You are given a log of friendship events, `logs`, where `logs[i] = [timestamp, a, b, action]` means that at time `timestamp`, people `a` and `b` become friends if `action` is `1`, or stop being friends (unfriend) if `action` is `0`. Friendship is symmetric.

Two people are acquainted if they are friends, or if one can reach the other through a chain of people who are friends at that moment. The network is fully connected when every pair of people is acquainted.

Return the earliest timestamp at which the network is fully connected, or `-1` if that never happens.

### Function Signature

```python
def earliest_full_connection(n: int, logs: list[list[int]]) -> int:
```

### Rules

- Before the first event, nobody is friends with anybody.
- The log is not necessarily sorted. Events take effect in increasing order of `timestamp`, and no two events share a timestamp.
- The network at time `t` is the result of applying every event whose timestamp is at most `t`. The answer is the timestamp of the first event after which the network is fully connected.
- An event with `action = 1` always names two people who are not friends at that moment, and an event with `action = 0` always names two people who are friends at that moment.
- A network that is fully connected at some time may be split again by later unfriend events; that does not change the answer, which is the first time the network is fully connected.

### Constraints

- `2 <= n <= 1000`
- `1 <= len(logs) <= 2000`
- `logs[i]` has exactly four integers: `0 <= timestamp <= 10^9`, `0 <= a < n`, `0 <= b < n`, `a != b`, and `action` is `0` or `1`.
- All timestamps are distinct.
- The events satisfy the validity rule above when applied in timestamp order.
- The answer is either `-1` or one of the timestamps in `logs`, so it is uniquely determined by the input.

### Examples

**Example 1**

- Input: `n = 4`, `logs = [[3, 0, 1, 1], [7, 2, 3, 1], [1, 1, 2, 1], [9, 0, 3, 1]]`
- Output: `7`
- Explanation: In time order: at 1, people 1 and 2 become friends; at 3, people 0 and 1 do, giving the group {0, 1, 2} and person 3 alone; at 7, people 2 and 3 become friends, which connects everyone. The event at 9 comes later and does not matter.

**Example 2**

- Input: `n = 4`, `logs = [[5, 2, 3, 1], [6, 1, 3, 1], [1, 0, 1, 1], [2, 1, 2, 1], [4, 1, 2, 0]]`
- Output: `6`
- Explanation: In time order: at 1 and 2, the group {0, 1, 2} forms; at 4, people 1 and 2 unfriend, leaving {0, 1} and {2}; at 5, people 2 and 3 become friends, giving {0, 1} and {2, 3}; at 6, people 1 and 3 become friends, which connects everyone. Without the unfriend event at 4, the answer would have been 5.

**Example 3**

- Input: `n = 3`, `logs = [[1, 0, 1, 1], [2, 0, 1, 0], [3, 1, 2, 1]]`
- Output: `-1`
- Explanation: At 1, only people 0 and 1 are friends and person 2 is alone; at 2, they unfriend and nobody is friends; at 3, people 1 and 2 become friends and person 0 is alone. The network is never fully connected.

<details><summary>Hints (spoiler)</summary>

1. The order of the list is not the order of time. What should happen to the events before you replay them?
2. Unfriend events can split a group, so a structure that only ever merges groups is not enough on its own. With at most 1000 people and 2000 events, a full graph traversal after an event is affordable.
3. Removing a friendship can never make the network more connected, and n people need at least n - 1 friendships to be connected. When is it actually worth checking?
</details>

<details><summary>Approach (spoiler)</summary>

Sort the events by timestamp and replay them while maintaining the current friendship graph as adjacency sets, together with a count of live friendships. An unfriend event removes the edge from both sets; it can only split groups, so it can never be the first moment of full connectivity and needs no check. After a befriend event, if there are at least n - 1 live friendships (fewer can never connect n people), run a breadth-first search from person 0 and count the people it reaches. The first event whose search reaches all n people is the answer; if the replay ends without that happening, return -1. Replaying in timestamp order matters because the log is unsorted, and recomputing reachability (rather than using an add-only union-find) matters because unfriend events can split a group that was previously joined.

**Time:** O(L log L + L * (n + L)) where L = len(logs) · **Space:** O(n + L)
</details>
