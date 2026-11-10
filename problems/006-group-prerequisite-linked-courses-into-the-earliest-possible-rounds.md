# Group prerequisite-linked courses into the earliest possible rounds
> Google · Onsite · hard · Pattern: Topological Sort
> Source: https://prachub.com/interview-questions/group-prerequisite-linked-courses-into-the-earliest-possible-rounds

There are `n` courses numbered `0` to `n - 1`. Each pair `[a, b]` in `prerequisites` means course `b` must be completed before course `a` can be taken. Courses are taken in rounds: in one round you may take any number of courses, provided every prerequisite of each of them was completed in an earlier round.

Place every course in the earliest round in which it can be taken, and return the rounds as a nested list: the first inner list holds the round-1 courses, the second inner list the round-2 courses, and so on. If the prerequisites make it impossible to complete every course, the input is invalid and you return an empty list.

In the interview this began as returning one valid order in which all the courses can be completed. The follow-ups added a validity check, a complexity analysis and test cases, and finally changed the output to a nested list. This problem asks for that final version.

### Function Signature

```python
def course_rounds(n: int, prerequisites: list[list[int]]) -> list[list[int]]:
```

### Rules

- A course with no prerequisites is in round 1. Any other course is in round `r + 1`, where `r` is the largest round among its prerequisites.
- Within each inner list, course numbers are in increasing order. Inner lists appear in round order, and none of them is empty.
- The schedule is impossible exactly when some course depends on itself, directly (a pair `[a, a]`) or through a chain of prerequisites. In that case return `[]`, even if some other courses could still be scheduled.
- Duplicate pairs are allowed and have the same effect as a single copy.
- Because `n >= 1`, a valid schedule always has at least one round, so `[]` always means the input is invalid.

### Constraints

- `1 <= n <= 10^5`
- `0 <= len(prerequisites) <= 2 * 10^5`
- `0 <= a < n` and `0 <= b < n` for every pair `[a, b]`

### Examples

**Example 1**

```text
Input:  n = 4, prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]]
Output: [[0], [1, 2], [3]]
```

Course `0` has no prerequisites. Courses `1` and `2` need only course `0`, and course `3` needs both `1` and `2`.

**Example 2**

```text
Input:  n = 6, prerequisites = [[1, 0], [2, 1], [3, 0], [3, 2], [5, 4]]
Output: [[0, 4], [1, 5], [2], [3]]
```

Courses `0` and `4` have no prerequisites. Course `3` needs course `0` (round 1) and course `2` (round 3), so its earliest round is 4.

**Example 3**

```text
Input:  n = 3, prerequisites = [[0, 1], [1, 2], [2, 1]]
Output: []
```

Courses `1` and `2` each require the other, so no schedule completes every course.

<details><summary>Hints (spoiler)</summary>

1. Restate the rule as a recurrence: a course's round is 1 if it has no prerequisites, and otherwise one more than the largest round among its prerequisites.
2. If some courses can never be placed because of a dependency loop, the whole answer is [], so make sure your approach can tell when not every course was placed.
3. Duplicate pairs must not change the answer; check that your bookkeeping treats every copy of a repeated pair consistently.
</details>

<details><summary>Approach (spoiler)</summary>

Process the courses one round at a time (a level-by-level topological sort). For every course keep a count of the prerequisite pairs whose prerequisite has not been placed yet. Each pair, including each duplicate copy, adds one to the dependent course's count and one entry to the prerequisite's list of dependents. Round 1 is every course whose count is zero. Once a round is fixed, decrement the count of every dependent of every course in it. The courses whose count drops to zero form the next round. Sort each round before appending it, so each inner list is in increasing order.

Invariant: a course's count reaches zero exactly when the last of its prerequisites has been placed. Rounds are placed in increasing order, so that last prerequisite is the one in the largest round r, and the course lands in round r + 1. That is exactly the earliest round the rules allow. A duplicate copy adds to the count and removes from it the same number of times, so it acts like a single copy.

A course on a dependency cycle, including a self-pair [a, a], never reaches zero, and neither does any course that depends on it. Fewer than n courses then get placed, and the function returns []. Otherwise every course is placed exactly once, no round is empty, and the nested list is returned. With no pairs, all n courses form a single round, and n = 1 with no pairs gives [[0]].

**Time:** O(n log n + m), where m = len(prerequisites) · **Space:** O(n + m)
</details>
