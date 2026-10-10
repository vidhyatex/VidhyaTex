import { readFileSync, writeFileSync } from "node:fs";

const parts = JSON.parse(
  readFileSync("workers/vidhyatex-catalog/_chunks.json", "utf8"),
);
const sqls = parts.map(
  (p, i) =>
    `INSERT OR REPLACE INTO catalog_meta (key, value) VALUES ('worker_b64_${i}', '${p}');`,
);
writeFileSync("workers/vidhyatex-catalog/_chunk-sqls.json", JSON.stringify(sqls));
console.log(sqls.map((s) => s.length));
