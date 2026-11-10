"""Collect what locked pages still expose, as input for reconstructing their statements.

For each locked question: the JSON-LD overview and up to two community answers
(trimmed), alongside the title, metadata and classified pattern.

Usage: python3 build_locked_inputs.py raw_html/ questions.jsonl question_patterns.csv locked_inputs.jsonl
"""
import csv
import json
import sys
from pathlib import Path

import extract_questions as ex

ANSWER_CHARS = 1500
MAX_ANSWERS = 2


def page_context(path: Path) -> dict:
    payload_bytes = ex.flight_payload(path.read_text(encoding="utf-8"))
    blocks = ex.text_blocks(payload_bytes)
    payload = payload_bytes.decode("utf-8", "replace")

    ld = next((json.loads(b) for b in blocks.values() if b.startswith('{"@context"')), {})
    comments = (ex.find_object_with(payload, "comments") or {}).get("comments") or []
    answers = []
    for comment in sorted(comments, key=lambda c: -(c.get("likes_count") or 0))[:MAX_ANSWERS]:
        text = "\n".join(filter(None, [ex.resolve(comment.get("content"), blocks), ex.resolve(comment.get("code_content"), blocks)]))
        if text.strip():
            answers.append(text.strip()[:ANSWER_CHARS])
    return {"overview": ld.get("description", ""), "community_answers": answers}


def main() -> None:
    html_dir, questions_path, patterns_path, out_path = map(Path, sys.argv[1:5])
    patterns = {int(r["rank"]): r for r in csv.DictReader(patterns_path.open())}
    with out_path.open("w") as out:
        for record in map(json.loads, questions_path.open()):
            if not record["locked"]:
                continue
            path = next(html_dir.glob(f"{record['rank']:03d}-*.html"))
            pattern = patterns[record["rank"]]
            out.write(json.dumps({
                "rank": record["rank"],
                "slug": path.stem.split("-", 1)[1],
                "title": record["title"],
                "difficulty": record["difficulty"],
                "round": record["round"],
                "topics": record["topics"],
                "pattern": pattern["primary_pattern"],
                "secondary_patterns": pattern["secondary_patterns"],
                **page_context(path),
            }, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
