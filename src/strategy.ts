import { stringsFor } from "./localize";

/** Integration domain whose presence the dashboard requires. */
export const INTEGRATION_DOMAIN = "quartermaster";

/** Strategy type, as used in `strategy: { type: custom:quartermaster }`. */
export const STRATEGY_TYPE = "quartermaster";

/** The documented parts of the `hass` object this strategy reads. */
export interface HassLike {
  language: string;
  config: { components: string[] };
}

export interface StrategyConfig {
  title?: string;
}

export interface DashboardConfig {
  title: string;
  views: {
    title: string;
    path: string;
    type: "sections";
    sections: { type: "grid"; cards: Record<string, unknown>[] }[];
  }[];
}

export class QuartermasterDashboardStrategy extends HTMLElement {
  static async generate(
    config: StrategyConfig,
    hass: HassLike,
  ): Promise<DashboardConfig> {
    const strings = stringsFor(hass.language);
    const installed = hass.config.components.includes(INTEGRATION_DOMAIN);
    return {
      title: config.title ?? strings.title,
      views: [
        {
          title: strings.title,
          path: "overview",
          type: "sections",
          sections: [
            {
              type: "grid",
              cards: [
                {
                  type: "markdown",
                  content: installed
                    ? strings.under_development
                    : strings.missing_integration,
                },
              ],
            },
          ],
        },
      ],
    };
  }
}
