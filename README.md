<p align="center">
  <img src="public/images/vidhyatex-logo.png" alt="Vidhya Tex" width="160" />
</p>

# Vidhya Tex

Boutique online saree shop for **Vidhya Tex**, KK Nagar, Elampillai, Salem, Tamil Nadu.

- WhatsApp / mobile: [+91 99420 87560](https://wa.me/919942087560)
- Email: vidhyatex7@gmail.com
- Storefront: https://vidhyatex.vercel.app

## Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS (shadcn/ui theme tokens)
- Supabase (Postgres, Auth, Storage) with Drizzle ORM
- Cloudflare Workers via OpenNext, R2 for media and cache
- Razorpay / Cashfree payments, Resend email

## Project identity

`project.identity.json` is the single source of truth for brand details, accounts and resource names
(Supabase, Cloudflare, Vercel, GitHub). Read it before any deploy, migration or account change, and run:

```bash
npm run validate:identity
```

Secrets live only in `.env.local` (never committed). See `.env.example` for the required keys.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in Vidhya Tex keys
npm run dev
```

Useful scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server on http://localhost:3000 |
| `npm test` | Run the Jest test suite |
| `npm run db:setup` | Push the schema and seed the database |
| `npm run db:seed-collections` | Upsert the saree categories |
| `npm run deploy` | Validate identity, build and deploy to Cloudflare Workers |

## Brand theme

The colour palette follows the logo: Ganesha yellow `#F5C518`, deep black `#1C1814`,
gold `#C9A227` and warm ink text `#2B2118`. Theme tokens are defined in `src/app/globals.css`.
