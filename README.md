# Factură Clară

Moldova-first web app that helps households understand **gas**, **electricity**, and **water** bills: log payments and readings in **MDL**, map them to billing months, and see what’s **paid**, **partial**, **missing**, or **mismatched**.

> Tagline (RO): *Înțelege facturile la gaz, curent și apă — pe luni, în lei.*

See [SPEC.md](./SPEC.md) for the full product spec.

## Features (MVP)

- **Utility accounts** — Gas / Electricity / Water (name, optional provider & contract number)
- **Payments ledger** — amount (MDL), paid-at date, billing month (`YYYY-MM`), note, optional receipt filename
- **Meter readings** — value + date per utility
- **Month dashboard** — status chips: `paid` | `partial` | `missing` | `mismatch`
- **CSV import** — `utility,amount_mdl,paid_at,billing_month,note`
- **JSON export / import** — full local backup round-trip
- **i18n** — Romanian (default) + Russian toggle
- **Local-first** — `localStorage` via Zustand (no backend / auth)
- **Demo seed** — sample Chișinău-style data on first visit

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- shadcn/ui components (Radix UI primitives)
- GSAP + `@gsap/react` for subtle client-side card entrance animations
- React Bits accents (`ShinyText` subtle shimmer on logo title)
- Sonner toasts
- Lucide React icons
- Zustand + `persist` middleware (local-first browser storage)

## Routes

| Path | Purpose |
|------|---------|
| `/` | Month dashboard + quick add payment |
| `/utilities` | Manage utilities + readings |
| `/payments` | Full ledger + CSV import |
| `/settings` | Language, JSON backup, reset |

## Run locally

```bash
cd factura-clara
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm start
```

## Deploy (Vercel)

Connect the repo to Vercel, or:

```bash
npx vercel
```

No environment variables required for the MVP.

## Data model (browser)

Persisted under `localStorage` key `factura-clara-v1`:

- `utilities[]`, `payments[]`, `readings[]`, `locale`, `seeded`, `selectedMonth`

### CSV example

```csv
utility,amount_mdl,paid_at,billing_month,note
gas,620.50,2026-08-28,2026-08,mismatch — paid for prior cycle
electricity,485,2026-09-03,2026-09,Achitat integral
water,40,2026-09-05,2026-09,partial
```

`utility` may be `gas` | `electricity` | `water` (or RO/RU synonyms) or an account name.

### Status rules (simple MVP)

- **missing** — no payments for that utility/month
- **mismatch** — a payment note mentions another billing cycle / “mismatch”
- **partial** — note says partial, or sum &lt; 50 MDL
- **paid** — otherwise

## Project layout

```
src/
  app/           # App Router pages
  components/    # Nav, forms, chips
  lib/           # types, i18n, seed, utils
  store/         # Zustand store
SPEC.md          # Product spec
```

## License

MIT — built as a local-first MVP for Moldova households.
