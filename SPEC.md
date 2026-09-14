# Factură Clară — Product Spec (MVP)

## One-liner
A Moldova-first web app that helps households understand gas, electricity, and water bills: enter or upload payments/readings, map them to the correct billing month, and see what’s paid, pending, or mismatched.

## Why Moldova
Local news (Point.md, NewsMaker, Sep 2026) highlights confusing utility cycles — e.g. August gas payments not reflected on July invoices — plus rising electricity/water/transport costs. Goal: clarity in MDL, not tourist niche features.

## Users
- Primary: people in Moldova managing household utilities (Chișinău first)
- Languages: Romanian (default) + Russian toggle
- Currency: MDL

## MVP scope (1-day ship)
### In
1. **Accounts** — create utility accounts: Gas | Electricity | Water (name, provider optional free-text, account/contract number optional)
2. **Payments ledger** — add payment: utility, amount (MDL), paid-at date, billing-month (YYYY-MM), note, optional receipt filename stub
3. **Readings (optional light)** — meter reading value + date per utility (no OCR in MVP)
4. **Month dashboard** — pick a month; show per-utility: payments sum, last reading, status chips: `paid` / `partial` / `missing` / `mismatch` (mismatch = payment exists for month M but note flags it belonged to another cycle)
5. **CSV import** — simple CSV: `utility,amount_mdl,paid_at,billing_month,note`
6. **Local-first storage** — browser `localStorage` (no auth backend in MVP); export/import JSON backup
7. **i18n** — RO default, RU strings for main UI
8. **Responsive** — mobile-friendly Next.js App Router UI

### Out (post-MVP)
- Real provider APIs / Energocom login
- OCR of PDF bills
- Multi-user sync / accounts
- Push reminders
- Bank connections

## UX outline
- `/` — month dashboard + quick add payment
- `/utilities` — manage utility accounts
- `/payments` — full ledger + CSV import
- `/settings` — language (ro|ru), export/import JSON, reset local data

## Tech
- Next.js (App Router) + TypeScript + Tailwind
- Client-side state (Zustand or React context) + `localStorage`
- Deploy on Vercel
- No database for MVP

## Success criteria
1. User can add 3 utilities and log payments in MDL for a billing month
2. Dashboard clearly shows paid vs missing for that month
3. RO/RU toggle works on main screens
4. JSON export/import round-trips data
5. Deploys to a public Vercel URL

## Seed copy (RO)
Title: Factură Clară  
Tagline: Înțelege facturile la gaz, curent și apă — pe luni, în lei.

## Source inspiration
- Point.md: Energocom billing-cycle confusion; inflation / household saving
- NewsMaker: fuel and service cost volatility
