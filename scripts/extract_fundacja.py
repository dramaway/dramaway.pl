#!/usr/bin/env python3
"""Extract fundacja Drupal dump into JSON for local Next.js preview pages.

Reads: private/dumps/drama_mfund_*.sql
Writes: apps/web/src/data/extracted/fundacja.json (gitignored)
"""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DUMPS = ROOT / "private" / "dumps"
OUT_DIR = ROOT / "apps" / "web" / "src" / "data" / "extracted"
OUT_FILE = OUT_DIR / "fundacja.json"


def find_dump() -> Path:
    candidates = sorted(DUMPS.glob("drama_mfund_*.sql")) + sorted(
        DUMPS.glob("drama_mfund_*.sql.gz")
    )
    if not candidates:
        raise SystemExit(
            f"No fundacja dump found in {DUMPS}. See private/README.md."
        )
    return candidates[-1]


def read_insert(sql_text: str, table: str) -> str | None:
    marker = f"INSERT INTO `{table}` VALUES"
    idx = sql_text.find(marker)
    if idx < 0:
        return None
    start = idx + len(marker)
    end = sql_text.find(";\n", start)
    if end < 0:
        end = sql_text.find(";", start)
    return sql_text[start:end]


def split_rows(values_blob: str | None) -> list[list[str | None]]:
    if not values_blob:
        return []
    rows: list[list[str | None]] = []
    i = 0
    s = values_blob.strip().rstrip(";")
    while i < len(s):
        while i < len(s) and s[i] in " \n\r\t,":
            i += 1
        if i >= len(s) or s[i] != "(":
            break
        i += 1
        fields: list[str | None] = []
        while True:
            while i < len(s) and s[i] in " \n\r\t":
                i += 1
            if i < len(s) and s[i] == "'":
                i += 1
                val: list[str] = []
                while i < len(s):
                    if s[i] == "\\" and i + 1 < len(s):
                        val.append(s[i + 1])
                        i += 2
                        continue
                    if s[i] == "'":
                        if i + 1 < len(s) and s[i + 1] == "'":
                            val.append("'")
                            i += 2
                            continue
                        i += 1
                        break
                    val.append(s[i])
                    i += 1
                fields.append("".join(val))
            elif i < len(s) and s[i : i + 4] == "NULL":
                fields.append(None)
                i += 4
            else:
                j = i
                while j < len(s) and s[j] not in ",)":
                    j += 1
                fields.append(s[i:j].strip())
                i = j
            while i < len(s) and s[i] in " \n\r\t":
                i += 1
            if i < len(s) and s[i] == ",":
                i += 1
                continue
            if i < len(s) and s[i] == ")":
                i += 1
                break
        rows.append(fields)
    return rows


def slugify(title: str) -> str:
    s = title.lower().strip()
    repl = {
        "ą": "a",
        "ć": "c",
        "ę": "e",
        "ł": "l",
        "ń": "n",
        "ó": "o",
        "ś": "s",
        "ź": "z",
        "ż": "z",
    }
    for a, b in repl.items():
        s = s.replace(a, b)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s or "item"


def strip_tags(html: str) -> str:
    text = re.sub(r"<[^>]+>", " ", html or "")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def main() -> None:
    dump_path = find_dump()
    print(f"Reading {dump_path} …")
    if dump_path.suffix == ".gz":
        import gzip

        sql_text = gzip.open(dump_path, "rt", encoding="utf-8", errors="replace").read()
    else:
        sql_text = dump_path.read_text(encoding="utf-8", errors="replace")

    nodes = split_rows(read_insert(sql_text, "node"))
    bodies = {
        r[3]: r[7] or ""
        for r in split_rows(read_insert(sql_text, "field_data_body"))
        if r and r[0] == "node" and r[6] == "0"
    }
    aliases = {
        r[1]: r[2]
        for r in split_rows(read_insert(sql_text, "url_alias"))
        if r and r[1] and r[1].startswith("node/")
    }
    files = {
        r[0]: (r[3] or "").replace("public://", "")
        for r in split_rows(read_insert(sql_text, "file_managed"))
        if r
    }
    photos = {
        r[3]: files.get(r[7] or "", None)
        for r in split_rows(read_insert(sql_text, "field_data_field_zdj_cie"))
        if r and r[0] == "node"
    }

    type_map = {
        "page": "page",
        "czlonek_zespolu": "person",
        "aktualnosc": "news",
    }

    pages = []
    people = []
    news = []

    for n in nodes:
        nid, _vid, ntype, _lang, title, _uid, status = n[:7]
        if status != "1":
            continue
        if ntype not in type_map:
            continue
        body_html = bodies.get(nid, "")
        alias = aliases.get(f"node/{nid}")
        slug = alias.split("/")[-1] if alias else slugify(title or nid)
        item = {
            "nid": int(nid),
            "type": type_map[ntype],
            "drupalType": ntype,
            "title": title,
            "slug": slug,
            "path": f"/{alias}" if alias else f"/{slug}",
            "bodyHtml": body_html,
            "summary": strip_tags(body_html)[:280],
        }
        if ntype == "czlonek_zespolu":
            item["photo"] = photos.get(nid)
            people.append(item)
        elif ntype == "aktualnosc":
            news.append(item)
        else:
            pages.append(item)

    payload = {
        "source": dump_path.name,
        "database": "drama_mfund",
        "extractedAt": datetime.now(timezone.utc).isoformat(),
        "counts": {
            "pages": len(pages),
            "people": len(people),
            "news": len(news),
        },
        "pages": sorted(pages, key=lambda x: x["title"].lower()),
        "people": sorted(people, key=lambda x: x["title"].lower()),
        "news": sorted(news, key=lambda x: x["title"].lower()),
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(
        f"Wrote {OUT_FILE.relative_to(ROOT)} "
        f"({payload['counts']['pages']} pages, "
        f"{payload['counts']['people']} people, "
        f"{payload['counts']['news']} news)"
    )


if __name__ == "__main__":
    main()
