# Intervals, Heaps & Design

Patterns in this section: Intervals / Sweep Line · Heap / Top-K · Design / Data Structure · Stack / Parsing · Monotonic Stack · Segment Tree / Fenwick · Simulation · Other (non-coding).

---

## Intervals / Sweep Line

**Recognise it when:**
- "minimum number of rooms / servers / cars / vehicles needed", "max meetings at once" → peak concurrency: +1/−1 sweep, or sort by start + min-heap of end times.
- "assign each meeting/request to a numbered room/car, lowest free number first" → two heaps: `free` ids and `busy` (end, id).
- "n rooms only; if none free, delay / reject" → same two heaps, plus a branch for "none free".
- "merge / union / free time / gaps / safe intervals / intersect two lists" → sort by start and merge with a running `cur_end`; gaps are the complement.
- "for every period, report who/how many are active" (exactly X at once, on-call timeline, skyline) → event sweep that outputs a segment between consecutive event times.
- "choose non-overlapping intervals to maximise profit / cover a range with fewest" → sort by end (DP + binary search) or by start (greedy reach).

**Core idea:** Only endpoints matter, because the set of active intervals only changes at a start or an end. Sort the endpoints and walk through them in time order, keeping a small amount of state: a counter, a heap of end times, or the end of the last merged block. Peak concurrency is a lower bound on resources, and greedily reusing any resource that is already free reaches it. That is why "min rooms" equals "max overlap".

**Skeleton:**
```python
# (a) Peak concurrency, half-open [s, e): ends sort before starts at equal t
events = [(s, +1) for s, e in iv] + [(e, -1) for s, e in iv]
events.sort()                      # (t, -1) < (t, +1)  -> touching intervals do not overlap
cur = best = 0
for t, d in events:
    cur += d; best = max(best, cur)

# (b) Resource assignment: lowest free id, busy keyed by release time
free, busy = list(range(n)), []    # free: min-heap of ids; busy: (end, id)
for s, e in sorted(iv):
    while busy and busy[0][0] <= s:
        heapq.heappush(free, heapq.heappop(busy)[1])
    if free: rid = heapq.heappop(free); heapq.heappush(busy, (e, rid))
    else:    ...                   # open new id / delay to busy[0] / reject (variant-specific)
```

**Pitfalls:**
- Tie order at equal timestamps: half-open `[s, e)` means process the end before the start (a car returned at t can go out at t). Closed `[a, b]` means touching intervals overlap or merge, so `<=` becomes `<`.
- After a delay, the meeting keeps its **duration** and starts at the room's free time: new end = `free_at + (e − s)`, not the original `e`.
- With two heaps, release **every** busy resource with `end <= start` before choosing one. Popping only the earliest one picks the wrong "lowest id".
- Wrap-around (circular day, midnight) and identity rules (same `job_id` shares a server) must be normalised **before** the sweep, not patched inside it.

### Room / car variant decoder (read this first)

| Variant | Resources | If none free | Return | Structure |
|---|---|---|---|---|
| Min rooms / servers | unlimited | open a new one | count | +1/−1 sweep or min-heap of ends |
| Min fleet + assignment | unlimited, numbered | open id `size` | count + id per request | `free` id heap + `busy` (end,id) heap |
| n rooms, delay | fixed n | wait for earliest `busy[0]`, keep duration | most-booked room (+ per-meeting room) | same two heaps + `count[]` |
| n cars, reject | fixed n | drop the request | most-used car | same two heaps, no delay branch |
| Circular day | unlimited | open new | count | split wrapping `[s, e)` into `[s, DAY)` + `[0, e)` then (a) |
| Same `job_id` overlaps | unlimited | open new | count | merge intervals per id first, then (a) |

### Clusters

#### Min rooms (peak concurrency): the base problem. Min resources = max number of intervals alive at one instant
- **Anchor:** [#35 Minimum Number of Rooms to Schedule Overlapping Meetings](problems/035-minimum-number-of-rooms-to-schedule-overlapping-meetings.md). Full statement, explicit half-open semantics, duplicates and back-to-back meetings, n up to 1e5. Solve it both ways (two sorted arrays, and the event sweep) so you own the tie rule.
- **Variants:**
  - [#31 Find Minimum Rooms Needed](problems/031-find-minimum-rooms-needed.md) *(inferred)*. **Differs:** nothing material. Same answer via separate sorted start and end arrays and an end pointer. **Near-duplicate of #35.**
  - [#100 Compute minimum rooms for time intervals](problems/100-compute-minimum-rooms-for-time-intervals.md). **Differs:** same as #35, hint uses the two-sorted-arrays form. **Near-duplicate of #35.**
  - [#101 Compute minimum number of rooms needed](problems/101-compute-minimum-number-of-rooms-needed.md). **Differs:** framed as start/end events. Here you must state "end before start at equal time". **Near-duplicate of #35.**
  - [#337 Solve meeting-room scheduling and shortest paths](problems/337-solve-meeting-room-scheduling-and-shortest-paths.md) *(inferred)*. **Differs:** Part 1 is #35 solved with a min-heap of end times. Part 2 is plain Dijkstra (→ really Graph). **Near-duplicate of #35** (Part 1).
  - [#263 Implement text wrapping, waitlist, and intervals](problems/263-implement-text-wrapping-waitlist-and-intervals.md) *(inferred)*. **Differs:** Part 3 is #35. Part 1 is greedy word wrap (split words longer than the width). Part 2 is a waitlist with O(1) join/leave/serve (hash map + doubly linked list), with a Fenwick tree for `position` (see #16). **Near-duplicate of #35** (Part 3).

#### Min rooms with a pre-processing twist: normalise the intervals, then run the base sweep
- **Anchor:** [#214 Compute minimum servers for cyclic tasks](problems/214-compute-minimum-servers-for-cyclic-tasks.md) *(inferred)*. Wrapping tasks (`e > 1440`) are split into `[s, 1440)` and `[0, e − 1440)`. After that it is #35 unchanged.
- **Variants:**
  - [#266 Compute minimum meeting rooms on circular day](problems/266-compute-minimum-meeting-rooms-on-circular-day.md) *(inferred)*. **Differs:** same circular split, written as `[start, day)` + `[0, end)`. Drop the empty piece when `end == 0`. **Near-duplicate of #214.**
  - [#68 Compute servers needed for daily recurring jobs](problems/068-compute-servers-needed-for-daily-recurring-jobs.md). **Differs:** need is per distinct active `job_id`, not per interval, so first merge the overlapping intervals of each job_id. Past-midnight parts are *truncated*, not wrapped. **Same concept, different setting.**

#### Min fleet + deterministic assignment: unlimited numbered resources; reuse the lowest free id, open a new id only when forced
- **Anchor:** [#45 Assign the Minimum Fleet to Rental Reservations](problems/045-assign-the-minimum-fleet-to-rental-reservations.md) *(inferred)*. Cleanest statement: sort by `(pickup, return, id)`, return `(fleet_size, assignment)`. The fleet size equals peak concurrency, and ids come from the `free` heap.
- **Variants:**
  - [#328 Minimum Cars for Rental Requests](problems/328-minimum-cars-for-rental-requests.md) *(inferred)*. **Differs:** ties broken by `request_id` string order, cars numbered from 0. Same two heaps. **Near-duplicate of #45.**
  - [#313 Solve Shortest Paths and Rental Allocation](problems/313-solve-shortest-paths-and-rental-allocation.md) *(inferred)*. **Differs:** Part 2 is #45 with ties `(start, end, input index)` and output in input order. Part 1 is shortest path through a required node: Dijkstra from src and from via (→ really Graph). **Near-duplicate of #45** (Part 2).
  - [#89 Solve chat, grid paths, and car rentals](problems/089-solve-chat-grid-paths-and-car-rentals.md). **Differs:** Q3 is #45 (min cars + assignment). Q1 is top-K most active chat users (count + heap, like #356). Q2 is grid path counting with DP. **Near-duplicate of #45** (Q3).

#### Fixed n resources, lowest-id free, what to do when none is free: two heaps plus a per-resource counter
- **Anchor:** [#240 Assign meetings to rooms with delays](problems/240-assign-meetings-to-rooms-with-delays.md) *(inferred)*. The canonical "Meeting Rooms III". Free rooms sit in an id heap and busy rooms in an `(end, id)` heap. If none is free, pop `busy[0]` and run the meeting from `end` to `end + duration`. Return the most-booked room (lowest id on ties).
- **Variants:**
  - [#487 Simulate meeting-room bookings and return busiest room](problems/487-simulate-meeting-room-bookings-and-return-busiest-room.md) *(inferred)*. **Differs:** identical rules and return value. **Near-duplicate of #240.**
  - [#320 Simulate room assignments for scheduled meetings](problems/320-simulate-room-assignments-for-scheduled-meetings.md) *(inferred)*. **Differs:** also returns `assignments[i]` (the room for each meeting in input order), so carry the original index through the sort. **Follow-up of #240.**
  - [#258 Busiest Rental Car](problems/258-busiest-rental-car.md) *(inferred)*. **Differs:** if no car is free the request is **rejected**, not delayed. Drop the delay branch, keep release + smallest free id + count. Requests are sorted by `(pickup, return, index)`. **Same concept, different setting.**
  - [#257 Schedule Priority Jobs with Cooldowns](problems/257-schedule-priority-jobs-with-cooldowns.md) *(inferred)*. **Differs:** same "ready heap + waiting heap keyed by when eligible" shape, but time is the *call counter*. The ready heap is ordered by `(-priority, insertion_seq)`, and a job goes back to waiting with `eligible_at = t + cooldown`. **Same concept, different setting** (two-heap release-then-pick).
  - Also see **#99 Solve Rooms and Top-K Streams** in Heap (its Part 1 is #240 again).

#### Merge / union / complement / intersection: sort by start, keep the end of the current block, emit blocks or gaps
- **Anchor:** [#202 Find safe travel intervals between planet influences](problems/202-find-safe-travel-intervals-between-planet-influences.md). Full statement. Turn each planet into `[c − r, c + r]`, sort, merge overlapping *and touching* blocks, and output the gaps, including the unbounded ones on both sides. This covers merge and complement in one problem.
- **Variants:**
  - [#307 Find Common Free Time Slots Across Calendars](problems/307-find-common-free-time-slots-across-calendars.md) *(inferred)*. **Differs:** busy intervals come from many calendars. Clip them to `[day_start, day_end)`, take the union, and the answer is the gaps. Half-open, so touching does not create a gap. **Same concept, different setting.**
  - [#141 Compute the Union of Two Sorted Interval Lists](problems/141-compute-the-union-of-two-sorted-interval-lists.md) *(inferred)*. **Differs:** the input is two already-sorted lists, so do the merge step of merge sort (two pointers) instead of sorting, keeping O(n + m). Closed intervals, so `s <= last_end` merges. **Same concept, different setting.**
  - [#74 Solve three coding problems](problems/074-solve-three-coding-problems.md). **Differs:** Part 3 is the *intersection* of two sorted disjoint lists. Two pointers, overlap = `[max(starts), min(ends)]`, advance the pointer whose interval ends first. Part 1 is the N-th license plate (index arithmetic: 1000 suffixes per prefix). Part 2 is counting Android unlock patterns (backtracking with a skip table). **Same concept, different setting** (Part 3).
  - [#105 Check an Interval Against Existing Intervals for Conflicts](problems/105-check-an-interval-against-existing-intervals-for-conflicts.md) *(inferred)*. **Differs:** a single query against unsorted data, so a linear `a < end and start < b` scan beats sorting. The follow-up (many queries) is to merge once and then binary search. **Same concept, different setting.**
  - [#260 Find Containing Range](problems/260-find-containing-range.md) *(inferred)*. **Differs:** ranges are disjoint, so after sorting by start the ends are sorted too. For each query, bisect for the last start `<= a` and check that its end is `>= b`. **Follow-up of #105** (preprocess for many queries).
  - [#464 Cover Sorted Unique Integers with Minimal Exact Ranges](problems/464-cover-sorted-unique-integers-with-minimal-exact-ranges.md). **Differs:** builds maximal ranges from sorted unique ints (break when `next != prev + 1`, beware overflow). → really Array scan. **Same concept, different setting.**

#### Sweep that outputs segments: between consecutive event times the active set is constant, so emit `[t_i, t_{i+1})` with that state
- **Anchor:** [#108 Intervals with Exactly X Concurrent Meetings](problems/108-intervals-with-exactly-x-concurrent-meetings.md) *(inferred)*. Group the deltas by distinct time. After applying all deltas at `t_i`, the count holds on `[t_i, t_{i+1})`. Emit when count == X, and merge with the previous output segment if adjacent.
- **Variants:**
  - [#167 Consolidate On-Call Rotation Segments](problems/167-consolidate-on-call-rotation-segments.md) *(inferred)*. **Differs:** the state is a multiset (Counter) of *names*, not a count, because one person can have overlapping segments. Emit `(start, end, sorted names)`, merge adjacent segments with the same set, and ignore empty segments. **Same concept, different setting.**
  - [#339 Compute city skyline outline](problems/339-compute-city-skyline-outline.md). **Differs:** the state is the *max* active height, so keep a max-heap with lazy deletion (pop entries whose right edge `<= x`). Emit a key point only when the max changes. Tie order at equal x matters: starts taller-first, ends before starts. **Follow-up of #108** (sweep + heap).

#### Selecting intervals: choose a subset under non-overlap or coverage
- **Anchor:** [#52 Choose Non-Overlapping Weighted Jobs to Maximize Total Profit](problems/052-choose-non-overlapping-weighted-jobs-to-maximize-total-profit.md). Weighted job scheduling: sort by end, `best[i] = max(best[i−1], p_i + best[j])`, where j is the last job ending `<= s_i` (found by bisect). This is the go-to "can't just count overlaps" problem.
- **Variants:**
  - [#209 Solve Three Array and Matrix Path Problems](problems/209-solve-three-array-and-matrix-path-problems.md) *(inferred)*. **Differs:** Part 2 is *fewest intervals covering `[left, right]`*. Sort by start, and each step extends the reach as far as possible among intervals starting `<= reach` (jump-game greedy, touching counts as covered). Part 1 is longest relaxed-descent path in a grid (memoised DFS on state `(cell, prev)`). Part 3 is Kadane. **Same concept, different setting** (Part 2).

### Other Intervals / Sweep Line problems
- [#333 Min deletions to avoid overlap in first k](problems/333-min-deletions-to-avoid-overlap-in-first-k.md) *(inferred)*. Delete values from `list2` so its first k share nothing with `list1[:k]`. Hash set of forbidden values plus one greedy scan. → really Hashing / Greedy.
- [#376 Maximize Profit with at Most Two Chronological Trades](problems/376-maximize-profit-with-at-most-two-chronological-trades.md). At most two non-overlapping stock trades, solved with a 4-state DP (buy1, sell1, buy2, sell2). → really Dynamic Programming.
- [#437 Compute Two-Rectangle Coverage from Eight Coordinates](problems/437-compute-two-rectangle-coverage-from-eight-coordinates.md). Union area of two rectangles = A + B − overlap, where overlap per axis is `max(0, min(e1, e2) − max(s1, s2))`. Same 1-D overlap formula as #105. → really Math / Geometry.

---

## Heap / Top-K

**Recognise it when:**
- "top k / k most frequent / k largest / k-th largest" (often with "stream", "live", "after each insert").
- "running median", "median after each number".
- "k smallest pairs/sums", "k largest subset sums": too many candidates to list, but each one has a few obvious "next" candidates (best-first frontier).
- "repeatedly pick the best option among those currently eligible" (capital, cooldown, free rooms) → heap of eligible items, fed from a sorted or waiting list.
- "median / k-th of several sorted arrays" → order statistic by value binary search or by merging, without materialising.

**Core idea:** A heap gives the current best in O(1) and an update in O(log n), with no full sort. For top-k over n items, keep a **size-k min-heap** (its root is the weakest survivor), giving O(n log k). For a median, two heaps split the data into a lower and an upper half whose tops are the middle elements. For a huge implicit candidate set, start from the best candidate and push only its successors when it is popped.

**Skeleton:**
```python
cnt = Counter(items)                      # top-k by frequency, ties by key
h = []
for key, c in cnt.items():
    heapq.heappush(h, (c, Neg(key)))      # weakest at root; Neg flips tie order
    if len(h) > k: heapq.heappop(h)
# or: heapq.nsmallest(k, cnt.items(), key=lambda kv: (-kv[1], kv[0]))

lo, hi = [], []                           # running median: lo = max-heap (negated)
def add(x):
    heapq.heappush(lo, -x); heapq.heappush(hi, -heapq.heappop(lo))
    if len(hi) > len(lo): heapq.heappush(lo, -heapq.heappop(hi))
```

**Pitfalls:**
- Tie-breaking inside a size-k *min*-heap is inverted: to keep the lexicographically smaller word on ties, the root must hold the *larger* word. `nsmallest` with key `(-count, word)` avoids the trap.
- Python only has min-heaps: negate numbers for a max-heap. Strings cannot be negated, so wrap them or use `nsmallest`.
- Streams with deletes or updates: use lazy deletion (skip stale entries on pop) instead of trying to remove from the middle of the heap.
- Even-count median: average the two tops exactly. Use `2*median` or integer/Fraction arithmetic when the spec says so (#216).

### Clusters

#### Top-K by frequency: count with a hash map, then select with sort / size-k heap / nsmallest
- **Anchor:** [#356 Return the Most Frequent Values in an Array](problems/356-return-the-most-frequent-values-in-an-array.md). Full statement, the plain "most frequent values" form. Count, then select k with a deterministic tie rule.
- **Variants:**
  - [#125 Find top/bottom-k words in list or stream](problems/125-find-top-bottom-k-words-in-list-or-stream.md). **Differs:** top-k *and* bottom-k (two orderings of the same counts), plus a streaming version where counts change. **Follow-up of #356.**
  - [#280 Most Active Users in a Live Communication Stream](problems/280-most-active-users-in-a-live-communication-stream.md) *(inferred)*. **Differs:** dedupe by `message_id` first, and a message counts once for each of `{sender, receiver}` (a set, so self-messages count once). A live `record` is O(1) and `top_k` uses `nsmallest`. **Same concept, different setting.**
  - [#44 Design a logger that returns top-K messages](problems/044-design-a-logger-that-returns-top-k-messages.md) *(inferred)*. **Differs:** queries over a time range `[start, end]`. Logs are time-sorted, so bisect the slice, count inside it, and take the top k with `(-count, message)`. **Follow-up of #356** (range-restricted).
  - [#50 Implement frequency + distance top‑K queries](problems/050-implement-frequency-plus-distance-top-k-queries.md). **Differs:** a multi-criteria key `(-freq, distance, x, y)` for points. Part 2 is a time-keyed store that returns the value at the nearest timestamp `<= t` (bisect). **Same concept, different setting.**
  - [#99 Solve Rooms and Top-K Streams](problems/099-solve-rooms-and-top-k-streams.md) *(inferred)*. **Differs:** Part 2 is streaming top-K words (counts hash map + bounded heap on each `top()`). Part 1 is most-booked meeting room, a **near-duplicate of #240** (Intervals). **Follow-up of #356** (Part 2).

#### Running median: two balanced heaps
- **Anchor:** [#216 Track the Running Median of an Integer Stream](problems/216-track-the-running-median-of-an-integer-stream.md). Full statement, outputs `2*median` to avoid floats. Invariant: `max(lo) <= min(hi)` and `len(lo) − len(hi)` is 0 or 1.
- **Variants:**
  - [#292 Maintain streaming median and loosemedian](problems/292-maintain-streaming-median-and-loosemedian.md). **Differs:** same two heaps, and the even-count median can be non-integer (3.5). Adds a "loose median" query that accepts any value between the two middle elements. **Near-duplicate of #216.**

#### k-th largest under inserts: size-k min-heap, root = answer
- **Anchor:** [#220 Maintain k-th largest in a stream](problems/220-maintain-k-th-largest-in-a-stream.md). Classic `KthLargest(k, nums).add(x)`. Push, pop while size > k, return the root. Duplicates count as separate elements.
- **Variants:**
  - [#443 Find top-k distinct elements](problems/443-find-top-k-distinct-elements.md) *(inferred)*. **Differs:** *distinct* values only. Keep a set of the values in the heap and skip duplicates. A value evicted from the heap may legitimately come back later. **Follow-up of #220.**
  - Also see **#264 Design structure for insert and k-th largest** in Design (k is a per-query argument, so a heap no longer works; use an order-statistic tree).

#### Order statistics across sorted inputs: find the median without merging everything
- **Anchor:** [#5 Median of All Values Across Several Sorted Integer Arrays](problems/005-median-of-all-values-across-several-sorted-integer-arrays.md). Full statement, k sorted arrays. Binary search on the *value* v: count the elements `<= v` with bisect in each array, giving O(k log(range) log n). A k-way heap merge up to rank N/2 is the simpler fallback.
- **Variants:**
  - [#364 Find median of merged RLE arrays](problems/364-find-median-of-merged-rle-arrays.md) *(inferred)*. **Differs:** the arrays are run-length encoded with huge frequencies. Two-pointer merge of the *runs*, tracking positions `[seen, seen + freq)` until you reach the runs holding ranks `(N−1)//2` and `N//2`. **Same concept, different setting.**

#### Best-first frontier: pop the current best, push only its successors
- **Anchor:** [#217 Find k pairs with smallest sums](problems/217-find-k-pairs-with-smallest-sums.md). k smallest pair sums from two sorted arrays. Seed `(a[i] + b[0], i, 0)` for each i, and after popping `(i, j)` push `(i, j + 1)`. Each pair is generated at most once.
- **Variants:**
  - [#158 Return top-k subset sums in descending order](problems/158-return-top-k-subset-sums-in-descending-order.md) *(inferred)*. **Differs:** the k largest subset sums = `best − (k smallest "loss" sums)` over sorted `|nums|`. Frontier moves from (sum, i): *add* `a[i+1]` or *replace* `a[i]` with `a[i+1]`, so every subset is reached once. **Same concept, different setting.**

### Other Heap / Top-K problems
- [#279 Grow Capital by Selecting Affordable Projects](problems/279-grow-capital-by-selecting-affordable-projects.md). IPO: sort projects by required capital. Each round, push every newly affordable project's profit into a max-heap and take the top, up to k times. Pattern: "unlock by sorted threshold, choose by heap".

---

## Design / Data Structure

**Recognise it when:**
- "implement class X with methods …, each in O(1) / O(log n)": you need two structures, one for lookup and one for order.
- "least recently used / evict", "random element uniformly", "undo/redo", "min at any time".
- "implement a stack using queues / a queue using stacks", "iterator that merges/filters".
- "game engine: board, turns, win check" → only the last move can create a win.
- "training phase, then queries" → move work into preprocessing (precompute the best answer per key).

**Core idea:** Write down every operation and its target complexity, then compose structures so that each operation touches only the cheap part. Typical pairs: a hash map for "find by key" plus a doubly linked list, array, heap, or sorted list for "find by order/rank/recency". The hash map often stores a pointer or index into the second structure so both stay in sync. State the invariant linking them and keep it true on every mutating method.

**Skeleton:**
```python
class Composite:
    def __init__(self):
        self.pos = {}            # key -> index/node in self.order (lookup side)
        self.order = []          # list / DLL / heap / SortedList (ordering side)
    def add(self, key):
        if key in self.pos: return False
        self.pos[key] = len(self.order); self.order.append(key); return True
    def remove(self, key):       # O(1) array delete: swap with last, fix index, pop
        i = self.pos.pop(key); last = self.order.pop()
        if i < len(self.order): self.order[i] = last; self.pos[last] = i
```

**Pitfalls:**
- Forgetting to update **both** structures on every path (evict, overwrite, delete-last-element case).
- Validation order in game/API classes: check everything (game over → turn → bounds → occupied) *before* mutating state, or a rejected move corrupts the board.
- Two-stack queue: move items from `in` to `out` **only when `out` is empty**, otherwise you break FIFO order. Amortised O(1), not worst-case.
- Tie rules (first-seen index, lowest id, lexicographic) are part of the spec. Encode them in the key from the start.

### Clusters

#### Next-word predictor: nested counts, precompute the argmax per word for O(1) queries
- **Anchor:** [#22 Predict the Most Frequent Next Word in Constant Time](problems/022-predict-the-most-frequent-next-word-in-constant-time.md) *(inferred)*. Store `word → {next: [freq, first_seen]}`. After training, keep each word's best successor (ties by smallest first-seen index), so `predict` is a single dictionary lookup.
- **Variants:**
  - [#196 Build a next-word frequency predictor](problems/196-build-a-next-word-frequency-predictor.md) *(inferred)*. **Differs:** built from sentences split on whitespace, and ties are broken lexicographically with the key `(-count, next)`. **Near-duplicate of #22.**

#### Tic-tac-toe, K players: check only lines through the latest move
- **Anchor:** [#46 Design Tic-Tac-Toe With K Players](problems/046-design-tic-tac-toe-with-k-players.md). Full statement. Store occupied cells in a dict keyed by `(r, c)` so huge boards stay cheap, and scan the 4 directions from the new mark.
- **Variants:**
  - [#478 Implement Multi-Player Tic-Tac-Toe](problems/478-implement-multi-player-tic-tac-toe.md) *(inferred)*. **Differs:** a fixed 3-in-a-row win on a configurable board, strict status codes for invalid moves, and `undo` through a move-history stack. **Near-duplicate of #46** (with undo).

#### Stack / queue adaptors and augmented stacks: get a new behaviour from a simple container plus extra state
- **Anchor:** [#463 Implement FIFO Operations with Two Stacks](problems/463-implement-fifo-operations-with-two-stacks.md). Queue with two stacks: push to `in`, and pop/peek from `out`, refilling it from `in` only when `out` is empty. This is the cleanest amortised-analysis question.
- **Variants:**
  - [#390 Maintain LIFO Behavior Using Only FIFO Queue Operations](problems/390-maintain-lifo-behavior-using-only-fifo-queue-operations.md). **Differs:** the mirror problem, a stack from queues. Rotate the queue after each push so the newest element sits at the front (one-queue version), or swap two queues. **Same concept, different setting.**
  - [#276 Maintain Stack Values and Historical Prefix Minima](problems/276-maintain-stack-values-and-historical-prefix-minima.md). **Differs:** min-stack. Store `(value, min_so_far)` per entry so `getMin` is O(1) after pops. **Same concept, different setting.**
  - [#334 Implement Batched Undo/Redo Layer](problems/334-implement-batched-undo-redo-layer.md). **Differs:** undo/redo with batches. Two stacks of batches, record a key's old value only on its *first* edit within a batch, and clear redo on a new commit. **Same concept, different setting.**

#### Hash map + ordering structure for O(1)-ish ops: lookup side and order side kept in sync
- **Anchor:** [#144 Implement an LRU cache](problems/144-implement-an-lru-cache-9.md). LRU: hash map key → DLL node, with sentinel head/tail. `get` moves the node to the front and `put` evicts the tail.
- **Variants:**
  - [#287 Design set with O(1) random access](problems/287-design-set-with-o-1-random-access.md). **Differs:** uniform `getRandom` needs an *array* for the order side. Delete by swapping with the last element and fixing that element's index in the map. **Same concept, different setting.**
  - [#69 Implement a Reusable Locker Allocation System](problems/069-implement-a-reusable-locker-allocation-system-2.md) *(inferred)*. **Differs:** the order side is a min-heap of free locker numbers (lowest available), plus two maps (`package → locker`, `locker → package`). The same "lowest free id" heap as the room problems (#240). **Same concept, different setting.**

#### Merging multiple sequences behind an API: k-way / round-robin pulling from iterators or queues
- **Anchor:** [#514 Implement Posting and Follow-Based Recent Tweet Feeds](problems/514-implement-posting-and-follow-based-recent-tweet-feeds.md). Full statement. Twitter feed: per-user tweet lists with a global timestamp, `getNewsFeed` does a k-way heap merge of the followees' latest tweets and stops at 10.
- **Variants:**
  - [#495 Implement iterator merging lists with filtering](problems/495-implement-iterator-merging-lists-with-filtering.md) *(inferred)*. **Differs:** round-robin instead of by-time. A deque of iterators, pull one element per turn, drop exhausted iterators, and skip blocked or already-`seen` ids without spending an extra turn. **Same concept, different setting.**
  - [#484 Find Shortest Queue with Few Calls](problems/484-find-shortest-queue-with-few-calls.md) *(inferred)*. **Differs:** only `is_empty()` / `poll()` are available. Poll all queues in lock-step rounds, and the first one empty in round d is the shortest. Minimises API calls. **Same concept, different setting.**

#### Ordered multiset under streaming inserts: sorted container / count-augmented tree for neighbour or rank queries
- **Anchor:** [#329 Streaming Points: Remove Any Pair Within a Distance](problems/329-streaming-points-remove-any-pair-within-a-distance.md) *(inferred)*. Keep unpaired points in a sorted list. The nearest point is the predecessor or the successor (bisect), compared against `d + EPS`.
- **Variants:**
  - [#264 Design structure for insert and k-th largest](problems/264-design-structure-for-insert-and-k-th-largest.md) *(inferred)*. **Differs:** a rank query (k-th largest with arbitrary k per call) instead of a neighbour query. Use a sparse segment tree or BIT over the value range with counts, and descend by counts (or use SortedList indexing). **Same concept, different setting.**

### Other Design / Data Structure problems
- [#319 Design a rolling hit counter API](problems/319-design-a-rolling-hit-counter-api.md) *(inferred)*. Rolling 5-minute hit counter: a deque of `[second, count]` buckets plus a running total, and expire buckets `<= t − 300` before each operation.
- [#213 Simulate an In-Memory Directory Tree with mkdir, ls, Append and Read](problems/213-simulate-an-in-memory-directory-tree-with-mkdir-ls-append-and-read.md). In-memory file system: a trie of dicts (dir → children, file → content). Parse the path, create missing directories, `ls` returns sorted names (a file path returns just that file).
- [#405 Design compressed vector and compute dot product](problems/405-design-compressed-vector-and-compute-dot-product.md) *(inferred)*. Compressed (RLE) vector dot product: two pointers over runs, consuming `min(remaining_a, remaining_b)` per step. The same run-walking as #364.
- [#244 Design server allocation for multi-type nodes](problems/244-design-server-allocation-for-multi-type-nodes.md). A collection of system-design prompts (task scheduler, message queue, code-notebook execution, CDC import into NoSQL). Focus on API design, storage and failure handling. → really System Design (non-coding).
- [#541 Reshape a Matrix while Preserving Row Order](problems/541-reshape-a-matrix-while-preserving-row-order.md). Reshape a matrix: map flat index `k → (k // c, k % c)`, and return the original if `r*c` does not match. → really Array / index math.
- [#554 Choose Three Values with the Largest Product](problems/554-choose-three-values-with-the-largest-product.md). Max product of three: the answer is `max(top3 product, top1 × two most negative)`, found in one pass or by sorting. → really Sorting / Greedy.

---

## Stack / Parsing

**Recognise it when:**
- "nested", "brackets", "parentheses", "depth", "decode `k[...]`", "expression like `add(1, mult(2,3))`".
- "postfix / RPN", "evaluate", "let / variable scope".
- "call stack logs `id:start:t`/`id:end:t`" → the stack of currently running functions.
- Recursion would work, but "nesting up to 1e5" → explicit stack to avoid recursion limits.

**Core idea:** Nesting is last-opened, first-closed, which is exactly LIFO. On an opener, push the context you are leaving (partial string, repeat count, current depth, the operator with the arguments gathered so far). On a closer, pop it and combine the finished inner result into it. Recursive descent is the same algorithm with the call stack doing the pushing. Pass a shared index so each character is read once.

**Skeleton:**
```python
stack, cur, num = [], [], 0          # generic "open/close" frame stack
for ch in s:
    if ch.isdigit():   num = num * 10 + int(ch)
    elif ch in '([{':  stack.append((cur, num)); cur, num = [], 0
    elif ch in ')]}':
        prev, k = stack.pop()
        cur = combine(prev, cur, k)  # e.g. prev + cur*k, or apply(op, args)
    else:              cur.append(ch)   # token / separator handling
```

**Pitfalls:**
- Multi-digit and negative numbers: flush the number when the first non-digit arrives, and remember to flush at end of input.
- Integer division "truncating toward zero" in Python is `int(a / b)` (or a sign-aware `//`), not `a // b`.
- Scopes (`let`): push a copy or a chained dict per scope, and pop it on close. Inner bindings shadow outer ones and must not leak out.
- Exclusive-time logs: the end timestamp is *inclusive* (`end − start + 1`). When a child starts, credit the parent up to `t − 1`.

### Clusters

#### Depth-weighted nested sum: track depth while traversing nesting
- **Anchor:** [#303 Compute a Depth-Weighted Sum of a Nested List](problems/303-compute-a-depth-weighted-sum-of-a-nested-list.md) *(inferred)*. Given as a nested list. Recursive `depth + 1`, then an iterative version with an explicit stack of `(sublist, depth)` for deep inputs.
- **Variants:**
  - [#178 Parse a Nested-List String and Compute Its Weighted Sum](problems/178-parse-a-nested-list-string-and-compute-its-weighted-sum.md) *(inferred)*. **Differs:** the input is a *string*, so no stack is needed, only a depth counter. Build numbers digit by digit and add `num × depth` at the first non-digit. **Same concept, different setting.**

#### Evaluate nested expressions: recursive descent, or an explicit stack of (op, args) frames
- **Anchor:** [#231 Solve Two Coding Interview Problems](problems/231-solve-two-coding-interview-problems.md). Full statement. Problem 1: `op(expr, expr)` grammar with a shared index. Problem 2: max bomb chain reaction (directed graph where i → j if j is within i's radius, BFS from each node; → really Graph).
- **Variants:**
  - [#310 Implement Employee Management and Expression Evaluation](problems/310-implement-employee-management-and-expression-evaluation.md) *(inferred)*. **Differs:** Part 2 is the same function-call evaluator with an explicit frame stack (depth up to 1e5) and negative ints. Part 1 is an org chart with `manager` / `reports` maps where removing an employee re-parents its reports. **Near-duplicate of #231** (Part 2).
  - [#184 Evaluate a Lisp-Style Expression Language with let, add and mult Scoping](problems/184-evaluate-a-lisp-style-expression-language-with-let-add-and-mult-scoping.md). **Differs:** Lisp `let/add/mult` adds variables, with lexical scope, shadowing and sequential rebinding. Keep a scope stack of dicts. **Follow-up of #231.**
  - [#380 Evaluate Postfix Arithmetic with Truncating Integer Division](problems/380-evaluate-postfix-arithmetic-with-truncating-integer-division.md). **Differs:** postfix needs no parsing of structure: push operands, and an operator pops right then left. Truncate division toward zero. **Same concept, different setting** (simplest form).

#### Bracket matching and nested decoding: push on open, resolve on close
- **Anchor:** [#249 Check Matching and Nested Brackets](problems/249-check-matching-and-nested-brackets.md). Valid brackets: push the expected closer and fail on a mismatch or a non-empty stack at the end. The base of everything in this section.
- **Variants:**
  - [#445 Decompress encoded string with nested repeats](problems/445-decompress-encoded-string-with-nested-repeats.md) *(inferred)*. **Differs:** the frames carry data: on `[` push `(text_so_far, k)`, and on `]` set `text = prev + text * k`. Output length can explode, so discuss it. **Follow-up of #249.**
  - [#341 Solve three coding interview problems](problems/341-solve-three-coding-interview-problems.md). **Differs:** Part 1 is the decode string from #445. Part 2 is max profit with jump decisions (1-D DP). Part 3 is counting connected land components (grid DFS/BFS; → really Graph). **Near-duplicate of #445** (Part 1).

### Other Stack / Parsing problems
- [#509 Separate Nested Function Calls into Exclusive Times](problems/509-separate-nested-function-calls-into-exclusive-times.md). Exclusive time of functions: a stack of running ids. On start, credit the top up to `t − 1`. On end, credit the popped id with `t − prev + 1` and set `prev = t + 1`. Interval-like logs, compare with #36.
- [#222 Parse strings and find meeting slots](problems/222-parse-strings-and-find-meeting-slots.md). Parse `@user` and a signed int per line with regex and sum per user. Then count users available per day and emit length-x windows of consecutive valid days. → really Hashing / Sliding window.
- [#542 Decide Whether Four Cards Can Form Twenty-Four](problems/542-decide-whether-four-cards-can-form-twenty-four.md). 24 game: try every pair, combine it with each operator, recurse on 3 then 2 values, and use an epsilon for division. → really Backtracking.

---

## Monotonic Stack

**Recognise it when:**
- "next / previous greater (or smaller) element", "first larger value to the right".
- "how many can X see", "visible", "blocked by someone taller".
- "largest rectangle", "span", "how far left/right until a smaller bar".
- "circular array" + next-greater → iterate `2n` indices with `i % n`.

**Core idea:** Keep a stack of indices whose answer is still unknown, in monotone order of value. A new element pops everything it "beats" and becomes the answer for each popped index, so every index is pushed and popped once (O(n)). Whatever remains on the stack at the end has no answer. For the rectangle problem, a popped bar's width is bounded by the new element on the right and the next stack element on the left.

**Skeleton:**
```python
ans = [-1] * n
st = []                                   # indices, values decreasing
for k in range(2 * n if circular else n):
    i = k % n
    while st and a[st[-1]] < a[i]:        # strict: equal values don't resolve
        ans[st.pop()] = a[i]
    if k < n: st.append(i)                # second pass only resolves
```

**Pitfalls:**
- Strict vs non-strict comparison decides how duplicates behave. Read "strictly larger" carefully.
- Circular arrays: push only during the first pass, or indices get answers from themselves.
- Histogram: add a sentinel 0 at the end (or flush the stack) so the remaining bars are measured.

### Clusters

#### Next-greater / next-smaller family: each index is resolved when a dominating value arrives
- **Anchor:** [#13 Find the first larger value for every element of a circular array](problems/013-find-the-first-larger-value-for-every-element-of-a-circular-array.md). Full statement, the pure next-strictly-greater over a circular array, with the two-pass trick and equal values popping nothing.
- **Variants:**
  - [#33 Count Visible People per Position When Only Someone Taller Than Both Blocks](problems/033-count-visible-people-per-position-when-only-someone-taller-than-both-blocks.md). **Differs:** count instead of finding one value. Each person sees everyone popped (shorter) plus the one who stops the pops. Run both directions and add, and handle equal heights per the unusual "taller than both" rule. **Same concept, different setting.**
  - [#297 Find the Largest Rectangle Under Histogram Bars](problems/297-find-the-largest-rectangle-under-histogram-bars.md). **Differs:** use next-*smaller* on both sides. When bar j is popped by i, its rectangle spans `(st[-1], i)`. Area = `h[j] × width`. **Same concept, different setting.**

### Other Monotonic Stack problems
- [#153 Find the Largest Monotone Increasing Number](problems/153-find-the-largest-monotone-increasing-number.md) *(inferred)*. Largest number `<= n` with non-decreasing digits: scan right to left, and on `d[i−1] > d[i]` decrement `d[i−1]` and mark where 9s start (the decrement cascades). → really Greedy / digits.
- [#172 Return Unique Three-Sum Value Triples](problems/172-return-unique-three-sum-value-triples.md). 3Sum unique triples: sort a copy, fix i (skip duplicates), then two pointers on the rest. → really Two Pointers / Sorting.

---

## Segment Tree / Fenwick

**Recognise it when:**
- "for each position, count later/earlier elements smaller/greater" (inversion-style counts).
- "position of an item in a line where items in the middle can be removed".
- "point update + prefix/range sum or count, many times" with n and q up to 1e5.
- "first index with property, then update it" → segment tree with descent.

**Core idea:** A Fenwick tree stores partial sums over power-of-two blocks, so both a point update and a prefix sum cost O(log n). To count "smaller later" elements, scan from the right and query the prefix over compressed values. To get a live position, put 1 at each active arrival index and query the prefix sum. A segment tree adds range min/max and "find first index ≥ x" by walking down the tree.

**Skeleton:**
```python
bit = [0] * (n + 1)
def update(i, d):            # 1-indexed
    while i <= n: bit[i] += d; i += i & -i
def query(i):                # sum of [1..i]
    s = 0
    while i > 0: s += bit[i]; i -= i & -i
    return s
# coordinate-compress values first: rank = {v: r for r, v in enumerate(sorted(set(a)), 1)}
```

**Pitfalls:**
- Off-by-one: a BIT is 1-indexed, so `query(rank − 1)` gives "strictly smaller" and `query(rank)` gives "≤".
- Compress the values before using them as indices (values up to 1e9).
- For "earliest party with size ≤ c" a BIT is not enough: you need a min-segment tree over arrival order (or sorted sets per size).

### Clusters

#### Fenwick prefix counts over an ordering: an active-marker BIT answers "how many before me"
- **Anchor:** [#479 Count Strictly Smaller Later Occurrences for Every Position](problems/479-count-strictly-smaller-later-occurrences-for-every-position.md). Count smaller after self. Scan right to left, query `rank − 1` and then add the current value's rank. The textbook BIT problem.
- **Variants:**
  - [#16 Design a restaurant waitlist system](problems/016-design-a-restaurant-waitlist-system.md). **Differs:** the BIT is over *arrival order*. Mark 1 per active party so `getPosition` is a prefix sum, and cancel sets it to 0. Seating "earliest party with size ≤ c" needs a second structure (segment tree of min size over arrival, then descend). **Same concept, different setting.** Simpler cousin: #263 Part 2.

---

## Simulation

**Recognise it when:**
- "given logs / events in time order, compute timeouts / sessions / tolls / duplicates".
- "message reappears only if more than N seconds since last *displayed*".
- "grid evolves each tick", "queue at a turnstile with priority rules", "spiral order".
- "file too large for memory" → stream in chunks, parallelise, combine.

**Core idea:** Do exactly what the spec says, but keep only the state you need: usually a hash map from entity to its last state (last checkpoint, last displayed time, open start). Most bugs are in boundary rules, so write those rules down as code comments before coding. When ticks are expensive, jump time to the next event, or turn the whole thing into BFS distances.

**Skeleton:**
```python
last = {}                                  # entity -> last relevant state
out = []
for ts, key, payload in events:            # sort first if order isn't guaranteed
    prev = last.get(key)
    if prev is None or rule(prev, ts, payload):
        out.append(emit(key, ts, prev))
        last[key] = ts                     # update only when the spec says so
# flush entities still "open" at end of log
```

**Pitfalls:**
- Strict vs non-strict boundaries (`> T` vs `>= T`, timeout exactly equal).
- Updating the state on suppressed events (in #152, hidden repeats must *not* reset the timer).
- Assuming the input is sorted or each id appears once: group, then sort per key.
- Entities still open at end of input (#36: calls with no end record use the last timestamp as `now`).

### Clusters

#### Log processing with a per-key state map: one pass (sometimes after grouping and sorting) with a hash map of the last state per entity
- **Anchor:** [#36 Detect timed-out RPC calls from paired start and end log records](problems/036-detect-timed-out-rpc-calls-from-paired-start-and-end-log-records.md). Full statement. Pair start/end per call id. Calls without an end use the final log timestamp. Strict timeout comparison, deterministic output order.
- **Variants:**
  - [#128 Count user sessions from logs](problems/128-count-user-sessions-from-logs.md). **Differs:** group timestamps per user and sort them (the input may be unsorted). A new session starts when the gap is `> T`. **Same concept, different setting.**
  - [#152 Filter Repeated Robot Status Messages](problems/152-filter-repeated-robot-status-messages.md) *(inferred)*. **Differs:** the state is the last *displayed* time per message, and you update it only when you display. **Same concept, different setting** (rate limiter / logger).
  - [#123 Calculate Highway Tolls from Ordered Checkpoint Logs](problems/123-calculate-highway-tolls-from-ordered-checkpoint-logs.md) *(inferred)*. **Differs:** the state is the last checkpoint per plate. The fee between checkpoints comes in O(1) from prefix sums `|prefix[c2] − prefix[c1]|`, and reversals still charge. **Same concept, different setting.**
  - [#207 Deduplicate and Order Batch and Streaming Logs](problems/207-deduplicate-and-order-batch-and-streaming-logs-2.md) *(inferred)*. **Differs:** the hash map holds the one valid version per message (first-seen or latest-seen policy), and a min-heap holds the order. Stale heap entries are skipped (lazy deletion), and both batch and streaming APIs are required. **Follow-up of #152** (heavier state).
  - [#187 Find shared objects across two log files](problems/187-find-shared-objects-across-two-log-files.md). **Differs:** two log files. Keep a per-object set of days/clients and intersect. The follow-up is external-memory (hash-partition both files by object id). **Same concept, different setting.**

### Other Simulation problems
- [#143 Infection Spread on a Grid (Cellular Automaton)](problems/143-infection-spread-on-a-grid-cellular-automaton.md) *(inferred)*. Infection on a grid: multi-source BFS gives each cell's infection tick instead of re-scanning the grid every tick. → really Graph BFS.
- [#181 Compute Turnstile Crossing Times](problems/181-compute-turnstile-crossing-times.md) *(inferred)*. Turnstile: separate enter and exit queues, the last-used direction decides priority, and time jumps to the next arrival when both queues are empty. O(n).
- [#239 Determine winner in stack-merging game](problems/239-determine-winner-in-stack-merging-game.md) *(inferred)*. Stack-merging game: memoised win/lose search over canonical states (a sorted tuple of `(top_colour, height)`). → really Game theory / DP.
- [#271 Read a Matrix Along Its Inward Spiral](problems/271-read-a-matrix-along-its-inward-spiral.md). Spiral matrix: shrink four boundaries, and guard the single-row/column cases so cells are not double-counted.
- [#340 Find maximum value in huge text file](problems/340-find-maximum-value-in-huge-text-file.md). Max value in a huge text file: stream line by line or in chunks (careful at chunk boundaries), take the max per chunk in parallel, then combine. Discuss I/O-bound vs CPU-bound.

---

## Other (non-coding)

### Other Other (non-coding) problems
- [#136 Troubleshoot CPU, latency, and DNS issues](problems/136-troubleshoot-cpu-latency-and-dns-issues.md). Linux troubleshooting: CPU (`top`, `mpstat`, `perf`), I/O (`iostat`, `iotop`), latency (`ping`, `mtr`, `tcpdump`), DNS (`dig`, `nslookup`, `/etc/resolv.conf`). Go layer by layer, from symptom to tool to hypothesis.

---

## Cross-pattern links
- **Intervals + Heap:** #240, #487, #320, #258, #45, #328, #313, #89, #99 (two heaps: free ids and busy-by-end), #337 (heap of end times), #339 (sweep + max-heap with lazy deletion), #257 (ready/waiting heaps on a call clock).
- **Heap + Hashing (top-k frequent):** #356, #125, #280, #44, #50, #99, #89 Q1. Count with a hash map, then select with a bounded heap or `nsmallest`.
- **Design + Linked List / Array / Heap:** #144 (LRU = hash map + DLL), #287 (hash + array swap-with-last), #69 (hash + min-heap of free ids, the same "lowest free id" idea as #240), #263 Part 2 (hash + DLL waitlist).
- **Design + Order statistics / Fenwick:** #264 (count tree, k-th largest) ↔ #220/#443 (heap when k is fixed). #16 and #263 Part 2 (BIT for live position) ↔ #479.
- **Design + k-way merge:** #514 (feed merge) ↔ #5 (median across k sorted arrays) ↔ #217 (frontier heap).
- **Run-length two-pointer walk:** #405 (RLE dot product) ↔ #364 (RLE median) ↔ #141 / #74 Part 3 (two-pointer interval merge or intersection).
- **Intervals + DP / Binary Search:** #52 (sort by end + bisect + DP). #260 and #105 follow-up (bisect on sorted disjoint ranges). #376 (state-machine DP, Dynamic Programming family).
- **Intervals + Greedy:** #209 Part 2 (min intervals to cover, jump-game greedy).
- **Stack + Intervals/Logs:** #509 (call-stack exclusive time) ↔ #36 (RPC start/end pairing).
- **Simulation + Graph BFS:** #143 (multi-source BFS). Also multi-part graph pieces in #313 and #337 (Dijkstra), #231 (bomb chain BFS), #341 Part 3 (islands).
- **Simulation + Heap (lazy deletion):** #207 ↔ #339 ↔ #257.

## Must-do anchors (intervals, heaps & design)
1. **#240 Assign meetings to rooms with delays**. Fixed rooms, lowest free id, delay with the same duration, count usage. Covers #487, #320, #99 P1 and, by dropping the delay branch, #258.
2. **#35 Minimum Number of Rooms to Schedule Overlapping Meetings**. Peak concurrency and the end-before-start tie rule. Unlocks #31, #100, #101, #337, #263 P3.
3. **#45 Assign the Minimum Fleet to Rental Reservations**. Min fleet with a concrete assignment (open a new id only when forced). Unlocks #328, #313 P2, #89 Q3.
4. **#214 Compute minimum servers for cyclic tasks**. Normalise wrap-around before sweeping. Unlocks #266 and the job_id merging of #68.
5. **#202 Find safe travel intervals between planet influences**. Sort + merge + complement gaps (touching rules). Unlocks #307, #141, #74 P3, #105.
6. **#108 Intervals with Exactly X Concurrent Meetings**. Sweep that emits segments with constant state. Unlocks #167 and is a step toward #339 skyline.
7. **#356 Return the Most Frequent Values in an Array**. Top-K frequent with deterministic ties. Unlocks #125, #280, #44, #50, #99 P2.
8. **#216 Track the Running Median of an Integer Stream**. Two-heap running median and its balance invariant (#292).
9. **#144 Implement an LRU cache**. LRU: the template for "hash map + ordering structure" designs (#287, #69).
10. **#13 Find the first larger value for every element of a circular array**. Monotonic stack with circular two-pass and strict comparisons. Unlocks #33, #297.
11. **#231 Solve Two Coding Interview Problems**. Recursive descent / frame stack for nested expressions. Unlocks #310, #184, #380, #445.
12. **#52 Choose Non-Overlapping Weighted Jobs to Maximize Total Profit**. Weighted interval scheduling (sort by end + bisect + DP), for when counting overlaps is not enough.
