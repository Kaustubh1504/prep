"""Classify extracted PracHub questions into algorithm patterns.

Scores each question against keyword rules per pattern, weighting the fields
that name techniques (hints, approach) above those that only describe the task.
Manual overrides take precedence for questions the rules get wrong.

Usage: python3 classify_patterns.py questions.jsonl
Writes question_patterns.csv and patterns.md next to this script.
"""
import csv
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# Ordered most specific first; the order breaks score ties.
PATTERNS = {
    "Union-Find": [r"union[- ]find", r"disjoint[- ]set", r"\bdsu\b", r"merg\w* (several |two )?(islands|components|groups)", r"accounts? merge"],
    "Topological Sort": [r"topolog", r"prerequisite", r"dependen", r"\bkahn", r"build order", r"in-?degree", r"child-before-parent"],
    "Shortest Path": [r"dijkstra", r"shortest (path|route|time|relationship)", r"minimum (cost|time|total) (path|route|to reach)", r"network delay", r"0-1 bfs", r"bellman", r"cheapest", r"minimax"],
    "Trie": [r"\btrie\b", r"prefix tree", r"autocomplet", r"prefix (lookup|search|match)"],
    "Segment Tree / Fenwick": [r"segment tree", r"fenwick", r"binary indexed", r"range (update|query|queries)"],
    "Monotonic Stack": [r"monoton", r"next (greater|larger|smaller|higher)", r"first (larger|greater|smaller)", r"previous (greater|smaller)", r"histogram", r"stock span"],
    "Sliding Window": [r"sliding window", r"\bwindow\b", r"(longest|shortest|minimum|maximum) (contiguous )?(substring|subarray|segment)", r"at most k distinct", r"distinct characters"],
    "Two Pointers": [r"two[- ]pointer", r"\bpointers\b", r"\bpair(s)? (that )?sum", r"\b3sum\b|\btwo sum\b", r"palindrom", r"in[- ]place"],
    "Prefix Sum": [r"prefix sums?", r"cumulative", r"range sums?", r"difference array", r"subarray sums?"],
    "Binary Search": [r"binary search", r"bisect", r"minimi[sz]e the maximum", r"maximi[sz]e the minimum", r"search (on|over) the answer", r"rotated sorted", r"o\(log"],
    "Heap / Top-K": [r"\bheap\b", r"priority queue", r"\btop[- ]?k\b", r"\bk (largest|smallest|most|closest)", r"\bmedian\b", r"k-?way merge", r"kth (largest|smallest)"],
    "Intervals / Sweep Line": [r"interval", r"overlap", r"sweep", r"meeting", r"schedul", r"booking", r"calendar", r"time ranges?"],
    "Stack / Parsing": [r"\bstack\b", r"parenthes", r"bracket", r"\bpars(e|ing|er)\b", r"expression", r"interpret", r"tokeni", r"\blisp\b", r"calculator", r"decode (the )?string"],
    "Dynamic Programming": [r"dynamic programming", r"\bdp\b", r"memoi", r"knapsack", r"subsequence", r"number of (distinct )?ways", r"count(ing)? (the )?ways", r"edit distance", r"recurrence"],
    "Backtracking": [r"backtrack", r"permutations?", r"\bcombinations\b", r"generate (all|every)", r"enumerat", r"queens", r"sudoku", r"all (possible|valid)"],
    "Graph BFS / DFS": [r"\bbfs\b", r"\bdfs\b", r"breadth[- ]first", r"depth[- ]first", r"connected", r"reachab", r"\bgraph\b", r"flood", r"islands?", r"neighbou?r"],
    "Tree Traversal / BST": [r"binary tree", r"\bbst\b", r"search tree", r"\btrees?\b", r"subtree", r"ancestor", r"inorder|preorder|postorder|level[- ]order"],
    "Linked List": [r"linked list", r"list nodes?"],
    "Design / Data Structure": [r"\bdesign\b", r"implement (a|an) \w+ (class|cache|iterator|structure|system)", r"\bclass\b", r"\biterator", r"\blru\b|\blfu\b|\bcache\b", r"snapshot", r"in (average )?constant time", r"o\(1\) (time|per)"],
    "Greedy": [r"greedy", r"greedily", r"exchange argument"],
    "Bit Manipulation": [r"\bbitwise\b", r"\bxor\b", r"bitmask", r"binary representation", r"\bbits\b"],
    "Randomized / Probability": [r"random", r"shuffle", r"reservoir", r"probabilit", r"sampl(e|ing) uniformly"],
    "Math / Number Theory": [r"\bgcd\b", r"\blcm\b", r"\bprimes?\b", r"modulo", r"divisib", r"\bdigits?\b", r"factorial", r"geometry", r"\bpower of\b", r"arithmetic", r"decimal"],
    "Hashing / Counting": [r"hash ?(map|set|table)", r"frequenc", r"anagram", r"duplicate", r"most frequent", r"\bcount (of )?(each|occurrences)"],
    "Sorting": [r"\bsort(ed|ing)?\b", r"comparator", r"lexicograph"],
    "Simulation": [r"simulat", r"state machine", r"robot", r"\bgame\b", r"\blogs?\b", r"\bstream(s|ing)?\b", r"process (each|the) (event|command|operation)s?"],
    "String Processing": [r"\bstrings?\b", r"substring", r"characters?", r"\bwords?\b"],
}
# Broad patterns match almost everything, so their keywords count for less.
BROAD = {"Hashing / Counting": 0.5, "Sorting": 0.4, "Simulation": 0.5, "String Processing": 0.3, "Math / Number Theory": 0.7,
         "Graph BFS / DFS": 0.8, "Tree Traversal / BST": 0.8, "Design / Data Structure": 0.8}

TOPIC_TO_PATTERN = {
    "Graphs": ["Graph BFS / DFS"], "Trees": ["Tree Traversal / BST"], "Dynamic Programming": ["Dynamic Programming"],
    "Heaps & Priority Queues": ["Heap / Top-K"], "Two Pointers & Sliding Window": ["Sliding Window", "Two Pointers"],
    "Data Structure Design": ["Design / Data Structure"], "Intervals & Scheduling": ["Intervals / Sweep Line"],
    "Backtracking & Recursion": ["Backtracking"], "Sorting": ["Sorting"], "Binary Search": ["Binary Search"],
    "Stacks & Queues": ["Stack / Parsing"], "Greedy": ["Greedy"], "Linked Lists": ["Linked List"],
    "String Algorithms": ["String Processing"], "Parsing & Interpreters": ["Stack / Parsing"],
    "Simulation & State Machines": ["Simulation"], "Bit Manipulation": ["Bit Manipulation"],
    "Math & Number Theory": ["Math / Number Theory"], "Probability": ["Randomized / Probability"],
    "Batch & Stream Processing": ["Simulation"],
}

# Hints and the approach name techniques; the title and summary describe the task; statements are long and noisy.
FIELD_WEIGHTS = {"approach": 3.0, "hints": 3.0, "title": 2.0, "summary": 2.0, "statement": 0.5}
TOPIC_WEIGHT = 2.0
STATEMENT_CHARS = 2000
LOW_CONFIDENCE = 3.0

COMPILED = {name: [re.compile(p, re.I) for p in pats] for name, pats in PATTERNS.items()}

sys.path.insert(0, str(ROOT))
from pattern_overrides import OTHER, OVERRIDES  # noqa: E402

_known = set(PATTERNS) | {OTHER}
_unknown = {p for primary, secondary in OVERRIDES.values() for p in [primary, *secondary]} - _known
assert not _unknown, f"pattern_overrides.py uses unknown pattern names: {_unknown}"


def score(record: dict) -> dict:
    fields = {
        "approach": record["approach"],
        "hints": " ".join(record["hints"]),
        "title": record["title"],
        "summary": record["summary"],
        "statement": record["statement"][:STATEMENT_CHARS],
    }
    scores = defaultdict(float)
    for name, regexes in COMPILED.items():
        hits = sum(FIELD_WEIGHTS[field] for field, text in fields.items() for rx in regexes if rx.search(text))
        if hits:
            scores[name] = hits * BROAD.get(name, 1.0)
    for topic in (t.strip() for t in record["topics"].split(",")):
        for name in TOPIC_TO_PATTERN.get(topic, []):
            scores[name] += TOPIC_WEIGHT
    return scores


def classify(record: dict) -> dict:
    if record["rank"] in OVERRIDES:
        primary, secondary = OVERRIDES[record["rank"]]
        return {"primary": primary, "secondary": secondary, "confidence": "manual"}
    scores = score(record)
    order = list(PATTERNS)
    ranked = sorted(scores, key=lambda n: (-scores[n], order.index(n)))
    if not ranked:
        return {"primary": "Unclassified", "secondary": [], "confidence": "low"}
    top = scores[ranked[0]]
    secondary = [n for n in ranked[1:3] if scores[n] >= 0.6 * top]
    runner_up = scores[ranked[1]] if len(ranked) > 1 else 0
    low = top < LOW_CONFIDENCE or runner_up >= 0.9 * top
    return {"primary": ranked[0], "secondary": secondary, "confidence": "low" if low else "high"}


def main() -> None:
    records = [json.loads(line) for line in open(sys.argv[1])]
    results = [{**r, **classify(r)} for r in records]

    with (ROOT / "question_patterns.csv").open("w", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(["rank", "title", "primary_pattern", "secondary_patterns", "confidence", "difficulty", "round", "locked", "url"])
        for r in results:
            writer.writerow([r["rank"], r["title"], r["primary"], "; ".join(r["secondary"]), r["confidence"],
                             r["difficulty"], r["round"], r["locked"], r["url"]])

    by_pattern = defaultdict(list)
    for r in results:
        by_pattern[r["primary"]].append(r)
    with (ROOT / "patterns.md").open("w") as fh:
        fh.write(f"# Google SWE coding questions by pattern ({len(results)} questions)\n\n")
        fh.write("Ordered by how often each pattern appears. Within a pattern, questions are in PracHub popularity order.\n")
        fh.write("🔒 = locked on the website (only the overview was saved).\n\n| Pattern | Questions |\n|---|---|\n")
        for name, items in sorted(by_pattern.items(), key=lambda kv: -len(kv[1])):
            fh.write(f"| {name} | {len(items)} |\n")
        for name, items in sorted(by_pattern.items(), key=lambda kv: -len(kv[1])):
            fh.write(f"\n## {name} ({len(items)})\n\n| # | Question | Diff | Also uses |\n|---|---|---|---|\n")
            for r in sorted(items, key=lambda r: r["rank"]):
                lock = " 🔒" if r["locked"] else ""
                fh.write(f"| {r['rank']} | [{r['title']}]({r['url']}){lock} | {r['difficulty']} | {', '.join(r['secondary'])} |\n")

    print(f"{len(results)} classified")
    for name, items in sorted(by_pattern.items(), key=lambda kv: -len(kv[1])):
        print(f"  {name:26} {len(items)}")
    low = [r for r in results if r["confidence"] == "low"]
    print(f"\n{len(low)} low-confidence:")
    for r in low:
        print(f"  {r['rank']}|{r['title']}|{r['primary']}|{','.join(r['secondary'])}|{r['summary'][:110]}")


if __name__ == "__main__":
    main()
