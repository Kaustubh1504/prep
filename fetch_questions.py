"""Download PracHub questions (prompt + solution) within the plan's quota.

Reads the ranked list from google_swe_questions.csv, opens questions in
priority order through PracHub's MCP endpoint, and saves each one to
questions/<rank>-<slug>.md. Already-downloaded questions are skipped, so
re-running the script each day picks up where it left off.

Usage: python3 fetch_questions.py [--csv PATH] [--max N]
"""
import argparse
import csv
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CSV_PATH = ROOT / "google_swe_questions.csv"
OUT_DIR = ROOT / "questions"
MCP_URL = "https://api.prachub.com/api/mcp"
# Burst cap is 10 new questions per 10 minutes; stay just under it.
SECONDS_BETWEEN_OPENS = 62

# Intern loops are coding-heavy: coding first, then fundamentals, then the rest.
CATEGORY_PRIORITY = ["Coding & Algorithms", "Software Engineering Fundamentals", "Behavioral & Leadership"]
DIFFICULTY_PRIORITY = ["medium", "easy", "hard"]


def load_api_key() -> str:
    for line in (ROOT / ".env").read_text().splitlines():
        if line.startswith("PRACHUB_API="):
            return line.split("=", 1)[1].strip().strip("\"'")
    sys.exit("PRACHUB_API not found in .env")


def call_tool(api_key: str, name: str, arguments: dict) -> tuple[str, bool]:
    """Call an MCP tool and return (text, is_error)."""
    body = {"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": name, "arguments": arguments}}
    request = urllib.request.Request(
        MCP_URL,
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
            # The endpoint rejects urllib's default User-Agent with a 403.
            "User-Agent": "prachub-fetch/1.0",
        },
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        payload = json.load(response)
    if "error" in payload:
        return payload["error"].get("message", str(payload["error"])), True
    result = payload["result"]
    text = "\n".join(part.get("text", "") for part in result.get("content", []))
    return text, bool(result.get("isError"))


def remaining_today(api_key: str) -> int:
    text, _ = call_tool(api_key, "get_quota", {})
    match = re.search(r"Opened today: \d+ of \d+ questions \((\d+) left\)", text)
    return int(match.group(1)) if match else 0


def priority(row: dict) -> tuple:
    def index(options: list, value: str) -> int:
        return options.index(value) if value in options else len(options)

    return (index(CATEGORY_PRIORITY, row["category"]), index(DIFFICULTY_PRIORITY, row["difficulty"]), int(row["rank"]))


def output_path(row: dict) -> Path:
    slug = row["url"].rsplit("/", 1)[1]
    return OUT_DIR / f"{int(row['rank']):03d}-{slug}.md"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", type=Path, default=CSV_PATH, help="question list to fetch (needs rank, category, difficulty, url)")
    parser.add_argument("--max", type=int, default=None, help="open at most N new questions this run")
    args = parser.parse_args()

    api_key = load_api_key()
    OUT_DIR.mkdir(exist_ok=True)
    with args.csv.open() as fh:
        queue = [row for row in sorted(csv.DictReader(fh), key=priority) if not output_path(row).exists()]

    budget = remaining_today(api_key)
    if args.max is not None:
        budget = min(budget, args.max)
    print(f"{len(queue)} questions not yet downloaded; opening up to {budget} today", flush=True)

    for opened, row in enumerate(queue[:budget]):
        if opened:
            time.sleep(SECONDS_BETWEEN_OPENS)
        slug = row["url"].rsplit("/", 1)[1]
        text, is_error = call_tool(api_key, "get_question", {"question": slug, "include_solution": True})
        if is_error:
            print(f"Stopped at #{row['rank']} {slug}: {text}", flush=True)
            break
        header = f"<!-- rank {row['rank']} · {row['category']} · {row['round']} · {row['difficulty']} · {row['url']} -->\n\n"
        output_path(row).write_text(header + text)
        print(f"[{opened + 1}/{budget}] saved {output_path(row).name}", flush=True)

    print(f"Done. {len(list(OUT_DIR.glob('*.md')))} questions in {OUT_DIR}", flush=True)


if __name__ == "__main__":
    main()
