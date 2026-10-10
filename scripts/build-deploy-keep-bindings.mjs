import { readFileSync, writeFileSync } from "node:fs";

const workerCode = readFileSync(
  "workers/vidhyatex-catalog/dist-worker.js",
  "utf8",
);

const deploy = `async () => {
  const workerCode = ${JSON.stringify(workerCode)};
  const metadata = {
    main_module: "worker.js",
    compatibility_date: "2026-08-14",
    keep_bindings: ["secret_text"],
    bindings: [
      { type: "d1", name: "DB", id: "SET_AFTER_D1_CREATE" },
    ],
  };
  const b = "----B" + Date.now();
  const body = [
    "--" + b,
    'Content-Disposition: form-data; name="metadata"',
    "Content-Type: application/json",
    "",
    JSON.stringify(metadata),
    "--" + b,
    'Content-Disposition: form-data; name="worker.js"; filename="worker.js"',
    "Content-Type: application/javascript+module",
    "",
    workerCode,
    "--" + b + "--",
  ].join("\\r\\n");
  const upload = await cloudflare.request({
    method: "PUT",
    path: "/accounts/" + accountId + "/workers/scripts/vidhyatex-catalog",
    query: { include_subdomain_availability: "true" },
    body,
    contentType: "multipart/form-data; boundary=" + b,
    rawBody: true,
  });
  return {
    uploadSuccess: upload.success,
    uploadStatus: upload.status,
    uploadErrors: upload.errors,
    messages: upload.messages,
  };
}`;

writeFileSync("workers/vidhyatex-catalog/_mcp-deploy-keep.js", deploy);
console.log("bytes", deploy.length);
