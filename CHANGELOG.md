# Changelog

## [Unreleased]

### Added
- Dashboard views generated from the integration's snapshot (dashboard API version 1): Overview, Shopping list, Essentials, Zones, Proposals, Inventory, Expiry and History, in sections views for phone and tablet. Entity ids come from the snapshot. Clear messages when the integration is missing, not set up, too old or on another API version.
- Custom cards with visual editor and sections grid options: Suggestions (readable reasons, one-tap add), Essentials (edit minimum and target, add and remove), Proposals (confirm all or some, correct, reject), Inventory (plus and minus, set quantity, new product), History (undo an operation), Zone, and Photo upload (EXIF orientation, 1280 px, JPEG 80, metadata removed, 2 MB limit, Android note).
- Cards share one live `quartermaster/subscribe` subscription and hide write controls from users who may not write.
- English and Italian strings for every view, card, reason and error.
- Project skeleton: dashboard strategy registered for the "New dashboard" dialog, with a localized placeholder view (English, Italian) and a message when the integration is missing; TypeScript, Lit, Rollup, ESLint and Web Test Runner; CI for lint, tests, build with a dist check, Marketplace validation and release.
