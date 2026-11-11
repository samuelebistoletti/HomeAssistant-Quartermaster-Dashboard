import {
  DOMAIN,
  type HassConnection,
  type HomeAssistant,
  type ImageData,
  type Snapshot,
  type Unsubscribe,
} from "./types";

export type SnapshotListener = (snapshot: Snapshot | undefined, error?: unknown) => void;

interface Shared {
  listeners: Set<SnapshotListener>;
  snapshot?: Snapshot;
  error?: unknown;
  unsubscribe?: Promise<Unsubscribe | undefined>;
  /** Failed attempts in a row, and the timer of the next one. */
  attempts: number;
  retry?: ReturnType<typeof setTimeout>;
}

const shared = new WeakMap<HassConnection, Shared>();

/** Waits before trying again after a failed subscription; the last one repeats. */
export const RETRY_DELAYS_MS = [2000, 5000, 15000, 30000];

function open(connection: HassConnection, entry: Shared): void {
  entry.unsubscribe = connection
    .subscribeMessage<Snapshot>(
      (snapshot) => {
        entry.snapshot = snapshot;
        entry.error = undefined;
        entry.attempts = 0;
        entry.listeners.forEach((l) => l(snapshot));
      },
      { type: `${DOMAIN}/subscribe` },
    )
    .catch((err: unknown) => {
      entry.error = err;
      entry.listeners.forEach((l) => l(undefined, err));
      // The integration may be reloading or not set up yet: try again while
      // a card is still listening.
      if (shared.get(connection) === entry && entry.listeners.size) {
        const delay = RETRY_DELAYS_MS[Math.min(entry.attempts, RETRY_DELAYS_MS.length - 1)];
        entry.attempts += 1;
        entry.retry = setTimeout(() => {
          entry.retry = undefined;
          open(connection, entry);
        }, delay);
      }
      return undefined;
    });
}

/**
 * Subscribe to `quartermaster/subscribe` on a connection. All cards on the
 * page share one websocket subscription per connection; it is closed when the
 * last card unsubscribes (cards do this when they are disconnected). A failed
 * subscription is reported to the cards and tried again.
 */
export function subscribeSnapshot(
  connection: HassConnection,
  listener: SnapshotListener,
): () => void {
  let entry = shared.get(connection);
  if (!entry) {
    entry = { listeners: new Set(), attempts: 0 };
    shared.set(connection, entry);
    entry.listeners.add(listener);
    open(connection, entry);
  } else {
    entry.listeners.add(listener);
  }
  const current = entry;
  if (current.snapshot || current.error) {
    listener(current.snapshot, current.error);
  }
  return () => {
    if (!current.listeners.delete(listener) || current.listeners.size) {
      return;
    }
    if (shared.get(connection) === current) {
      shared.delete(connection);
    }
    if (current.retry !== undefined) {
      clearTimeout(current.retry);
      current.retry = undefined;
    }
    void current.unsubscribe
      ?.then((unsub) => unsub?.())
      .catch(() => undefined);
  };
}

/**
 * Fetch a stored crop with `quartermaster/image` as a data URL, or
 * `undefined` when there is none (`not_found`) or it cannot be read.
 */
export async function fetchImage(
  hass: Pick<HomeAssistant, "callWS">,
  target: { zone_id: string } | { proposal_id: number },
): Promise<string | undefined> {
  try {
    const image = await hass.callWS<ImageData>({ type: `${DOMAIN}/image`, ...target });
    if (!image?.data) {
      return undefined;
    }
    return `data:${image.content_type || "image/jpeg"};base64,${image.data}`;
  } catch {
    return undefined;
  }
}
