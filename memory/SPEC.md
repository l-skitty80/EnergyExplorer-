# Renewable Energy Explorer v1

## What it does

HELIOS is a browser-first educational renewable-energy explorer for engineering students. It has a dark-first responsive shell with intentional light mode and nine routes: Observatory home, Smart Solar Tracker, Electricity Journey, Personal Calculator, illustrative LPU Case Study, Power the City game, Information Hub, Survey placeholder, and About/Sources.

## Data model and persistence

There are no accounts, server-side user records, analytics, or survey responses. The FastAPI/Mongo boundary remains the template future-ready boundary; v1 calculations and game state run in the browser. Local storage keeps theme, calculator inputs, and game progress. The footer can clear calculator/game data and restore dark theme.

Versioned browser constants live in `frontend/src/lib/energy.ts`: emissions factors, technology descriptions, and deterministic game rules.

## Key flows

- Visitor opens home, then selects a tool from the toolbox or header.
- Solar controls update output immediately and explain the first-order equation.
- Electricity Journey uses keyboard-accessible clickable stages to explain source → device.
- Calculator validates numeric, non-negative, finite, and bounded inputs; breakdown updates immediately.
- LPU assumptions are editable and every modeled result carries a persistent not-official-audit boundary.
- City game supports build actions, day advancement, weather, demand, budget, reliability, emissions, win/lose messaging, and reset.
- Information Hub uses a consistent topic template for solar, wind, hydro, biomass, geothermal, green hydrogen, and tidal power.
- Survey is a safe external Google Forms placeholder; the final URL is intentionally not supplied yet.
- About/Sources exposes methodology, limitations, and placeholder citations for content review.

## Auth and roles

Optional Emergent-managed Google sign-in is available from the shared header and `/account`; public tools remain ungated. The frontend handles the one-use `#session_id` fragment synchronously with `useLocation().hash`, sends it to `POST /api/auth/session`, and never stores tokens. FastAPI exchanges the ID server-side, upserts a custom-UUID user, stores a seven-day session in MongoDB, and sets an httpOnly secure cookie. `/api/auth/me` is the session source of truth and `/api/auth/logout` clears the session. No roles/RBAC are implemented.

## Intentional limitations

Models are understandable classroom estimates, not industrial simulators, official LPU measurements, bills, audits, or lifecycle assessments. Source register entries need final faculty/content review before public release.