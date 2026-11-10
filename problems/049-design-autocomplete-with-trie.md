# Design autocomplete with Trie
> Google · Onsite · medium · Pattern: Trie, Tree Traversal / BST, Design / Data Structure
> Source: https://prachub.com/interview-questions/design-autocomplete-with-trie

Design and implement an **autocomplete service** backed by a prefix tree (Trie).

The service stores a dynamic dictionary of words, each carrying an integer **weight** (e.g. a popularity or frequency score). It must support four operations:

- `insert(word, weight)` — add a new word with the given weight.
- `update(word, newWeight)` — change the weight of an existing word.
- `delete(word)` — remove a word from the dictionary.
- `topK(prefix, k)` — return the `k` highest-weight words that share `prefix`, breaking ties **lexicographically** (smaller string first). If fewer than `k` words match, return all of them.

Words consist of lowercase English letters (`a`–`z`). Assume `topK` is the hot path — it is called far more often than the mutations.

Your answer should:

1. Describe the node structure and any **auxiliary data structures** you maintain per node to make `topK` efficient.
2. Implement all four operations.
3. Analyze the **time and space complexity** of each operation.
4. Discuss the **trade-offs** between precomputing/caching `topK` candidates at each node versus computing them on demand by traversing the subtree.

```hint Where to start
A Trie cleanly answers "which words share this prefix?" — every word in the subtree rooted at the node you land on after walking `prefix`. The open question is how to get the *top-k by weight* out of that subtree without scanning all of it on every query.
```

```hint Make topK fast
To avoid an $O(\text{subtree size})$ scan per query, **propagate the best candidates up the spine**. Maintain at each node a small sorted structure (e.g. a sorted list or a bounded max-structure) of the top words in its subtree, keyed by `(-weight, word)`. Then `topK` is just: walk to the prefix node, read its cached top list.
```

```hint Handling update and delete
A weight change or deletion can alter the cached top lists of **every ancestor** on the path from the word's terminal node to the root. Store the full `(word → weight)` map for words ending at each node, and on any mutation, **re-derive the cached top list for each node along the affected path**. Think about why only the path to the root — not the whole tree — needs touching.
```

### Constraints & Assumptions

- Alphabet: lowercase English letters only, so each node has at most 26 children.
- Let $L$ = length of the affected word, $P$ = length of the query prefix, $N$ = number of words in the dictionary, $K$ = the cap on cached candidates per node (you pick this; it must be $\ge$ the largest `k` you expect to serve).
- Weights are integers; assume they fit in a machine word and ties on weight are broken by lexicographic order of the word.
- `topK` dominates the workload; mutations (`insert`/`update`/`delete`) are comparatively rare, so it is acceptable to do more work on mutation to keep `topK` cheap.
- A reasonable single-machine, in-memory dictionary (thousands to low millions of words). Distribution/sharding is out of scope unless raised as a follow-up.

### Clarifying Questions to Ask

- Is `topK` truly the hot path, and is there a known upper bound on `k`? (This decides whether to cache a fixed top-$K$ per node or compute on demand.)
- How are ties broken — purely lexicographic, or by insertion recency / some secondary key?
- Should `topK(prefix, k)` include the word that *equals* `prefix` exactly, or only strict extensions? (Assume it includes an exact match unless told otherwise.)
- What is the relative frequency of mutations vs. queries, and is the dictionary mostly static after load? (Affects whether to optimize for build-once or for live updates.)
- What is the behavior of `update` on a missing word or `insert` on an existing word — error, no-op, or overwrite?

### What a Strong Answer Covers

- **Correct Trie + per-node augmentation**: words live at terminal nodes with weights; each node caches a bounded, sorted top-$K$ list of `(weight, word)` for its subtree under the `(-weight, lexicographic)` ordering.
- **All four operations implemented** and consistent with each other — especially that `update`/`delete` correctly refresh the cached lists along the root path so a later `topK` reflects the change.
- **Honest complexity analysis** per operation in terms of $L$, $P$, $K$, and the branching factor 26, distinguishing the precompute-on-mutation cost from the $O(P + k)$ query cost.
- **The central trade-off**: cache-at-node (fast queries, heavier and trickier mutations, extra space) vs. compute-on-demand (cheap mutations, simple, but $O(\text{subtree})$ queries). A strong candidate states which they'd choose given "topK is the hot path" and why.
- **Edge cases**: empty/missing prefix, fewer than `k` matches, deleting a non-existent word, an internal node that is also a word, and stable tie-breaking.
- **A clean dry run** that tracks the cached top lists as the dictionary mutates (see below).

### Dry-Run to Walk Through

Trace your implementation — and the cached state it produces — on this exact sequence, stating the output of each `topK`:

```
insert('cat', 5)
insert('car', 3)
insert('cart', 8)
insert('dog', 2)
topK('ca', 2)
update('car', 9)
topK('ca', 2)
delete('cart')
topK('ca', 2)
```

### Follow-up Questions

- How does your design change if `k` is **unbounded** (the caller may request any `k`), so you cannot fix a per-node cache size $K$ in advance?
- The dictionary grows to hundreds of millions of words and no longer fits on one machine. How would you **shard** the Trie and serve `topK` across shards while keeping the global top-$k$ correct?
- Suppose weights drift continuously (e.g. live click counts). Would you keep refreshing caches synchronously on every mutation, or batch/debounce them? What correctness vs. freshness trade-off does that introduce?
- How would you support **fuzzy** autocomplete (tolerating one typo in the prefix) on top of this structure?

<details><summary>Hints (spoiler)</summary>

1. A Trie answers 'which words share this prefix?' for free: after walking the prefix, the node you land on roots the subtree of all matching words. The open question is getting top-k by weight out of that subtree without scanning it on every query.
2. Propagate the best candidates up the spine: at each node cache a small sorted list of its subtree's top words keyed by (-weight, word). Then topK is just walk-to-prefix-node and read the cached list — O(P + k).
3. A weight change or deletion can only affect the cached lists of ancestors on the path from the word's terminal node to the root. Re-derive each node's cache bottom-up along that path from its own word plus its children's caches; every node off the path stays valid.
4. Include the node's OWN terminal word when rebuilding, not just children — an internal node can also be a complete word (e.g. 'car' is a prefix of 'cart').
</details>
