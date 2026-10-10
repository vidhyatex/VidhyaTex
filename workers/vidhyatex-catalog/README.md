# vidhyatex-catalog Worker

D1 catalog mirror for Vidhya Tex. Supabase remains source of truth; this Worker syncs a read copy into D1 and exposes `/sync`, `/health`, `/products`, `/collections`.

## Bindings

- D1 `DB` → `vidhyatex-catalog` (`SET_AFTER_D1_CREATE`, APAC)
- Secrets: `CATALOG_SYNC_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`

## Deploy

```bash
npx esbuild workers/vidhyatex-catalog/src/index.ts --bundle --format=esm --outfile=workers/vidhyatex-catalog/dist-worker.js --platform=neutral --target=es2022
npx wrangler deploy --config workers/vidhyatex-catalog/wrangler.jsonc
```

## App env

```
CATALOG_READ=d1
CATALOG_WORKER_URL=https://vidhyatex-catalog.vidhyatex.workers.dev
CATALOG_SYNC_SECRET=<same as worker secret>
```

`CATALOG_READ=d1` enables featured, shop search, and PDP shell reads from D1 (Supabase fallback). Cart/checkout stay on Supabase.

## Products API

`GET /products`: `slug` (+ gallery), `featured=1`, `q`, `sort` (newest|name_asc|price_asc|price_desc|featured), `price_min`/`price_max` (effective), `collection_id`, `require_collection=1`, `limit`/`offset` → `{ products, hasMore }`.

## Live

- https://vidhyatex-catalog.vidhyatex.workers.dev
