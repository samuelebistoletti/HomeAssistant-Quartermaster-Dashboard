<p align="center">
  <img src="https://raw.githubusercontent.com/samuelebistoletti/HomeAssistant-Quartermaster/main/custom_components/quartermaster/brand/logo.png" alt="Quartermaster" width="460">
</p>

# Quartermaster Dashboard

Dashboard strategy and cards for the [Quartermaster](https://github.com/samuelebistoletti/HomeAssistant-Quartermaster) integration: inventory by zone, essentials, shopping list with suggestions, proposals to confirm and photo upload. Built for phones first, and works on tablets and desktop, in light and dark themes.

> [!WARNING]
> Under development and not usable yet. There is no release; the first one will be 1.0.0.

## Requirements

- Home Assistant 2026.11.0 or later.
- The [Quartermaster](https://github.com/samuelebistoletti/HomeAssistant-Quartermaster) integration. Without it the dashboard shows a message asking you to install it.

## Installation

Once 1.0.0 is released: install **Quartermaster Dashboard** from the Marketplace (**Settings** → **Marketplace**), which adds it as a dashboard resource. Then go to **Settings** → **Dashboards** → **Add dashboard** and pick **Quartermaster** under the community dashboards.

If your dashboards are in YAML mode, the Marketplace cannot add the resource automatically: add `/local/community/HomeAssistant-Quartermaster-Dashboard/quartermaster-dashboard.js` as a resource of type `module` yourself.

## Compatibility

| Quartermaster Dashboard | Quartermaster | Home Assistant |
| --- | --- | --- |
| unreleased | unreleased | 2026.11.0+ |

## Development

```bash
npm ci
npm run lint     # ESLint + TypeScript
npm test         # Web Test Runner (Chrome)
npm run build    # Rollup -> dist/quartermaster-dashboard.js (commit it)
```

The integration repository's dev Home Assistant loads `dist/` from this repository when both are cloned side by side. See its `CONTRIBUTING.md`.

## License

[MIT](LICENSE)
