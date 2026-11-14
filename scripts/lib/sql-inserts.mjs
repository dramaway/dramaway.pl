/**
 * Minimal reader for phpMyAdmin / mysqldump INSERT blocks.
 * Mirrors scripts/extract_fundacja.py so both tools see the same rows.
 */

export function readInsert(sqlText, table) {
  const marker = `INSERT INTO \`${table}\` VALUES`;
  const idx = sqlText.indexOf(marker);
  if (idx < 0) return null;
  const start = idx + marker.length;
  const end = sqlText.indexOf(";\n", start);
  return sqlText.slice(start, end < 0 ? sqlText.indexOf(";", start) : end);
}

export function splitSqlRows(valuesBlob) {
  if (!valuesBlob) return [];
  const rows = [];
  let i = 0;
  const s = valuesBlob.trim().replace(/;\s*$/, "");
  while (i < s.length) {
    while (i < s.length && " \n\r\t,".includes(s[i])) i += 1;
    if (i >= s.length || s[i] !== "(") break;
    i += 1;
    const fields = [];
    while (true) {
      while (i < s.length && " \n\r\t".includes(s[i])) i += 1;
      if (i < s.length && s[i] === "'") {
        i += 1;
        let val = "";
        while (i < s.length) {
          if (s[i] === "\\" && i + 1 < s.length) {
            val += s[i + 1];
            i += 2;
            continue;
          }
          if (s[i] === "'") {
            if (s[i + 1] === "'") {
              val += "'";
              i += 2;
              continue;
            }
            i += 1;
            break;
          }
          val += s[i];
          i += 1;
        }
        fields.push(val);
      } else if (s.slice(i, i + 4) === "NULL") {
        fields.push(null);
        i += 4;
      } else {
        let j = i;
        while (j < s.length && s[j] !== "," && s[j] !== ")") j += 1;
        fields.push(s.slice(i, j).trim());
        i = j;
      }
      while (i < s.length && " \n\r\t".includes(s[i])) i += 1;
      if (s[i] === ",") {
        i += 1;
        continue;
      }
      if (s[i] === ")") {
        i += 1;
        break;
      }
    }
    rows.push(fields);
  }
  return rows;
}

/** Column names from CREATE TABLE, in dump order. Null when the table is absent. */
export function tableColumns(sqlText, table) {
  const marker = `CREATE TABLE \`${table}\``;
  const start = sqlText.indexOf(marker);
  if (start < 0) return null;
  const open = sqlText.indexOf("(", start);
  if (open < 0) return null;
  const close = sqlText.indexOf("\n)", open);
  const body = sqlText.slice(open + 1, close < 0 ? open + 4000 : close);
  const names = [];
  for (const line of body.split("\n")) {
    const match = line.match(/^\s*`([^`]+)`/);
    if (match) names.push(match[1]);
  }
  return names.length ? names : null;
}

export function columnIndex(columns, name, fallback) {
  if (!columns) return fallback;
  const index = columns.indexOf(name);
  return index >= 0 ? index : fallback;
}
