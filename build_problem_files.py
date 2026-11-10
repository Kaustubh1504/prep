"""Build one readable Markdown file per problem, plus compact cards for clustering.

Full questions are rendered from questions.jsonl; locked ones use the inferred
statement from inferred/. Cards hold just enough to group similar problems.

Usage: python3 build_problem_files.py
Writes problems/<rank>-<slug>.md and cards.jsonl.
"""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PROBLEMS_DIR = ROOT / "problems"
KEY_IDEA_CHARS = 300


def first_sentences(text: str, limit: int) -> str:
    text = re.sub(r"\s+", " ", re.sub(r"```.*?```", " ", text, flags=re.S)).strip()
    return text if len(text) <= limit else text[:limit].rsplit(" ", 1)[0] + "…"


def render_full(record: dict, pattern: dict) -> str:
    parts = [
        f"# {record['title']}",
        f"> Google · {record['round']} · {record['difficulty']} · Pattern: {pattern['primary_pattern']}"
        + (f", {pattern['secondary_patterns'].replace('; ', ', ')}" if pattern["secondary_patterns"] else ""),
        f"> Source: {record['url']}",
        "",
        record["statement"],
    ]
    if record["hints"]:
        hints = "\n".join(f"{i}. {h}" for i, h in enumerate(record["hints"], 1))
        parts += ["", "<details><summary>Hints (spoiler)</summary>", "", hints, "</details>"]
    if record["approach"]:
        complexity = f"\n\n**Time:** {record['time_complexity']} · **Space:** {record['space_complexity']}" if record["time_complexity"] else ""
        parts += ["", "<details><summary>Approach (spoiler)</summary>", "", record["approach"] + complexity, "</details>"]
    return "\n".join(parts) + "\n"


def inferred_key_idea(text: str) -> str:
    match = re.search(r"<summary>Approach \(spoiler\)</summary>(.*?)(?:\*\*Time|```)", text, re.S)
    return first_sentences(match.group(1), KEY_IDEA_CHARS) if match else ""


def main() -> None:
    patterns = {int(r["rank"]): r for r in csv.DictReader((ROOT / "question_patterns.csv").open())}
    PROBLEMS_DIR.mkdir(exist_ok=True)
    cards, missing = [], []

    for record in map(json.loads, (ROOT / "questions.jsonl").open()):
        rank, slug = record["rank"], record["url"].rsplit("/", 1)[1]
        name = f"{rank:03d}-{slug}.md"
        pattern = patterns[rank]
        if record["locked"]:
            inferred_path = ROOT / "inferred" / name
            if not inferred_path.exists():
                missing.append(rank)
                continue
            text = inferred_path.read_text()
            key_idea, source = inferred_key_idea(text), "inferred"
        else:
            text = render_full(record, pattern)
            key_idea = first_sentences(record["approach"] or " ".join(record["hints"][:2]), KEY_IDEA_CHARS)
            source = "full"
        (PROBLEMS_DIR / name).write_text(text)
        cards.append({
            "rank": rank,
            "file": f"problems/{name}",
            "title": record["title"],
            "difficulty": record["difficulty"],
            "pattern": pattern["primary_pattern"],
            "secondary": pattern["secondary_patterns"],
            "source": source,
            "summary": record["summary"],
            "key_idea": key_idea,
        })

    with (ROOT / "cards.jsonl").open("w") as out:
        for card in sorted(cards, key=lambda c: c["rank"]):
            out.write(json.dumps(card, ensure_ascii=False) + "\n")
    print(f"{len(cards)} problem files written; {sum(c['source'] == 'inferred' for c in cards)} inferred; "
          f"{sum(bool(c['key_idea']) for c in cards)} with a key idea; missing inferred: {missing}")


if __name__ == "__main__":
    main()
