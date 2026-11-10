# Count Visible People per Position When Only Someone Taller Than Both Blocks
> Google · Technical Screen · medium · Pattern: Monotonic Stack
> Source: https://prachub.com/interview-questions/count-visible-people-per-position-when-only-someone-taller-than-both-blocks

People stand in a line, and `heights[i]` is the height of the person at position `i`. Two people can see each other if no one standing between them is taller than both of them.

The interviewer first asked how many people the last person in the line can see, and then asked for the same count for every person in the line. Implement the general version: return, for every person, the number of other people they can see. The last element of the result answers the first question. In the interview, the code was written in a plain editor that could not compile or run it.

### Function Signature

```python
def count_visible(heights: list[int]) -> list[int]:
```

### Rules

- Persons `i` and `j` with `i < j` can see each other if and only if there is no position `k` with `i < k < j`, `heights[k] > heights[i]` and `heights[k] > heights[j]`. People standing next to each other (`j = i + 1`) can always see each other.
- Equal heights never block: a person exactly as tall as the taller of the two does not block their view.
- Visibility is mutual, and a person can see people on both sides of them. A person does not count themselves.
- Return a list `result` with the same length as `heights`, where `result[i]` is the number of positions `j != i` such that persons `i` and `j` can see each other.

### Constraints

- `1 <= len(heights) <= 10^5`
- `1 <= heights[i] <= 10^9`
- Heights are not necessarily distinct.

### Examples

**Example 1**

```text
Input:  heights = [1, 10, 6, 7, 9, 8, 2, 4, 3, 5]
Output: [1, 9, 3, 3, 8, 6, 5, 6, 5, 6]
```

The last person (height 5) can see the people of heights 3, 4, 2, 8, 9 and 10, which is 6 people. They cannot see the people of heights 7 and 6, because the person of height 9 between them is taller than both, and they cannot see the person of height 1, because the person of height 10 is taller than both. The person of height 2 at position 6 sees heights 8, 9 and 10 on the left and heights 4 and 5 on the right, which is 5 people; they cannot see the person of height 3 at position 8, because the person of height 4 between them is taller than both 2 and 3.

**Example 2**

```text
Input:  heights = [5, 1, 5, 2]
Output: [3, 2, 3, 2]
```

The person of height 2 at the end sees the person of height 5 next to them and the person of height 5 at position 0: the 5 between them is exactly as tall as the taller of the two, so it does not block. They cannot see the person of height 1, because the 5 between them is taller than both 1 and 2.

**Example 3**

```text
Input:  heights = [7]
Output: [0]
```

A single person has no one to see.

<details><summary>Hints (spoiler)</summary>

1. Rewrite the blocking rule as one comparison: a pair is blocked exactly when someone strictly between them is taller than the taller of the two.
2. Visibility is mutual and a person looks both ways, so each answer splits into a count of visible people on the left plus a count on the right.
3. With up to 10^5 people, checking every pair is too slow; as you sweep along the line, think about which earlier people can still be seen past the people who came after them.
</details>

<details><summary>Approach (spoiler)</summary>

Restate the rule: persons i < j see each other exactly when the tallest person strictly between them is no taller than max(heights[i], heights[j]). Because visibility is mutual and people look both ways, result[i] = (people visible to the left of i) + (people visible to the right of i), and the right-hand counts are the left-hand counts of the reversed line, read back in reverse.

Left counts. Fix j and let p be the nearest index p < j with heights[p] > heights[j] (strictly taller). If there is none, everyone strictly between any i < j and j is at most heights[j], so all j people to the left are visible. Otherwise every i in [p, j - 1] is visible for the same reason, giving j - p people; for i < p the person p stands between them and is taller than heights[j], so i is visible exactly when heights[i] >= max(heights[i+1..j-1]), that is, when nobody after i and before j is strictly taller than i.

Invariant. Sweep left to right with a stack that holds exactly the indices i < j that nobody in (i, j) strictly exceeds. Before pushing j, pop every index strictly shorter than heights[j]; equal heights stay because equal heights never block. Heights along the stack are non-increasing, so the entries strictly taller than heights[j] form a prefix of length g, found by binary search. When g > 0 the last of them is p (the nearest strictly taller person is never exceeded by anyone after it, since all of those are at most heights[j]), and the other g - 1 entries are exactly the indices i < p that remain visible. Hence left[j] = j when g = 0 and left[j] = (j - p) + (g - 1) otherwise.

Edge cases: a single person gets [0]; an adjacent pair is always counted because the j - p (or j) term includes i = j - 1; an all-equal line gives n - 1 for everyone; every count is at most n - 1 and every height fits in a signed 32-bit integer.

**Time:** O(n log n) · **Space:** O(n)
</details>
