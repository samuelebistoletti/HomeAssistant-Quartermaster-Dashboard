# Quartermaster Dashboard

Dashboard strategy and custom cards (TypeScript + Lit) for the Quartermaster Home Assistant integration, distributed from the Marketplace as a dashboard (`plugin` category).

This file is shared with every contributor and agent. Keep it short, factual and free of personal or machine-specific content.

## Where to read

Specification, decisions and working memory live in the integration repository (`HomeAssistant-Quartermaster`, cloned side by side):

- `docs/dev/MEMORY.md`: where the work stands. Read it at the start of every session.
- `docs/dashboard-api.md`: the websocket and snapshot contract that `src/types.ts` mirrors. Read it before touching data, types or actions.
- `docs/SPEC.md` (§6.5 dashboard) and `TECHNICAL_NOTES.md`: behaviour and decisions. Read the topic before changing a view or a card's behaviour.
- GitHub issues in both repositories: open work.

## Commands

```bash
npm ci            # also enables the pre-commit hook (lint, type check, dist check)
npm run lint      # ESLint (typescript-eslint strict) + tsc --noEmit
npm test          # Web Test Runner in Chrome
npm run build     # Rollup -> dist/quartermaster-dashboard.js, committed
npm run contract  # tests/contract.generated.ts from the integration's sample snapshot
```

Try a change in a real Home Assistant on the integration's dev instance: it loads this repository's `dist/` (see its `CONTRIBUTING.md`); build, then reload the browser.

## Layout

- `src/quartermaster-dashboard.ts`: entry point; registers the strategy, the cards, `window.customStrategies` and `window.customCards`.
- `src/strategy.ts`: `generate(config, hass)` builds the views from `quartermaster/snapshot`.
- `src/cards/`: Lit custom cards (`base.ts` holds the shared subscription, actions and styles); `src/data.ts`: shared `quartermaster/subscribe` and `quartermaster/image`; `src/image.ts`: photo resizing; `src/sources.ts`: zone source fields for the zone editor.
- `src/types.ts`: the integration's dashboard API.
- `src/localize.ts` and `src/translations/`: user-facing strings, plurals, dates and suggestion reasons.
- `tests/`: Web Test Runner tests. `dist/`: the built bundle (release asset and Marketplace file).

## Rules

- Follow the official Home Assistant frontend docs (contributors.home-assistant.io/frontend/), not memory; read only documented `hass` properties.
- Every user-facing string goes through `src/translations/` (at least English and Italian).
- Theme colours only from Home Assistant CSS variables; touch-sized controls; phone-first sections view.
- Writes go through the integration's actions; reads through its entities and websocket commands. A contract change starts in the integration's `docs/dashboard-api.md`; snapshot fields are additive and cards degrade when they are missing.
- Changes come with tests; tests and fixtures use invented data only.
- `dist/` matches the sources: the pre-commit hook rebuilds it and stops the commit until the rebuilt `dist/` is staged.
- Runtime dependencies: Lit only; ask the author before adding another. Versions are pinned with the lockfile.
- Use the latest stable version of everything (npm packages, Node, GitHub Actions, Home Assistant) and adopt new majors. TypeScript 7 (`@typescript/native`) provides `tsc`; tools that need the compiler API use `@typescript/typescript6` under the `typescript` name, as the TypeScript 7.0 announcement recommends.
- Code, comments, commits and docs in English. Every user-visible change goes into `CHANGELOG.md` under `[Unreleased]`.
- Commit and push directly on `main`.
- After every push, run one `gh run list` for the commit; while runs are still going, watch them in the background and keep working, then report the result and fix any failure at once.

## Working with people

- Reply in the language the person writes in; code, commits and docs stay in English.
- When someone must act by hand (the Home Assistant UI, the Marketplace, a terminal), give numbered click-by-click steps: exact menu paths, field names, values and commands in code blocks, and what they should see at the end. Check the outcome yourself instead of asking what happened.

## Release

Bumping `version` in `package.json` on `main` runs `release.yaml`: lint, tests, build and dist check, then the tag `v<version>` and a GitHub release with `dist/quartermaster-dashboard.js`. `0.0.0` is never published. Release in pairs with the integration and update the compatibility table in both READMEs. Bump the version only when the author asks.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` and `docs/adr/` at the repo root (created when needed), plus the integration repository's spec and decisions. See `docs/agents/domain.md`.
