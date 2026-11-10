# Google SWE Intern — Pattern Study Guide

373 real Google coding questions from PracHub, grouped by the concept that solves them. 254 have the original statement. 119 were locked, so their statements were reconstructed from PracHub's overview and community answers. Those are marked *(inferred)*.

**How this guide is meant to be used:** you are not trying to remember 373 solutions. You are trying to recognise about 25 patterns quickly and know how each one bends. Every pattern section gives you:

1. **Recognise it when:** the words in a problem statement that should trigger the pattern.
2. **Core idea + skeleton:** the reusable structure. You rebuild it each time; you don't memorise it.
3. **Clusters:** problems that are really the same problem. Solve the **anchor** properly. For each **variant**, practise only spotting *what changes* and *how the anchor adapts*.

---

## 1. From problem statement to pattern

Read the statement looking for these signals before thinking about code.

| If the problem says… | Think | First move |
|---|---|---|
| grid / cells / neighbours, "reachable", "number of regions" | Graph BFS/DFS | visited set + 4-direction loop |
| "shortest number of steps", unweighted | BFS | queue, level by level |
| weighted edges, "minimum cost/time", non-negative weights | Dijkstra | min-heap of (dist, node) |
| "minimise the maximum edge/height on a path" | Dijkstra on max, or binary search + BFS | the path cost is a max, not a sum |
| "earliest time everyone is connected", merging groups, online connectivity | Union-Find | sort events, union, track component count |
| prerequisites, dependencies, "valid order", detect cycle | Topological sort | in-degree + queue (Kahn) |
| prefix lookups, autocomplete, many words sharing starts | Trie | dict-of-children nodes |
| "minimum rooms / servers / cars at the same time" | Intervals + heap, or sweep | sort by start, min-heap of end times |
| merge / insert / overlap / free time across calendars | Interval merging | sort by start, extend or flush |
| "top k", "k-th largest", "most frequent", running median | Heap | size-k heap, or two heaps |
| "next greater / smaller", "visible people", spans | Monotonic stack | stack of indices waiting for an answer |
| longest/shortest **contiguous** subarray/substring with a condition | Sliding window | grow right, shrink left while invalid |
| sorted input, pairs/triples hitting a target, in-place rearrange | Two pointers | lo/hi moving inward, or read/write pointers |
| "subarray sum equals k" (negatives allowed), range sums | Prefix sum + hashmap | count of each prefix seen so far |
| sorted array + O(log n), or "smallest X such that it works" | Binary search | define `feasible(x)`, keep the invariant |
| "count the ways", "min/max cost to reach", overlapping choices | DP | state = what you need to know about the prefix |
| "all / every combination / permutation / arrangement", n ≤ 20 | Backtracking | choose → explore → unchoose |
| O(1) per operation, design a class/cache/iterator | Design | hashmap + a second structure (list, heap, DLL) |
| nested brackets, expressions, "evaluate", decode `3[ab]` | Stack | push on open, resolve on close |
| many range queries **with updates** | Fenwick / segment tree | point update, prefix query |

## 2. Constraints tell you the target complexity

Before coding, read the input size and work out the complexity budget. Assume about 10⁸ simple operations per second.

| Input size | Target | Usually means |
|---|---|---|
| n ≤ 10 | O(n!) | permutations, brute force |
| n ≤ 20 | O(2ⁿ · n) | bitmask DP, backtracking |
| n ≤ 500 | O(n³) | interval DP, Floyd–Warshall |
| n ≤ 5,000 | O(n²) | 2-D DP, all pairs |
| n ≤ 10⁵–10⁶ | O(n log n) or O(n) | sort, heap, window, hashing, binary search |
| values up to 10⁹–10¹⁸ | O(log V) iterations | binary search on the value / answer |
| q queries ≤ 10⁵ on static data | precompute, O(1)–O(log n) per query | prefix sums, sorting + bisect |
| q queries **with updates** | O(log n) per operation | Fenwick / segment tree, heap with lazy deletion |
| "O(1) per call" in a design problem | hashmap-based | hashmap + list index swap, or hashmap + doubly linked list |

## 3. When you're stuck (in roughly this order)

1. **Write the brute force out loud.** Then ask: what work is it repeating? That repeated work is where memoisation, a hashmap, or a sorted structure goes.
2. **Sort it.** Many interval, greedy and two-pointer problems become obvious once the input is sorted.
3. **Ask what is monotone.** If "works for X" implies "works for X+1", you can binary search the answer.
4. **Model it as a graph.** States are nodes and moves are edges. "Minimum moves" then means BFS.
5. **Reverse the process.** Removing cells is hard; adding them is Union-Find. Deleting is hard; inserting backwards is easy.
6. **Fix one dimension.** Loop over one index and solve the remaining 1-D problem with a window, heap or hashmap.
7. **Shrink the example.** Solve n = 1, 2, 3 by hand and look for the recurrence.

## 4. The 45-minute interview framework

Google interviewers score four things: communication, problem solving, coding, and verification. Practise all four, not just the solution.

| Minutes | Do | Say out loud |
|---|---|---|
| 0–5 | **Clarify.** Input size, value ranges, duplicates, empty input, output format, tie-breaking. | "Can the array be empty? Are values negative? If there's a tie, which one do you want?" |
| 5–10 | **Examples.** Work one normal and one edge case by hand. | "Let me check I understand with a small example…" |
| 10–15 | **Brute force, then optimise.** State the complexity of each. | "Naively it's O(n²) because… The repeated work is…, so I can use a… for O(n log n)." |
| 15–35 | **Code.** Use clean names and small helper functions. | Narrate the invariant: "the window always holds at most k distinct characters." |
| 35–42 | **Test by tracing.** Use your examples plus the edge cases from §5. | "Let me trace the empty case… the single-element case…" |
| 42–45 | **Complexity and follow-ups.** | "Time O(n log n), space O(n). If this were a stream, I'd…" |

You may not be able to run code in the interview. Practise in a plain editor and trace by hand.

## 5. Edge-case checklist (run through it before saying "done")

- Empty input, a single element, all elements equal
- Duplicates, and the tie-breaking rule
- Negative numbers and zero (these break sliding windows over sums; use prefix sums instead)
- Overflow, if the interviewer asks about Java or C++
- Off-by-one: inclusive vs exclusive ends, `lo < hi` vs `lo <= hi`, intervals touching at an endpoint
- Graphs: disconnected components, cycles, self-loops, an unreachable target (return −1?)
- Grids: 1×n and n×1, start equal to target, start blocked
- Trees: null root, a skewed tree (recursion depth), duplicate values
- Strings: case sensitivity, spaces, Unicode vs ASCII

## 6. How to study the clusters without memorising

- **Anchor (25–35 min):** attempt it timed. If you're stuck at 20 minutes, open the hints, then the approach. After solving, write a 3-line note in your own words: *cue → invariant → pitfall*.
- **Variants (3–5 min each):** read the statement only. Say what's different from the anchor and how your approach changes, then check the guide's **Differs** line. Code it only if your answer was wrong or vague.
- **Next morning:** rebuild the skeletons from the previous day from memory, about 2 minutes each. This is recall practice, not memorising solutions.
- **Final day:** do 2–3 timed mocks on problems you haven't seen, picked from different patterns, using the full 45-minute framework.

## 7. Inferred problems with uncertain details

These problems' statements were reconstructed with real guesswork about format or rules, mostly multi-part questions or ones with very short overviews. Use them to practise the concept. Don't trust the exact I/O, and don't be surprised if the real interview version differs.

- **Multi-part, with the parts guessed from a one-line overview:** #99, #110, #124, #170, #209, #234, #236, #263, #313, #335, #489
- **Input format or rules assumed:** #44, #54, #57, #63, #67, #69, #93, #126, #142, #143, #166, #167, #207, #239, #258, #260, #264, #280, #281, #285, #289, #309, #310, #317, #328, #329, #337, #398, #403, #484, #495
- **Interpretation choice that changes the problem:** #90 (undirected relation), #182 (direction rules), #185 (max cell value vs max height difference), #198 (cake shape), #210 (rule for which keys jam), #214 (daily recurrence), #218 (positive squares only), #265 (objective), #266 (circular day), #338 (meaning of "single modification"), #444 (full row/column boards → bipartite cover)
- **Near-duplicates deliberately made different:** #134 vs #82, #290 vs #261, #320 vs #487, #363 (Part 2 added)

---
