#!/usr/bin/env python3
"""Add a new project entry to projects-data.js.

Examples:
  python3 new_project.py "Weather ETL" --category hobby --stack "Python,SQL,Airflow"
  python3 new_project.py "Spark course notes" --category study --status in-progress

The entry is inserted above the "ADD NEW PROJECTS ABOVE THIS LINE" marker with
placeholder text. Open projects-data.js afterwards and fill in the details.
"""
import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

MARKER = "/* ADD NEW PROJECTS ABOVE THIS LINE"
DATA = Path(__file__).with_name("projects-data.js")


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("title")
    ap.add_argument("--category", choices=["work", "hobby", "study"], default="hobby")
    ap.add_argument("--status", choices=["shipped", "in-progress", "archived"], default="in-progress")
    ap.add_argument("--stack", default="", help="comma-separated tools")
    ap.add_argument("--summary", default="One or two sentences on what it is and why you built it.")
    ap.add_argument("--featured", action="store_true", help="also show on the home page")
    args = ap.parse_args()

    pid = slugify(args.title)
    if not pid:
        sys.exit("Title must contain letters or numbers.")
    text = DATA.read_text(encoding="utf-8")
    if MARKER not in text:
        sys.exit("Marker line not found in projects-data.js; add the entry by hand.")
    if re.search(r'["\']?id["\']?\s*:\s*"%s"' % re.escape(pid), text):
        sys.exit("A project with id '%s' already exists." % pid)

    entry = {
        "id": pid,
        "title": args.title,
        "category": args.category,
        "status": args.status,
        "date": date.today().strftime("%Y-%m"),
        "featured": args.featured,
        "role": "Solo project",
        "stack": [s.strip() for s in args.stack.split(",") if s.strip()],
        "tags": [],
        "summary": args.summary,
        "flow": [{"label": "Source", "tone": "b"}, {"label": "Transform", "tone": "s"}, {"label": "Output", "tone": "g"}],
        "metrics": [],
        "sections": [{"heading": "What I built", "body": "Describe it here.", "bullets": ["Point one", "Point two"]}],
        "links": [],
    }
    body = json.dumps(entry, indent=2, ensure_ascii=False)
    body = "\n".join("  " + line for line in body.splitlines())

    head, tail = text.split(MARKER, 1)
    head = head.rstrip()
    if not head.endswith(("[", ",")):
        head += ","
    new = head + "\n" + body + "\n\n  " + MARKER + tail
    DATA.write_text(new, encoding="utf-8")
    print("Added '%s' (id: %s). Now edit projects-data.js to fill in the details." % (args.title, pid))
    print("Open: project.html?id=" + pid)


if __name__ == "__main__":
    main()
