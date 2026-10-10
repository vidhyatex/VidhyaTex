import fs from "node:fs";

for (let i = 0; i < 4; i++) {
  const chunk = fs.readFileSync(`workers/vidhyatex-catalog/_chunk_${i}.txt`, "utf8");
  const code = `async () => {
  const dbId = "SET_AFTER_D1_CREATE";
  const chunk = ${JSON.stringify(chunk)};
  const res = await cloudflare.request({
    method: "POST",
    path: \`/accounts/\${accountId}/d1/database/\${dbId}/query\`,
    body: {
      sql: "INSERT OR REPLACE INTO catalog_meta (key, value) VALUES (?, ?)",
      params: ["worker_b64_${i}", chunk],
    },
  });
  return { i: ${i}, success: res.success, errors: res.errors };
}`;
  fs.writeFileSync(`workers/vidhyatex-catalog/_insert_${i}.js`, code);
  console.log("wrote insert", i, code.length);
}
