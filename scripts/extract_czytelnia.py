#!/usr/bin/env python3
"""Extract published drama_teatr articles into JSON for the Czytelnia migrate.

Reads: private/dumps/drama_teatr_*.sql.gz
Writes: apps/web/src/data/extracted/czytelnia.json (gitignored)

Only Drupal `article` nodes with status=1 (82 published). Personas are resolved
to author name strings — not exported as documents. Events, projects and
organisations are skipped.
"""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DUMPS = ROOT / "private" / "dumps"
OUT_DIR = ROOT / "apps" / "web" / "src" / "data" / "extracted"
OUT_FILE = OUT_DIR / "czytelnia.json"

WANTED_TABLES = (
    "node",
    "url_alias",
    "file_managed",
    "taxonomy_term_data",
    "field_data_body",
    "field_data_field_autor",
    "field_data_field_dokument",
    "field_data_field_kategoria_czytelnii",
    "field_data_field_image",
    "field_data_field_link_do_filmu",
)


def find_dump() -> Path:
    named = DUMPS / "drama_teatr_1787254349.sql.gz"
    if named.exists():
        return named
    candidates = sorted(DUMPS.glob("drama_teatr_*.sql.gz")) + sorted(
        DUMPS.glob("drama_teatr_*.sql")
    )
    if not candidates:
        raise SystemExit(
            f"No drama_teatr dump found in {DUMPS}. See private/README.md."
        )
    return candidates[-1]


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


def _consume_sql(s: str, in_string: bool, escape: bool) -> tuple[bool, bool, bool]:
    i = 0
    n = len(s)
    while i < n:
        ch = s[i]
        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == "'":
                if i + 1 < n and s[i + 1] == "'":
                    i += 2
                    continue
                in_string = False
        else:
            if ch == "'":
                in_string = True
            elif ch == ";":
                return in_string, escape, True
        i += 1
    return in_string, escape, False


def iter_insert_blobs(dump_path: Path, tables: tuple[str, ...]):
    """Yield (table, VALUES blob) without loading the whole dump."""
    wanted = set(tables)
    opener = dump_path.open
    if dump_path.suffix == ".gz":
        import gzip

        def opener(mode="rt", **kw):  # type: ignore[misc]
            return gzip.open(dump_path, mode, encoding="utf-8", errors="replace")

    with opener("rt", encoding="utf-8", errors="replace") as f:
        current = None
        buf: list[str] = []
        in_string = False
        escape = False
        for line in f:
            if current is None:
                if not line.startswith("INSERT INTO `"):
                    continue
                name = line.split("`")[1]
                if name not in wanted:
                    continue
                current = name
                marker = f"INSERT INTO `{name}` VALUES"
                rest = (
                    line[len(marker) :]
                    if line.startswith(marker)
                    else line.split("VALUES", 1)[-1]
                )
                buf = [rest]
                in_string, escape, done = _consume_sql(rest, False, False)
                if done:
                    yield current, "".join(buf)
                    current = None
                    buf = []
                    in_string = False
                    escape = False
                continue
            buf.append(line)
            in_string, escape, done = _consume_sql(line, in_string, escape)
            if done:
                yield current, "".join(buf)
                current = None
                buf = []
                in_string = False
                escape = False


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


FID_IN_TOKEN = re.compile(r'"fid"\s*:\s*"?(\d+)"?')


def main() -> None:
    dump_path = find_dump()
    print(f"Reading {dump_path} …")

    tables: dict[str, list[list[str | None]]] = {t: [] for t in WANTED_TABLES}
    for table, blob in iter_insert_blobs(dump_path, WANTED_TABLES):
        tables[table].extend(split_rows(blob))
        print(f"  {table}: {len(tables[table])}")

    terms = {r[0]: r[2] for r in tables["taxonomy_term_data"] if r}
    personas = {
        r[0]: r[4]
        for r in tables["node"]
        if r and r[2] == "persona"
    }
    aliases = {
        r[1]: r[2]
        for r in tables["url_alias"]
        if r and r[1] and r[1].startswith("node/")
    }
    files = {
        r[0]: {
            "fid": r[0],
            "filename": r[2] or "",
            "uri": (r[3] or "").replace("public://", ""),
            "mime": r[4] or "",
        }
        for r in tables["file_managed"]
        if r
    }

    bodies: dict[str, tuple[str, str]] = {}
    for r in tables["field_data_body"]:
        if r and r[0] == "node" and r[6] == "0":
            bodies[r[3]] = (r[7] or "", r[8] or "")

    authors_by_nid: dict[str, list[str]] = {}
    for r in tables["field_data_field_autor"]:
        if not r or r[0] != "node":
            continue
        name = personas.get(r[7] or "")
        if name:
            authors_by_nid.setdefault(r[3], []).append(name)

    pdf_by_nid: dict[str, str] = {}
    for r in tables["field_data_field_dokument"]:
        if r and r[0] == "node" and r[7] and r[3] not in pdf_by_nid:
            pdf_by_nid[r[3]] = r[7]

    image_by_nid: dict[str, tuple[str, str]] = {}
    for r in tables["field_data_field_image"]:
        if r and r[0] == "node" and r[7] and r[3] not in image_by_nid:
            image_by_nid[r[3]] = (r[7], r[8] or "")

    video_by_nid: dict[str, str] = {}
    for r in tables["field_data_field_link_do_filmu"]:
        if r and r[0] == "node" and r[7] and r[3] not in video_by_nid:
            video_by_nid[r[3]] = r[7]

    format_by_nid: dict[str, str] = {}
    for r in tables["field_data_field_kategoria_czytelnii"]:
        if r and r[0] == "node" and r[7] and r[3] not in format_by_nid:
            format_by_nid[r[3]] = terms.get(r[7] or "", r[7] or "")

    articles = []
    used_fids: set[str] = set()
    unpublished = 0

    for n in tables["node"]:
        nid, _vid, ntype, _lang, title, _uid, status = n[:7]
        if ntype != "article":
            continue
        if status != "1":
            unpublished += 1
            continue
        body_html, body_summary = bodies.get(nid, ("", ""))
        alias = aliases.get(f"node/{nid}")
        slug = alias.split("/")[-1] if alias else slugify(title or nid)
        pdf_fid = pdf_by_nid.get(nid)
        image = image_by_nid.get(nid)
        for fid in FID_IN_TOKEN.findall(body_html):
            used_fids.add(fid)
        if pdf_fid:
            used_fids.add(pdf_fid)
        if image:
            used_fids.add(image[0])
        summary_src = body_summary or body_html
        articles.append(
            {
                "nid": int(nid),
                "title": (title or "").strip(),
                "slug": slug,
                "alias": alias or "",
                "authors": authors_by_nid.get(nid, []),
                "summary": strip_tags(summary_src)[:280],
                "bodyHtml": body_html,
                "format": format_by_nid.get(nid, ""),
                "pdfFid": pdf_fid,
                "imageFid": image[0] if image else None,
                "imageAlt": image[1] if image else "",
                "videoUrl": video_by_nid.get(nid),
            }
        )

    file_subset = {fid: files[fid] for fid in used_fids if fid in files}

    payload = {
        "source": dump_path.name,
        "database": "drama_teatr",
        "extractedAt": datetime.now(timezone.utc).isoformat(),
        "counts": {
            "articles": len(articles),
            "unpublishedArticles": unpublished,
            "files": len(file_subset),
        },
        "articles": sorted(articles, key=lambda x: x["nid"]),
        "files": file_subset,
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(
        f"Wrote {OUT_FILE.relative_to(ROOT)} "
        f"({payload['counts']['articles']} published articles, "
        f"{payload['counts']['unpublishedArticles']} unpublished skipped, "
        f"{payload['counts']['files']} files)"
    )


if __name__ == "__main__":
    main()
