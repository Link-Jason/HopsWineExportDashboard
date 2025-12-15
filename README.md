# Hops & Wine Export Friction Dashboard (Finland / EU)

Portfolio-ready BI and risk modeling case study that shows how a single analyst can frame a trade decision, quantify friction, and ship a lightweight decision-support tool to Vercel. The focus is business judgment, not framework ceremony.

## Project Overview
- Single-user SaaS-style MVP that scores export friction for Washington State hops and wine exporters considering Finland / EU.
- Combines operational and relational risk into a Friction Index with contextual guidance, confidence score, and quick visualization.
- Built to demonstrate analytical ownership: clear assumptions, explicit weights, and pragmatic shipping of a serverless + static front end.

## Business Problem
Exporters weigh hard-to-compare factors: logistics reliability, perishability, tariffs, communication norms, and culture. Without a structured view, teams over-index on anecdotes. This dashboard offers a repeatable risk frame and scenario testing so leaders can decide if/when to proceed, and where to mitigate first.

## How the Friction Index Works
- Operational Friction = (Logistics + Perishability + Export Cost) × Scenario Multiplier.
- Relational Friction = Tariff × (1 + Tariff Adjustment) + Communication + Culture.
- Friction Index blends both using analyst-chosen weights:  
  `((Operational × weightOperational) + (Relational × weightRelational)) / (weightOperational + weightRelational)`
- Color bands keep interpretation simple: Green ≤ 10, Yellow 11–18, Red > 18.

## Operational vs Relational Risk
- Operational covers execution risk: capacity, cold chain, and direct cost exposure.
- Relational covers trust-building risk: tariff drag, documentation fit, communication style, and culture distance.
- Splitting them lets leaders sequence mitigation: shore up the dominant side first, instead of spreading effort thinly.

## Scenario Analysis
- Scenario Multiplier stress-tests operational load (e.g., tighter freight capacity).
- Tariff Adjustment models shocks or relief to duties.
- Weights let an analyst mirror leadership priorities (e.g., CFO may upweight relational if pricing trust is fragile).
- Output includes confidence that decays more when relational friction dominates—mirrors real buyer trust dynamics.

## Tech Stack
- Frontend: Vanilla HTML/CSS/JS, Chart.js for quick BI visuals.
- Backend: Vercel serverless function (`/api/calculate`) using ES modules.
- Data: Simple JSON seeds for products and countries.
- Hosting: Drop the repo into Vercel; no build step required.

## What This Project Demonstrates Professionally
- Business framing: Defines friction in operational vs relational terms; explains thresholds and weights.
- Risk modeling: Scenario multipliers, tariff sensitivity, and confidence decay tied to friction dominance.
- Decision support: Outputs one clear tip paragraph plus a confidence score with plain-language tiers.
- Pragmatic delivery: Minimal stack, serverless API, and portable static frontend—ready for Vercel.
- Communication: Inline comments and UI copy explain why each lever exists, not just how it works.

## Future Enhancements
- Add multiple EU markets and product SKUs; compare portfolios side-by-side.
- Persist scenarios for sharing; export PDF with branded layout.
- Enrich with real tariff datasets and logistics benchmarks; add sensitivity tornado charts.
- Introduce authentication if moved beyond single-user scope.

