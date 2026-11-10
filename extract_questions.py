"""Extract structured question data from saved PracHub HTML pages.

PracHub pages are Next.js apps: the question lives in "flight" chunks pushed
via self.__next_f.push([1, "..."]). Long strings are stored as separate text
blocks ("37:T9d7,<text>") and referenced from the JSON as "$37".

Usage: python3 extract_questions.py raw_html/ questions.jsonl
"""
import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CHUNK_RE = re.compile(r'self\.__next_f\.push\(\[1,"(.*?)"\]\)</script>', re.S)
ROW_RE = re.compile(rb"\n?([0-9a-f]+):(?:T([0-9a-f]+),)?")


def flight_payload(html: str) -> bytes:
    # Each chunk is a JSON string literal; decoding restores the original stream.
    return "".join(json.loads(f'"{chunk}"') for chunk in CHUNK_RE.findall(html)).encode("utf-8")


def text_blocks(payload: bytes) -> dict:
    """Map block id -> text by walking the row stream.

    Rows are either "id:T<hexlen>,<text>" (length in bytes, no terminator, so the
    next row can start immediately) or "id:<json>\\n".
    """
    blocks, pos = {}, 0
    while pos < len(payload):
        match = ROW_RE.match(payload, pos)
        if not match:
            # Not at a row boundary (e.g. stray newline); skip to the next line.
            newline = payload.find(b"\n", pos)
            pos = len(payload) if newline == -1 else newline + 1
            continue
        if match.group(2) is not None:
            start = match.end()
            end = start + int(match.group(2), 16)
            blocks[match.group(1).decode()] = payload[start:end].decode("utf-8", "replace")
            pos = end
        else:
            newline = payload.find(b"\n", match.end())
            pos = len(payload) if newline == -1 else newline + 1
    return blocks


def find_object_with(payload: str, key: str):
    """Return the first JSON object in the stream that contains `"key":`."""
    decoder = json.JSONDecoder()
    marker = payload.find(f'"{key}":')
    while marker != -1:
        # Walk back to each enclosing "{" until one parses as an object containing the key.
        start = payload.rfind("{", 0, marker)
        while start != -1:
            try:
                obj, _ = decoder.raw_decode(payload, start)
                if isinstance(obj, dict) and key in obj:
                    return obj
            except json.JSONDecodeError:
                pass
            start = payload.rfind("{", 0, start)
        marker = payload.find(f'"{key}":', marker + 1)
    return None


def resolve(value, blocks: dict):
    if isinstance(value, str) and re.fullmatch(r"\$[0-9a-f]+", value):
        return blocks.get(value[1:], "")
    return value


def extract(path: Path) -> dict:
    payload_bytes = flight_payload(path.read_text(encoding="utf-8"))
    blocks = text_blocks(payload_bytes)
    payload = payload_bytes.decode("utf-8", "replace")

    post = find_object_with(payload, "content_enhanced") or {}
    approach = find_object_with(payload, "approach") or {}
    approach = approach.get("approach") or {}
    hints_obj = find_object_with(payload, "hints") or {}

    statement = resolve(post.get("content_enhanced"), blocks) or resolve(post.get("content"), blocks) or ""
    return {
        # Locked pages (premium questions for a non-premium viewer) carry only an overview, no statement.
        "locked": not statement.strip() and bool(post.get("is_locked")),
        "statement": statement.strip(),
        "hints": [h for h in hints_obj.get("hints") or [] if isinstance(h, str)],
        "approach": (resolve(approach.get("explanation"), blocks) or "").strip(),
        "time_complexity": approach.get("time_complexity") or "",
        "space_complexity": approach.get("space_complexity") or "",
    }


def main() -> None:
    html_dir, out_path = Path(sys.argv[1]), Path(sys.argv[2])
    with (ROOT / "google_swe_questions.csv").open() as fh:
        meta = {f"{int(r['rank']):03d}-{r['url'].rsplit('/', 1)[1]}": r for r in csv.DictReader(fh)}

    with out_path.open("w") as out:
        for path in sorted(html_dir.glob("*.html")):
            row = meta.get(path.stem, {})
            record = {
                "rank": int(path.stem.split("-", 1)[0]),
                "title": row.get("title", ""),
                "difficulty": row.get("difficulty", ""),
                "round": row.get("round", ""),
                "topics": row.get("topics", ""),
                "summary": row.get("summary", ""),
                "url": row.get("url", ""),
                **extract(path),
            }
            out.write(json.dumps(record, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
