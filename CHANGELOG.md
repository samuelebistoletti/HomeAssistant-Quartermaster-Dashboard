# Changelog

## [Unreleased]

### Added
- Dashboard views generated from the integration's snapshot (dashboard API version 1): Overview, Shopping list, Essentials, Zones, Proposals, Inventory, Expiry and History, in sections views for phone and tablet. Entity ids come from the snapshot. Clear messages when the integration is missing, not set up, too old or on another API version.
- Custom cards with visual editor and sections grid options: Suggestions (readable reasons, one-tap add), Essentials (edit minimum and target, add and remove), Proposals (confirm all or some, correct, reject), Inventory (plus and minus, set quantity, new product), History (undo an operation), Zone, and Photo upload (EXIF orientation, 1280 px, JPEG 80, metadata removed, 2 MB limit, Android note).
- Cards share one live `quartermaster/subscribe` subscription and hide write controls from users who may not write.
- Zone card: last check with status and confidence, the last crop (`quartermaster/image`), photo requests, show mode state and last shown product; **Check now** and **Arm show mode** for writers.
- Zone management card (in the Zones view for writers): add, delete with confirmation, and edit zones with their ordered sources and per-type fields; privacy notice and acknowledgement before a camera_show or passage source.
- Proposals: crops when available and purchase proposals (quantity bought). Photo upload: receipts (`kind: "receipt"`).
- Overview: photo requests tile and AI analyses tile (today against the daily limit). Suggestion reason `running_out`.
- Cards degrade gracefully when the integration does not send the newer snapshot fields.
- English and Italian strings for every view, card, reason and error.
- Project skeleton: dashboard strategy registered for the "New dashboard" dialog, with a localized placeholder view (English, Italian) and a message when the integration is missing; TypeScript, Lit, Rollup, ESLint and Web Test Runner; CI for lint, tests, build with a dist check, Marketplace validation and release.

### Added
- Inventory card: product editor. The edit button of a row sets the quantity and the best-before date, changes the product's name, other names, category, unit, default zone and shelf life (an emptied field clears it), moves stock to another zone (all or part) and archives the product after a second tap. Archived products are listed with **Bring back**; products without stock show in their default zone, or under "No zone". History labels moves and archiving. Needs the integration's `update_product`, `archive_product` and `move_stock`.

### Changed
- Proposals card: camera requests. A product a camera saw taken shows the quantity and what would be left, with **Confirm** (another quantity taken through **Correct**) and **Reject**; one put back asks to undo the take; a sighting the camera could not make out offers only **Reject**. Doubtful sightings that wait without a message are visible here. Needs the integration's `moved` correction.
- Proposals card: an unknown item can be corrected as **➕ New product**, named as read or with another name, and with its zone for a receipt; the integration creates it and applies the quantity. Unknown items left alone stay waiting after a confirm instead of vanishing (needs the integration with the `new_product` correction).
- Proposals card: products not seen (rows with `missing`) are marked and start unticked; **Confirm what was seen** leaves them out, and ticking one sets it to zero.
- Zone editor: source type "List check" (`ledger`) with the days between checks; the camera_show `confirm` field is gone (cameras always ask); check status "list sent".

### Fixed
- A refused subscription (integration reloading or not set up yet) is tried again while a card is open, instead of leaving the error on screen until the page reloads.
- The door camera delay field accepts the same range as the integration (0 to 120 seconds).
