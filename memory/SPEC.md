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

No authentication or roles in v1.

## Intentional limitations

Models are understandable classroom estimates, not industrial simulators, official LPU measurements, bills, audits, or lifecycle assessments. Source register entries need final faculty/content review before public release.