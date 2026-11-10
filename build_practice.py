"""Bundle problems, clusters and the study plan into practice/data.js for the practice app.

The data is emitted as a JS assignment (not JSON fetched at runtime) so the app
works when index.html is opened straight from disk.

Usage: python3 build_practice.py
"""
import json
import sys
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SECTIONS = ROOT / "guide_sections"
FAMILIES = [
    ("graphs_trees", "Graphs & Trees"),
    ("intervals_design", "Intervals, Heaps & Design"),
    ("arrays_strings", "Arrays & Strings"),
    ("dp_search_math", "DP, Search & Math"),
]
# NeetCode problems get ranks above every PracHub rank so the app can key everything by number.
NEETCODE_RANK_OFFSET = 1000
# Hard problems that cover the most ground: do these first on the Hard tab.
HARD_PRIORITY = [200, 6, 202, 430, 60, 508, 388, 378, 42, 339, 296, 251]
LINK_RE = re.compile(r"\[#(\d+) [^\]]*\]\(problems/[^)]+\.md\)")
NON_PATTERN_HEADINGS = ("Cross-pattern links", "Must-do anchors")


def clean_note(text: str) -> str:
    """Strip the link's trailing markers and the separator agents used (' — ', '. ', ': ')."""
    text = text.replace("*(inferred)*", "").strip()
    return re.sub(r"^(—|-|:|\.)\s*", "", text).strip()


def strip_header(markdown: str) -> str:
    """Drop the leading '# title' and '> meta' lines; the app renders its own header (and may hide the pattern)."""
    lines = markdown.splitlines()
    i = 0
    while i < len(lines) and (lines[i].startswith("# ") or lines[i].startswith(">") or not lines[i].strip()):
        i += 1
    return "\n".join(lines[i:]).strip()


def parse_family(key: str, name: str, problems: dict, patterns: dict, clusters: list) -> None:
    lines = (SECTIONS / f"{key}.md").read_text().splitlines()
    pattern = cluster = None
    in_other = in_intro = False
    intro: list = []

    def flush_intro():
        if pattern in patterns and intro:
            patterns[pattern]["intro"] = "\n".join(intro).strip()

    for line in lines:
        if line.startswith("## "):
            flush_intro()
            heading = line[3:].strip()
            if heading.startswith(NON_PATTERN_HEADINGS):
                if heading.startswith("Must-do anchors"):
                    pattern, in_intro = "__mustdo__", False
                else:
                    pattern, in_intro = None, False
                continue
            pattern, cluster, in_other, in_intro, intro = heading, None, False, True, []
            patterns[pattern] = {"family": name, "intro": ""}
            continue
        if pattern == "__mustdo__":
            # Only the bold lead of each numbered item names must-dos; later "#N" are "unlocks" mentions.
            lead = re.match(r"\d+\.\s+\*\*([^*]+)\*\*", line)
            for rank in re.findall(r"#(\d+)", lead.group(1) if lead else ""):
                if int(rank) in problems:
                    problems[int(rank)]["mustdo"] = True
            continue
        if pattern is None:
            continue
        if line.startswith("### "):
            flush_intro()
            in_intro = False
            in_other = line.startswith("### Other")
            cluster = None
            continue
        if in_intro:
            intro.append(line)
            continue
        if line.startswith("#### "):
            title = line[5:].strip()
            parts = re.split(r" — |: ", title, maxsplit=1)
            cluster = {"id": len(clusters), "pattern": pattern, "name": parts[0].strip(),
                       "desc": parts[1].strip() if len(parts) > 1 else "", "anchor": None, "members": []}
            clusters.append(cluster)
            continue

        match = LINK_RE.search(line)
        if not match:
            continue
        rank = int(match.group(1))
        problem = problems[rank]
        problem["pattern"] = pattern
        problem["note"] = clean_note(line[match.end():])
        if in_other or cluster is None:
            problem["role"] = "other"
        else:
            problem["cluster"] = cluster["id"]
            cluster["members"].append(rank)
            if "**Anchor:**" in line:
                problem["role"] = "anchor"
                cluster["anchor"] = rank
            else:
                problem["role"] = "variant"
    flush_intro()


def parse_plan(problems: dict) -> list:
    plan = []
    for line in (SECTIONS / "01_plan.md").read_text().splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) != 4 or not cells[0] or cells[0] in ("Day", "---"):
            continue
        core = [int(r) for r in re.findall(r"#(\d+)", cells[2]) if int(r) in problems]
        extra = [int(r) for r in re.findall(r"#(\d+)", cells[3]) if int(r) in problems]
        if core or extra:
            focus = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", cells[1])
            plan.append({"day": cells[0], "focus": focus, "core": core, "extra": extra})
    return plan


def neetcode_body(item: dict, problems: dict) -> str:
    """Link out to LeetCode for the statement; relations and the video stay behind spoilers (they reveal the pattern)."""
    related = "\n".join(
        f"- [#{rank} {problems[rank]['title']}](#/p/{rank})" for rank in item["related"] if rank in problems
    )
    return "\n\n".join([
        f"**Solve it on LeetCode:** [{item['title']}](https://leetcode.com/problems/{item['slug']}/). "
        "The statement and the test runner are there; the statement isn't copied here.",
        f"**In one line:** {item['cue']}",
        f"<details><summary>Closest PracHub problems (reveals the pattern)</summary>\n\n{related}\n</details>",
        f"<details><summary>NeetCode video walkthrough (spoiler)</summary>\n\n"
        f"[Watch on YouTube](https://www.youtube.com/watch?v={item['video']})\n</details>",
    ])


def add_neetcode_items(problems: dict, patterns: dict, clusters: list, items: list, difficulty: str) -> list:
    """Add NeetCode problems after every existing NeetCode rank, joined to the matching PracHub cluster; return their ranks."""
    anchor_to_cluster = {c["anchor"]: c for c in clusters}
    first = max([r for r in problems if r > NEETCODE_RANK_OFFSET], default=NEETCODE_RANK_OFFSET) + 1
    ranks = []
    for rank, item in enumerate(items, start=first):
        assert item["pattern"] in patterns, f"{item['slug']}: unknown pattern {item['pattern']}"
        cluster = anchor_to_cluster.get(item["cluster_anchor"]) if item["cluster_anchor"] else None
        assert item["cluster_anchor"] is None or cluster, f"{item['slug']}: no cluster anchored at #{item['cluster_anchor']}"
        if cluster:
            cluster["members"].append(rank)
        problems[rank] = {
            "rank": rank,
            "title": item["title"],
            "difficulty": difficulty,
            "round": "NeetCode 150",
            "secondary": item["secondary"],
            "source": "neetcode",
            "summary": item["cue"],
            "body": neetcode_body(item, problems),
            "pattern": item["pattern"],
            "cluster": cluster["id"] if cluster else None,
            "role": "variant" if cluster else "other",
            "note": item["note"],
            "mustdo": False,
            "url": f"https://leetcode.com/problems/{item['slug']}/",
        }
        ranks.append(rank)
    return ranks


def add_neetcode(problems: dict, patterns: dict, clusters: list) -> dict:
    """Add the NeetCode 150 hard problems (NC1 onwards) and return their plan entry."""
    ranks = add_neetcode_items(problems, patterns, clusters, json.loads((ROOT / "neetcode_hard.json").read_text()), "hard")
    # Near-duplicates of PracHub problems are drills; the rest add something the PracHub set lacks.
    near_duplicate = {r for r in ranks if problems[r]["note"].startswith(("**Near-duplicate", "**Same"))}
    return {
        "day": "NeetCode 150 hard",
        "focus": "solve on LeetCode",
        "core": [r for r in ranks if r not in near_duplicate],
        "extra": [r for r in ranks if r in near_duplicate],
        "hint": "These open on LeetCode, which runs your code. The first list adds concepts the PracHub set lacks or covers thinly. "
                "The second list is near-duplicates of PracHub problems, so drill them: say what's the same, then solve on LeetCode.",
        "core_label": "Adds something new",
        "extra_label": "Near-duplicates of PracHub problems",
    }


def add_stretch_mediums(problems: dict, patterns: dict, clusters: list) -> list:
    """Mediums that aren't straightforward, for the Hard track: PracHub picks first, then NeetCode picks (NC22 onwards)."""
    order = []
    prachub_path, neetcode_path = ROOT / "stretch_prachub.json", ROOT / "neetcode_stretch.json"
    if prachub_path.exists():
        for pick in json.loads(prachub_path.read_text()):
            problem = problems[pick["rank"]]
            assert problem["difficulty"] == "medium", f"#{pick['rank']} is not medium"
            problem["stretch"] = pick["reason"]
            order.append(pick["rank"])
    if neetcode_path.exists():
        ranks = add_neetcode_items(problems, patterns, clusters, json.loads(neetcode_path.read_text()), "medium")
        for rank in ranks:
            # The note's first sentence says what makes it tricky; drop a leading near-duplicate marker.
            note = re.sub(r"^\*\*[^*]+\*\*\s*", "", problems[rank]["note"])
            problems[rank]["stretch"] = re.split(r"(?<=[.!?])\s", note, maxsplit=1)[0]
        order += ranks
    return order


def promote_hard_coding_versions(problems: dict) -> list:
    """Mark problems hard when PracHub's attached coding exercise is rated Hard, even if the listing says medium/easy."""
    import extract_questions as ex  # local import: only this step needs the HTML parser

    promoted = []
    for rank, problem in problems.items():
        if problem["difficulty"] == "hard":
            continue
        pages = list((ROOT / "raw_html").glob(f"{rank:03d}-*.html"))
        if not pages:
            continue
        payload = ex.flight_payload(pages[0].read_text(encoding="utf-8")).decode("utf-8", "replace")
        coding = (ex.find_object_with(payload, "content_enhanced") or {}).get("coding_problem")
        if isinstance(coding, dict) and str(coding.get("difficulty", "")).lower() == "hard":
            problem["difficulty_note"] = f"Listed as {problem['difficulty']}; PracHub rates its coding version Hard"
            problem["difficulty"] = "hard"
            promoted.append(rank)
    return promoted


APPLE_RANK_BASE = {"A": 2000, "B": 2100, "C": 2200, "D": 2300, "E": 2400, "F": 2500, "G": 2600, "H": 2700}


CONCEPT_AREAS = [
    "Python language", "Practical scripting", "Testing", "Git and Gerrit", "Jenkins and CI/CD",
    "Linux and OS basics", "AI/ML for automation", "Web development", "Firmware and wireless", "Behavioral and resume",
]


def load_concepts() -> dict:
    """Interview flashcards from practice/concepts/*.json, in the checklist's area order."""
    cards = []
    for path in sorted((ROOT / "practice" / "concepts").glob("*.json")):
        cards += json.loads(path.read_text())
    ids = [c["id"] for c in cards]
    assert len(ids) == len(set(ids)), "duplicate concept card ids"
    unknown = {c["area"] for c in cards} - set(CONCEPT_AREAS)
    assert not unknown, f"unknown concept areas: {unknown}"
    cards.sort(key=lambda c: (CONCEPT_AREAS.index(c["area"]), c["id"]))
    return {"areas": [a for a in CONCEPT_AREAS if any(c["area"] == a for c in cards)], "cards": cards}


def apple_rank(problem_id: str) -> int:
    """A1 -> 2001, B6 -> 2106, C3 -> 2203."""
    return APPLE_RANK_BASE[problem_id[0]] + int(problem_id[1:])


def apple_body(item: dict) -> str:
    parts = ["> Apple-reported question. Most were reported as titles only, so this statement is the most likely "
             "reading: state your assumptions out loud.",
             f"**Statement.** {item['statement']}"]
    if item.get("example"):
        parts.append(f"**Example.** {item['example']}")
    if item.get("clarify"):
        parts.append("**Clarify before coding:**\n" + "\n".join(f"- {q}" for q in item["clarify"]))
    parts.append(f"<details><summary>Approach (spoiler)</summary>\n\n{item['approach']}\n</details>")
    return "\n\n".join(parts)


def add_apple(problems: dict, patterns: dict) -> dict:
    """Add the Apple practice set (apple_problems.json) as ranks 2001+, and return its track metadata."""
    source = json.loads((ROOT / "apple_problems.json").read_text())
    for item in source["problems"]:
        assert item["pattern"] in patterns, f"{item['id']}: unknown pattern {item['pattern']}"
        rank = apple_rank(item["id"])
        problems[rank] = {
            "rank": rank,
            "code": item["id"],
            "part": item["id"][0],
            "title": item["title"],
            "difficulty": item["difficulty"],
            "round": "Apple",
            "secondary": item.get("secondary", []),
            "source": "apple",
            "summary": item["statement"],
            "body": apple_body(item),
            "pattern": item["pattern"],
            "cluster": None,
            "role": "other",
            "note": item["approach"],
            "mustdo": False,
        }
    return {
        "intro": source["intro"],
        "parts": source["parts"],
        "order": [apple_rank(i) for i in source["order"]],
        "concepts": source["concepts"],
        "skipped": source["skipped"],
        "team_prep": source.get("team_prep", ""),
        "parsing_track": [apple_rank(i) for i in source.get("parsing_track", [])],
        "ai_track": [apple_rank(i) for i in source.get("ai_track", [])],
        "classes_track": [apple_rank(i) for i in source.get("classes_track", [])],
        "production_checklist": source.get("production_checklist", ""),
    }


def hard_order(problems: dict, neetcode_plan: dict) -> list:
    """Suggested order for the Hard tab: highest-value PracHub hards, NeetCode problems that add
    something new, the remaining PracHub hards by popularity, then NeetCode near-duplicates."""
    assert all(problems[r]["difficulty"] == "hard" for r in HARD_PRIORITY), "HARD_PRIORITY lists a non-hard problem"
    rest = sorted(r for r, p in problems.items()
                  if p["difficulty"] == "hard" and p["source"] != "neetcode" and r not in HARD_PRIORITY)
    order = HARD_PRIORITY + neetcode_plan["core"] + rest + neetcode_plan["extra"]
    assert len(order) == len(set(order)) == sum(p["difficulty"] == "hard" for p in problems.values())
    return order


def java_support_unsupported(rank: int) -> bool:
    import java_support  # noqa: E402

    spec = json.loads((ROOT / "practice" / "tests" / f"{rank:03d}.json").read_text())
    return bool(java_support.java_info(spec).get("unsupported"))


def bundle_tests() -> tuple:
    sys.path.insert(0, str(ROOT / "practice"))
    import java_support  # noqa: E402  (lives next to the app; only the bundling step needs it)

    """Bundle practice/tests/*.json and the harness into practice/tests.js (file:// pages can't fetch local files)."""
    tests_dir = ROOT / "practice" / "tests"
    specs = {}
    for path in sorted(tests_dir.glob("*.json")) if tests_dir.exists() else []:
        spec = json.loads(path.read_text())
        assert {"rank", "kind", "entry", "starter", "tests"} <= spec.keys(), f"{path.name}: incomplete spec"
        info = java_support.java_info(spec)
        spec["java"] = {"starter": info.get("starter"), "notes": info.get("notes"), "unsupported": info.get("unsupported")}
        specs[spec["rank"]] = spec
    skipped = sorted(int(p.name.split(".")[0]) for p in tests_dir.glob("*.skip.txt")) if tests_dir.exists() else []
    harness = (ROOT / "practice" / "harness.py").read_text()
    (ROOT / "practice" / "tests.js").write_text(
        "window.PRACTICE_TESTS = " + json.dumps(specs, ensure_ascii=False) + ";\n"
        + "window.PRACTICE_HARNESS = " + json.dumps(harness) + ";\n"
    )
    return sorted(specs), skipped


def main() -> None:
    rounds = {q["rank"]: q["round"] for q in map(json.loads, (ROOT / "questions.jsonl").open())}
    problems = {}
    for card in map(json.loads, (ROOT / "cards.jsonl").open()):
        problems[card["rank"]] = {
            "rank": card["rank"],
            "title": card["title"],
            "difficulty": card["difficulty"].lower(),
            "round": rounds.get(card["rank"], ""),
            "secondary": [s for s in card["secondary"].split("; ") if s],
            "source": card["source"],
            "summary": card["summary"],
            "body": strip_header((ROOT / card["file"]).read_text()),
            "pattern": card["pattern"],
            "cluster": None,
            "role": "other",
            "note": "",
            "mustdo": False,
        }

    promoted = promote_hard_coding_versions(problems)

    patterns, clusters, families = {}, [], []
    for key, name in FAMILIES:
        before = set(patterns)
        parse_family(key, name, problems, patterns, clusters)
        families.append({"name": name, "patterns": [p for p in patterns if p not in before]})

    plan = parse_plan(problems)
    for entry in plan:
        if not entry["day"].isdigit():
            entry["hint"] = "Spread these across Days 1–3 (2–3 a day), and finish the rest on the morning of Day 4."
            entry["core_label"] = "Quick anchors (15–20 min each)"
    neetcode_plan = add_neetcode(problems, patterns, clusters)
    stretch_order = add_stretch_mediums(problems, patterns, clusters)
    plan.append(neetcode_plan)

    hard = hard_order(problems, neetcode_plan)  # before the Apple set, which has its own track
    apple = add_apple(problems, patterns)

    data = {"families": families, "patterns": patterns, "clusters": clusters,
            "problems": list(problems.values()), "plan": plan,
            "hard_order": hard, "hard_priority": HARD_PRIORITY,
            "stretch_order": stretch_order, "apple": apple, "concepts": load_concepts()}
    out = ROOT / "practice" / "data.js"
    out.parent.mkdir(exist_ok=True)
    out.write_text("window.PRACTICE_DATA = " + json.dumps(data, ensure_ascii=False) + ";\n")

    roles = {r: sum(p["role"] == r for p in problems.values()) for r in ("anchor", "variant", "other")}
    print(f"{len(problems)} problems, {len(patterns)} patterns, {len(clusters)} clusters, roles {roles}, "
          f"must-do {sum(p['mustdo'] for p in problems.values())}, plan days {len(data['plan'])}, "
          f"patterns without intro {[p for p, v in patterns.items() if not v['intro']]}, "
          f"clusters without anchor {[c['name'] for c in clusters if c['anchor'] is None]}, "
          f"{out.stat().st_size // 1024} KB; promoted to hard (coding version rated Hard): {promoted}")
    tested, skipped = bundle_tests()
    print(f"tests.js: {len(tested)} runnable problems; skipped (not auto-testable): {skipped}")
    java_missing = [r for r in tested if java_support_unsupported(r)]
    print(f"Java: {len(tested) - len(java_missing)} runnable; not yet in Java: {java_missing}")


if __name__ == "__main__":
    main()
