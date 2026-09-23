# Northline

A small general store inspired by Amazon.com. Shoppers browse departments, search, add items to a guest cart, sign in, and check out. Prices are in USD. Card numbers are validated and never charged or stored.

**Live site:** https://amazon-rebuild-8x.vercel.app

## Stack

| Piece | Choice |
| --- | --- |
| App | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, Radix primitives |
| Data | Drizzle ORM |
| Database | Neon Postgres in production. Local file Postgres (PGlite) when `DATABASE_URL` is unset |
| Host | Vercel |

## Run it locally

Requires Node.js 20 or newer.

```bash
git clone https://github.com/arifhussain88/amazon-replica-assesment.git
cd amazon-replica-assesment
npm install
npm run dev
```

Open http://localhost:3000. The first request creates the tables and seeds the catalog. With no `DATABASE_URL`, data is stored in `.data/northline` (gitignored).

To use Neon instead, copy `.env.example` to `.env.local` and set `DATABASE_URL` to the **pooled** connection string (the host contains `-pooler`). Restart the dev server after changing env files.

## Checkout notes

- A guest can fill a cart. Checkout requires an account (password of at least 8 characters).
- Shipping is free from $35. Otherwise it is $5.99.
- Demo card: `4242 4242 4242 4242`, any future expiry, any 3–4 digit CVC.
- Orders are listed under Account & Orders for the signed-in user.

## Deploy

Production runs on Vercel and needs the same `DATABASE_URL` in the project environment (Production, Preview, and Development). PGlite does not persist on Vercel. Schema setup and catalog sync run when the app starts against Neon; existing rows are kept and missing catalog products are inserted.
