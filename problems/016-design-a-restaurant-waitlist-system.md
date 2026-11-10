# Design a restaurant waitlist system
> Google · Technical Screen · medium · Pattern: Segment Tree / Fenwick, Design / Data Structure
> Source: https://prachub.com/interview-questions/design-a-restaurant-waitlist-system

You are implementing the waitlist system for a restaurant. Parties arrive over time, can cancel, and get seated when a table becomes available.

## Rules
- Each party has a unique `partyId`, a `name`, and a `size` (number of people).
- Parties are seated in **arrival order**, but only if they **fit** the available table.
- When a table of capacity `c` becomes available, you must seat the **earliest-arrived** party whose `size <= c`.
- If no party fits, the table remains unused for that event.

## Operations to support
Design a data structure / class that supports the following operations efficiently:

1. `addParty(name, size) -> partyId`
   - Adds a new party to the end of the waitlist and returns its id.

2. `cancelParty(partyId) -> bool`
   - Removes the party from the waitlist if present.
   - Returns `true` if removed, otherwise `false`.

3. `seatTable(capacity) -> partyId or null`
   - Finds and removes the earliest party with `size <= capacity`.
   - Returns that party’s id, or `null` if nobody fits.

4. `getPosition(partyId) -> int`
   - Returns how many parties are ahead of this party in the current waitlist order (0-based).
   - If the party is not in the waitlist, return `-1`.

## Constraints
- Up to `2 * 10^5` operations.
- Party size is a small positive integer (e.g., 1–20).
- Aim for better-than-linear time per operation (especially for `seatTable` and `getPosition`).

## Example (one possible interaction)
- addParty("A", 4) -> id1
- addParty("B", 2) -> id2
- seatTable(2) -> id2 (B fits and is earliest among those that fit)
- seatTable(4) -> id1

<details><summary>Hints (spoiler)</summary>

1. Because party size is only 1..20, you can keep separate candidate structures for each size and check only a constant number of buckets when seating a table.
2. To answer getPosition after many cancellations and seatings, maintain active parties by arrival index in a Fenwick tree (Binary Indexed Tree) or another order-statistics structure.
</details>

<details><summary>Approach (spoiler)</summary>

The waitlist is keyed by **arrival order** (a monotonically increasing `arrival` counter), so "earliest-arrived" is simply the smallest active arrival index. Two independent structures support the four operations efficiently.

**1. `getPosition` — Fenwick tree (BIT).** `bit` stores a 1 at each active party's arrival index. `bit.sum(arrival - 1)` counts active parties that arrived strictly before the target, which is exactly how many are ahead of it. Add/cancel/seat flip the corresponding index by ±1. Each update and query is `O(log m)`.

**2. `seatTable` — 20 per-size min-heaps with lazy deletion.** Parties are bucketed by `size` (1..20) into `size_heaps[size]`, each a min-heap of arrival indices. To seat for a `capacity`, the loop scans sizes `1..capacity`, first discarding stale heap tops (`not active[...]`) — these are parties already cancelled or seated — then peeks the smallest valid arrival across those buckets. The bucket whose top has the **globally smallest arrival** wins, giving the earliest-arrived fitting party. That entry is popped, marked inactive, and removed from the BIT.

**Bookkeeping.** `party_to_arrival` / `arrival_to_party` map partyIds to arrival indices and back; `active[]` is the single source of truth for "still waiting," enabling O(1) cancellation (just flip the flag) and lazy heap cleanup.

**Why correct:** arrival order strictly reflects FIFO priority, the BIT prefix-sum is an exact ahead-count, and scanning size buckets 1..capacity considers every party that fits while the min-heaps + active check guarantee the earliest valid one is chosen. Lazy deletion is safe because a stale entry is never re-activated, so popping it can't drop a still-waiting party.
</details>
