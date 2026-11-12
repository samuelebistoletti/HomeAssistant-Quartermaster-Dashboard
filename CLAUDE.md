# Quartermaster Dashboard

Dashboard strategy and custom cards (TypeScript + Lit) for the Quartermaster Home Assistant integration, distributed from the Marketplace as a dashboard (`plugin` category). The binding specification, decisions and working memory live in the integration repository (`HomeAssistant-Quartermaster`): `docs/SPEC.md`, `TECHNICAL_NOTES.md`, `docs/dev/MEMORY.md`. Read them first.

This file is shared with every contributor and agent. Keep it short, factual and free of personal or machine-specific content.

## Commands

```bash
npm ci
npm run lint      # ESLint (typescript-eslint strict) + tsc --noEmit
npm test          # Web Test Runner in Chrome
npm run build     # Rollup -> dist/quartermaster-dashboard.js, committed
```

## Layout

- `src/quartermaster-dashboard.ts`: entry point; registers the strategy, the cards, `window.customStrategies` and `window.customCards`.
- `src/strategy.ts`: `generate(config, hass)` builds the views from `quartermaster/snapshot`.
- `src/cards/`: Lit custom cards (`base.ts` holds the shared subscription, actions and styles); `src/data.ts`: shared `quartermaster/subscribe` and `quartermaster/image`; `src/image.ts`: photo resizing; `src/sources.ts`: zone source fields for the zone editor.
- `src/types.ts`: the integration's dashboard API (contract in the integration's `docs/dashboard-api.md`).
- `src/localize.ts` and `src/translations/`: user-facing strings, plurals, dates and suggestion reasons.
- `tests/`: Web Test Runner tests. `dist/`: the built bundle (release asset and Marketplace file).

## Rules

- Follow the official Home Assistant frontend docs (contributors.home-assistant.io/frontend/), not memory; read only documented `hass` properties.
- Every user-facing string goes through `src/translations/` (at least English and Italian).
- Theme colours only from Home Assistant CSS variables; touch-sized controls; phone-first sections view.
- Writes go through the integration's actions; reads through its entities and websocket commands.
- `dist/` must match the sources: run `npm run build` and commit it.
- Dependencies are pinned with the lockfile; no runtime dependency beyond Lit without asking.
- Always the latest stable version of everything (npm packages, Node, GitHub Actions, Home Assistant). Adopt new majors instead of pinning back; TypeScript 7 runs `tsc` while tools that need the compiler API use `@typescript/typescript6`, as the TypeScript 7.0 announcement recommends.
- After every push wait for all GitHub Actions runs of the commit and fix any failure at once.

## Release

Bumping `version` in `package.json` on `main` runs `release.yaml`: lint, tests, build and dist check, then the tag `v<version>` and a GitHub release with `dist/quartermaster-dashboard.js`. `0.0.0` is never published. Release in pairs with the integration and update the compatibility table in both READMEs. Never bump the version unless the author asks.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` and `docs/adr/` at the repo root (created when needed), plus the integration repository's spec and decisions. See `docs/agents/domain.md`.
