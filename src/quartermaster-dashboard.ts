import "./cards/essentials-card";
import "./cards/history-card";
import "./cards/inventory-card";
import "./cards/photo-card";
import "./cards/proposals-card";
import "./cards/suggestions-card";
import "./cards/zone-card";
import "./cards/zones-card";

import { stringsFor } from "./localize";
import { QuartermasterDashboardStrategy, STRATEGY_TYPE } from "./strategy";

interface CustomStrategy {
  type: string;
  strategyType: "dashboard" | "section";
  name: string;
  description: string;
  documentationURL?: string;
}

declare global {
  interface Window {
    customStrategies?: CustomStrategy[];
  }
}

const ELEMENT = `ll-strategy-dashboard-${STRATEGY_TYPE}`;

if (!customElements.get(ELEMENT)) {
  customElements.define(ELEMENT, QuartermasterDashboardStrategy);

  // The dialog strings cannot follow the user language reliably: the
  // registration runs before `hass` exists, so the page language is used.
  const strings = stringsFor(document.documentElement.lang || navigator.language);
  window.customStrategies = window.customStrategies ?? [];
  window.customStrategies.push({
    type: STRATEGY_TYPE,
    strategyType: "dashboard",
    name: strings.strategy_name,
    description: strings.strategy_description,
    documentationURL:
      "https://github.com/samuelebistoletti/HomeAssistant-Quartermaster-Dashboard",
  });
}
