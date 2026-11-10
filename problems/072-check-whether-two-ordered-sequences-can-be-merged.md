# Check Whether Two Ordered Sequences Can Be Merged
> Google · Onsite · medium · Pattern: Dynamic Programming
> Source: https://prachub.com/interview-questions/check-whether-two-ordered-sequences-can-be-merged

You are given two arrays of integer labels, `a` and `b`. The order of labels in each array gives ordering constraints: an earlier label must appear before every later label from that array.

Determine whether there is one ordering containing each distinct label from either array exactly once while preserving the relative order specified by both arrays. Return `true` if such an ordering exists and `false` if the constraints conflict. Only the Boolean feasibility result is required; the source report explicitly permits this form instead of returning a valid ordering.

### Input and Output

- Inputs: arrays `a` and `b` of integer labels. Equal labels across the two arrays identify the same item. The numeric values are identifiers; numeric sort order imposes no constraint.
- Output: one Boolean value.

For this practice version, labels within each individual array are distinct, though a label may occur in both arrays. Label values fit in signed 32-bit integers. An empty array imposes no ordering constraints, so two empty arrays are feasible. The source report does not specify repeated labels within one array or an input-size bound.

### Example 1

```text
a = [1, 2, 3]
b = [2, 4, 5]
answer = true
```

The ordering `[1, 2, 3, 4, 5]` satisfies both arrays.

### Example 2

```text
a = [1, 6, 4]
b = [4, 1]
answer = false
```

The first array requires `1` before `4`, while the second requires `4` before `1`.

<details><summary>Hints (spoiler)</summary>

1. Both arrays impose earlier-before-later constraints.
2. Two empty arrays impose no constraints.
</details>

<details><summary>Approach (spoiler)</summary>

A sequence’s consecutive labels are enough to enforce every earlier-before-later relation by transitivity. Build one directed edge between each consecutive pair in each input, deduplicating edges shared by both sequences. A merged ordering exists exactly when the resulting directed graph has no cycle. Repeatedly remove zero-indegree labels; if every distinct label can be removed, their removal order is a valid merge. If some remain, they form or depend on a cycle, so no merge can satisfy both sequences. Label values are treated only as identities.

**Time:** O(|a| + |b|) expected time with hash-based adjacency and indegrees. · **Space:** O(|a| + |b|) for distinct labels, edges, and the queue.
</details>
