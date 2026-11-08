<p align="center">
  <img src="https://raw.githubusercontent.com/samuelebistoletti/HomeAssistant-Quartermaster/main/custom_components/quartermaster/brand/logo.png" alt="Quartermaster" width="460">
</p>

# Quartermaster Dashboard

Dashboard strategy and cards for the [Quartermaster](https://github.com/samuelebistoletti/HomeAssistant-Quartermaster) integration: inventory by zone, essentials, shopping list with suggestions, proposals to confirm and photo upload. Built for phones first, and works on tablets and desktop, in light and dark themes.

> [!WARNING]
> Under development and not usable yet. There is no release; the first one will be 1.0.0.

## Contents

- [How it works](#how-it-works)
- [Requirements](#requirements)
- [Installation](#installation)
- [Views](#views)
- [Cards](#cards)
- [Permissions](#permissions)
- [Languages and themes](#languages-and-themes)
- [Privacy](#privacy)
- [Troubleshooting](#troubleshooting)
- [Compatibility](#compatibility)
- [Development](#development)

## How it works

- One JavaScript file holds a **dashboard strategy** and eight **custom cards**. The strategy builds the whole dashboard from the integration's live data, so there is no YAML to write; the cards can also be used on their own.
- Data comes from the integration's entities and its websocket commands (the dashboard API, version 1). Changes go through the integration's actions, so they follow the same permissions and end up in the same journal.
- Nothing is stored in the browser beyond Home Assistant's own state.

## Requirements

- Home Assistant 2026.11.0, the latest release. Older releases are not supported.
- The [Quartermaster](https://github.com/samuelebistoletti/HomeAssistant-Quartermaster) integration, set up, with dashboard API version 1. Without it, or with an integration that is not set up or too old, the dashboard shows a message saying what to do.

## Installation

### Marketplace

Once 1.0.0 is released, install **Quartermaster Dashboard** from the Marketplace (**Settings** → **Marketplace**). Until it is in the default catalog, add `https://github.com/samuelebistoletti/HomeAssistant-Quartermaster-Dashboard` there as a custom repository of type **Dashboard**. The Marketplace adds the file as a dashboard resource.

Then go to **Settings** → **Dashboards** → **Add dashboard** and pick **Quartermaster** under the community dashboards.

### Dashboards in YAML mode

If your dashboards are in YAML mode, the Marketplace cannot add the resource. Add it yourself:

```yaml
lovelace:
  resources:
    - url: /local/community/HomeAssistant-Quartermaster-Dashboard/quartermaster-dashboard.js
      type: module
```

and create the dashboard with the strategy:

```yaml
strategy:
  type: custom:quartermaster
```

### Manual

Download `quartermaster-dashboard.js` from a release, copy it to `<config>/www/`, and add `/local/quartermaster-dashboard.js` as a resource of type **JavaScript module** (**Settings** → **Dashboards** → **⋮** → **Resources**).

## Views

The dashboard uses sections views: one column on a phone, more columns on a tablet or desktop.

| View | Content |
| --- | --- |
| Overview | Tiles for to buy, suggested, expiring, photo requests and proposals to confirm (a tap opens the matching view), AI analyses today against the daily limit (a count of analyses: the integration has no cost data), and the **Go shopping** button. |
| Shopping list | The integration's to-do list (native card) and the **Suggestions** card: each suggestion with its reason ("you have 1, you usually keep 4", "at your usual pace it runs out within 3 days") and a one-tap add. |
| Essentials | Present, minimum, target and status of each essential; edit minimum and target, add and remove essentials. |
| Zones | One section per zone: last check with status and confidence, the last image analyzed, show mode state, the products in it, **Check now**, **Arm show mode** (zones with a show to camera source) and the photo upload card. Writers also get **Zone management**. |
| Proposals | Changes recognized from photos (quantity before and after) and purchases from receipts (quantity bought), with the image sent to the AI when there is one: confirm all or some, correct product and quantity, reject. |
| Inventory | Products by zone with plus and minus, set quantity, new product. |
| Expiry | Native calendar of best-before dates. |
| History | Latest movements with their channel; undo an operation. |

The views are rebuilt when the dashboard loads and when Home Assistant's entity registry changes; the cards update live. After adding or deleting a zone, reload the dashboard to update its sections.

## Cards

The cards can also be added to any dashboard from the card picker (search "Quartermaster"). Each has a visual editor.

| Card | Type | Options |
| --- | --- | --- |
| Suggestions | `custom:quartermaster-suggestions-card` | `title` |
| Essentials | `custom:quartermaster-essentials-card` | `title` |
| Proposals | `custom:quartermaster-proposals-card` | `title` |
| Inventory | `custom:quartermaster-inventory-card` | `title`, `zone` (zone id; all zones when omitted) |
| History | `custom:quartermaster-history-card` | `title`, `limit` (1–500, default 50) |
| Zone | `custom:quartermaster-zone-card` | `zone` (required), `title` |
| Photo upload | `custom:quartermaster-photo-card` | `title`, `zone` (preselected zone) |
| Zone management | `custom:quartermaster-zones-card` | `title` |

Example:

```yaml
type: vertical-stack
cards:
  - type: custom:quartermaster-zone-card
    zone: fridge
  - type: custom:quartermaster-photo-card
    zone: fridge
  - type: custom:quartermaster-history-card
    limit: 20
```

### Photo upload

Choose **A zone** or **A receipt**: a receipt needs no zone and becomes a purchase proposal to confirm in **Proposals**. The card offers the camera where the browser or app allows it, and the gallery otherwise. The result (changes recorded or to confirm in **Proposals**) shows under the button.

> [!NOTE]
> In the Home Assistant Android app the file field opens only the gallery, not the camera ([home-assistant/android#6055](https://github.com/home-assistant/android/issues/6055)). Take the photo with the camera app first, or send it to the Quartermaster Telegram bot, which is the quickest way from a phone.

### Zone management

Writers can add a zone (name and other names), delete one (after a confirmation), and edit its name, other names, check schedule (cron), reminder days, confidence threshold and the ordered list of sources (camera, show to camera, passage camera, manual) with the fields of each type. Entity fields suggest the matching entities. Before a show to camera or passage source is added, the card shows a privacy notice (frames can show people; only the set area goes to the AI provider; frames are deleted right after the analysis) and needs an explicit acknowledgement. Settings that an older integration does not report are not shown.

## Permissions

Everyone who can open the dashboard can read it. Changes need an administrator or a user chosen in the integration's **Configure → Permissions** (`write_users`). Other users see the same data without the write controls.

## Languages and themes

The dashboard follows the language of each Home Assistant user: English and Italian, English for other languages. Colours come from the Home Assistant theme, light and dark included, and controls are sized for touch.

## Privacy

Before a photo is sent, the browser turns it upright, resizes it to 1280 px on the long side and re-encodes it as JPEG (quality 80), which also removes its metadata, location included. Photos still over 2 MB are refused. The images shown in **Zones** and **Proposals** are the crops the integration keeps for that purpose; they are read through an authenticated websocket command, never from a public URL.

## Troubleshooting

| Message or problem | What to do |
| --- | --- |
| "The Quartermaster integration is not installed" | Install the integration, then reload the dashboard. |
| "Installed but not set up or not running" | Add Quartermaster under **Settings** → **Devices & services**, or check its logs, then reload. |
| "Too old for this dashboard" or "does not support the Quartermaster API version" | Update the dashboard and the integration together (see [Compatibility](#compatibility)). |
| **Quartermaster** is missing from **Add dashboard** or the card picker | Check that the resource is loaded (**Settings** → **Dashboards** → **⋮** → **Resources**), then clear the browser or app cache. |
| A new zone has no section | Reload the dashboard. |
| No write controls | Your user is not allowed to change data; see [Permissions](#permissions). |

## Compatibility

| Quartermaster Dashboard | Quartermaster | Home Assistant |
| --- | --- | --- |
| unreleased | unreleased (dashboard API 1) | 2026.11.0 |

The dashboard talks to the integration through its dashboard API, version 1, described in the integration's [docs/dashboard-api.md](https://github.com/samuelebistoletti/HomeAssistant-Quartermaster/blob/main/docs/dashboard-api.md). Release both together.

## Development

### Prerequisites

Node.js 26 (`.nvmrc`), and Chrome or Chromium for the tests.

### Commands

```bash
npm ci
npm run lint     # ESLint and type check with tsc (TypeScript 7)
npm test         # Web Test Runner in Chrome
npm run build    # Rollup -> dist/quartermaster-dashboard.js (commit it)
npm run watch    # rebuild on every change
```

`dist/` is committed: it is the Marketplace file and the release asset, and CI fails when it does not match the sources.

TypeScript 7 ships no compiler API yet. As its announcement recommends, `tsc` is TypeScript 7.0 (`@typescript/native`), while ESLint and the Rollup plugin use the 6.0 API through `typescript` aliased to `@typescript/typescript6`.

### Layout

| Path | Content |
| --- | --- |
| `src/quartermaster-dashboard.ts` | Entry point: registers the strategy and the cards |
| `src/strategy.ts` | The dashboard strategy |
| `src/cards/` | The cards, one file each, with `base.ts` for shared behaviour |
| `src/data.ts`, `src/types.ts` | Websocket commands and dashboard API types |
| `src/image.ts` | Photo resizing and re-encoding in the browser |
| `src/sources.ts` | Zone source fields for the zone editor |
| `src/localize.ts`, `src/translations/` | Texts in English and Italian |
| `tests/` | Web Test Runner tests with fixtures |

### Trying it with Home Assistant

Clone this repository next to [HomeAssistant-Quartermaster](https://github.com/samuelebistoletti/HomeAssistant-Quartermaster). Its development Home Assistant (Docker) loads `dist/` from here: run `npm run build` and reload the browser. Setup, including on another computer, is in its [CONTRIBUTING.md](https://github.com/samuelebistoletti/HomeAssistant-Quartermaster/blob/main/CONTRIBUTING.md).

### Releases

Bumping `version` in `package.json` on `main` runs the release workflow: lint, tests, build and the `dist/` check, then the tag and a GitHub release with `dist/quartermaster-dashboard.js`.

## License

[MIT](LICENSE)
