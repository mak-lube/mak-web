# MAK Lube – Field Price Lookup & Operations (Web)

Internal web app for the MAK Lube owner to retrieve SKU pricing and master data from Supabase, compare SKUs in the field, and prepare for upcoming order/inventory analytics and data-viz workflows. Built with Next.js 16 (App Router) and Supabase browser client.

> **Audience:** project owner and contributors using VS Code and Codex-based AI tools.

---

## What the app does today
- **Price lookup (`/price`)**
  - Search SKUs by partial **name** or **code** (required text input).
  - Optional filters: **product group** and **viscosity spec**.
  - Shows name, SKU code, product group, viscosity, pack size (L), packs per case, and current **DLP per pack** (from `sku_prices_current`).
  - If no DLP exists, price remains empty/"No DLP set".
- **Dev playground (`/`)**
  - Connectivity check to Supabase.
  - Same search UI as `/price` for quick testing.

## Roadmap (near-term)
- Column-level filters beyond the current trio (e.g., brand, active flag, pack size ranges).
- **Frontend math tools** for SKU comparisons (diffs, ratios, margin simulations) before placing orders.
- Additional flows focused on analyzing existing orders and inventory data, plus visualizations for fast insights.

---

## Architecture snapshot
- **Frontend:** Next.js 16 (TypeScript, App Router), client components for the search form/results.
- **Backend/data:** Supabase Postgres (`mak-lube`), using RPC `search_skus` plus tables `skus`, `sku_prices_current`, and `inventory_balances`. Fuzzy search relies on `pg_trgm` indexes.
- **Client SDK:** `@supabase/supabase-js` v2 browser client.

### Environment variables
Set the following in `.env.local` (they are read in `lib/supabaseClient.ts`):
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

---

## Getting started (local dev)
1. Install Node 20+ (matches Next.js 16 requirements).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` with Supabase URL and anon key.
4. Run the dev server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000/price` for the main lookup UI (or `/` for the playground).

### VS Code tips
- Recommended extensions: **ESLint**, **Prettier**, **Tailwind CSS IntelliSense** (if styling is added), **Supabase** extension (optional for DB browsing).
- Debugging: use the built-in **JavaScript Debug Terminal**; start with `npm run dev` and attach the VS Code debugger to the Next.js process.
- AI workflows: Codex/inline chat can navigate the `app/`, `components/`, and `lib/` directories; no special tasks or launch configs are required.

---

## Data & search behaviour (source of truth)
- **Table `public.skus`** stores master SKU data (code, name, product group, brand, viscosity, pack size, packs per case, MRP, active flag). Trigram indexes on `name`/`sku_code` support fuzzy matching.
- **Table `public.sku_prices_current`** stores current DLP per pack; lookup joins against `skus`.
- **RPC `search_skus`** handles fuzzy search + optional filters for product group and viscosity; results feed the frontend list.

---

## Quality bar
- Follow TypeScript strictness already configured.
- Keep client components lean; offload filters/search to `search_skus` via Supabase.
- Prefer **no try/catch around imports** (project convention).
- Add tests or linters before PR when feasible (`npm run lint`).

---

## Future enhancements to track
- Add column-level filters (brand, pack size, active flag) to `search_skus` and UI controls.
- Client-side calculators for comparing SKUs (e.g., price per litre, case totals, % deltas).
- Order analytics pages that surface and compare orders already stored in the database (no order-building flow here).
- Inventory analytics that summarize `inventory_balances` and related tables.
- Visual outputs (charts/graphs) that combine order and inventory insights for quick field decisions.

---

## Deployment (Vercel)
- Target: **Vercel** connected to GitHub repo `mak-web`.
- Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Project Settings → Environment Variables.
- Build command: `npm run build`; output directory: `.next/`.
- For previews, Vercel will auto-deploy per branch; production comes from the default branch.
