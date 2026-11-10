"""Assemble STUDY_GUIDE.md from guide_sections/ and verify its links.

Usage: python3 build_guide.py
"""
import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SECTIONS = ROOT / "guide_sections"
FAMILIES = ["graphs_trees", "intervals_design", "arrays_strings", "dp_search_math"]
NON_PATTERN_HEADINGS = ("Cross-pattern links", "Must-do anchors")


def slug(heading: str) -> str:
    """GitHub-style heading anchor."""
    return re.sub(r"[^\w\- ]", "", heading.lower()).replace(" ", "-")


def table_of_contents() -> str:
    toc = ["## Contents", "",
           "- [1–7. Recognition, constraints, getting unstuck, interview framework](#1-from-problem-statement-to-pattern)",
           "- [8. Four-day plan](#8-four-day-plan)",
           "- [NeetCode 150: hard problems](#neetcode-150-hard-problems)"]
    for family in FAMILIES:
        lines = (SECTIONS / f"{family}.md").read_text().splitlines()
        name = lines[0][2:].strip()
        toc.append(f"- [{name}](#{slug(name)})")
        for line in lines:
            heading = line[3:].strip()
            if line.startswith("## ") and not heading.startswith(NON_PATTERN_HEADINGS):
                toc.append(f"  - [{heading}](#{slug(heading)})")
    return "\n".join(toc)


def neetcode_section() -> str:
    """NeetCode 150 hard problems, mapped onto this guide's patterns (PracHub refs as plain text, not links)."""
    items = json.loads((ROOT / "neetcode_hard.json").read_text())
    rows = [
        f"| [{item['title']}](https://leetcode.com/problems/{item['slug']}/) | {item['pattern']} | "
        f"{', '.join(f'#{r}' for r in item['related'])} | {item['note'].replace('|', '/')} |"
        for item in items
    ]
    return "\n".join([
        "# NeetCode 150: hard problems", "",
        f"All {len(items)} hard problems from NeetCode 150, mapped onto the patterns above. Solve them on LeetCode, which runs your code. "
        "**Near-duplicate** rows are practice for a PracHub problem you've already met. The rest add something "
        "the PracHub set covers thinly, and Reconstruct Itinerary (Eulerian path) is entirely new.", "",
        "| Problem | Pattern | Closest PracHub | How it relates |", "|---|---|---|---|", *rows, "",
    ])


def verify(guide: str) -> list:
    problems = []
    links = Counter(re.findall(r"\]\((problems/[^)]+\.md)\)", guide))
    expected = {json.loads(line)["file"] for line in (ROOT / "cards.jsonl").open()}
    if set(links) != expected:
        problems.append(f"missing {sorted(expected - set(links))[:5]}, unexpected {sorted(set(links) - expected)[:5]}")
    duplicated = [link for link, count in links.items() if count > 1]
    if duplicated:
        problems.append(f"linked more than once: {duplicated[:5]}")
    broken = [link for link in links if not (ROOT / link).exists()]
    if broken:
        problems.append(f"broken file links: {broken[:5]}")
    headings = {slug(h) for h in re.findall(r"^#{1,6} (.+)$", guide, flags=re.M)}
    bad_anchors = sorted(set(re.findall(r"\]\(#([^)]+)\)", guide)) - headings)
    if bad_anchors:
        problems.append(f"broken in-page anchors: {bad_anchors}")
    return problems


def main() -> None:
    title, rest = (SECTIONS / "00_intro.md").read_text().split("\n", 1)
    preamble, body = rest.split("## 1.", 1)
    parts = [title, preamble.rstrip(), table_of_contents(), "", "---", "", "## 1." + body, (SECTIONS / "01_plan.md").read_text()]
    parts += [(SECTIONS / f"{family}.md").read_text().rstrip() + "\n\n---\n" for family in FAMILIES]
    parts.append(neetcode_section())
    guide = "\n".join(parts)
    (ROOT / "STUDY_GUIDE.md").write_text(guide)

    problems = verify(guide)
    print(f"STUDY_GUIDE.md: {guide.count(chr(10))} lines; " + ("all checks passed" if not problems else "; ".join(problems)))
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
