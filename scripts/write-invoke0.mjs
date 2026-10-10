import { readFileSync, writeFileSync } from "node:fs";

const code = readFileSync("workers/vidhyatex-catalog/_store-chunk-0.js", "utf8");
writeFileSync(
  "workers/vidhyatex-catalog/_invoke0.json",
  JSON.stringify({ code }),
);
console.log("wrote", Buffer.byteLength(JSON.stringify({ code })));
