# Match people to questions using tags and priorities
> **Inferred statement** — reconstructed from PracHub's overview and community answers; details may differ from the original.
> Google · Technical Screen · Medium · Pattern: Graph BFS / DFS, Design / Data Structure

## Problem
A Q&A platform wants to route open questions to experts.

- `people` maps each person's id to the list of tags they are an expert in.
- `questions` is a list of `(question_id, priority, tags)`.

A person is **eligible** for a question if they share at least one tag with it. Each person can be assigned at most one question and each question at most one person.

Find an assignment that:
1. answers the **maximum possible number** of questions, and
2. among all maximum assignments, prefers higher-priority questions: compare the sets of answered questions by walking questions in order of priority descending (ties by `question_id` ascending) and prefer the set that includes the earlier question at the first point they differ.

The set of answered questions defined this way is unique. Return a dict `question_id -> person_id` for the answered questions; if several people could fill the same answered set, any valid choice is accepted (the reference below is deterministic). Unanswerable questions are simply left out.

Design note: build a `tag -> people` index so finding the candidates for a question costs time proportional to its tags, not to the number of people.

## Function signature
```python
from typing import Dict, List, Tuple

def match_people_to_questions(people: Dict[str, List[str]],
                              questions: List[Tuple[str, int, List[str]]]) -> Dict[str, str]:
    ...
```

## Constraints
- `0 <= len(people), len(questions) <= 500`
- Each person / question has `<= 10` tags; ids and tags are non-empty strings
- `0 <= priority <= 10^9`

## Examples
**Example 1**
Input:
```
people = {"alice": ["python","ml"], "bob": ["python"], "carol": ["sql"]}
questions = [("q1",5,["python"]), ("q2",3,["ml"]), ("q3",4,["python"]), ("q4",1,["sql","ml"])]
```
Output: `{"q1": "bob", "q3": "alice", "q4": "carol"}`
Explanation: `q1`, `q2` and `q3` can only be answered by alice or bob, so at most two of them get answered; adding `q4` (carol) gives a maximum of three. Priority order is `q1, q3, q2, q4`; `{q1, q3, q4}` wins over e.g. `{q1, q2, q4}` because it includes `q3`.

**Example 2** (more questions than people; unmatched tag)
Input:
```
people = {"dan": ["go"], "eve": ["go"]}
questions = [("a",1,["go"]), ("b",9,["go"]), ("c",5,["go"]), ("d",7,["rust"])]
```
Output: `{"b": "eve", "c": "dan"}`
Explanation: Only two go experts exist, so the two highest-priority go questions `b` and `c` are answered; `d` has no eligible expert.

**Example 3** (no people)
Input: `people = {}`, same `questions` → Output: `{}`

<details><summary>Approach (spoiler)</summary>

This is bipartite matching (questions vs. people). Process questions in priority order and, for each, run one augmenting-path search (Kuhn's algorithm) through the current matching. A question that becomes matched stays matched in every later augmentation, so the result is a maximum matching; because matchable question sets form a transversal matroid, this greedy-by-priority with augmentation also yields the priority-preferred maximum set. The tag index makes building candidate lists cheap.
**Time:** O(Q · E) where E = number of eligible (question, person) pairs · **Space:** O(E)

```python
from typing import Dict, List, Tuple

def match_people_to_questions(people: Dict[str, List[str]],
                              questions: List[Tuple[str, int, List[str]]]) -> Dict[str, str]:
    tag_to_people: Dict[str, List[str]] = {}
    for p in sorted(people):
        for t in people[p]:
            tag_to_people.setdefault(t, []).append(p)
    cand = {}
    for qid, _, tags in questions:
        seen, lst = set(), []
        for t in tags:
            for p in tag_to_people.get(t, []):
                if p not in seen:
                    seen.add(p); lst.append(p)
        cand[qid] = sorted(lst)
    owner: Dict[str, str] = {}      # person -> question

    def augment(q, visited):
        for p in cand[q]:
            if p in visited: continue
            visited.add(p)
            if p not in owner or augment(owner[p], visited):
                owner[p] = q
                return True
        return False

    for qid, _, _ in sorted(questions, key=lambda x: (-x[1], x[0])):
        augment(qid, set())
    return {q: p for p, q in sorted(owner.items(), key=lambda kv: kv[1])}
```
</details>
