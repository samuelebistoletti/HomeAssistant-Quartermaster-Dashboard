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
}

const shared = new WeakMap<HassConnection, Shared>();

/**
 * Subscribe to `quartermaster/subscribe` on a connection. All cards on the
 * page share one websocket subscription per connection; it is closed when the
 * last card unsubscribes (cards do this when they are disconnected).
 */
export function subscribeSnapshot(
  connection: HassConnection,
  listener: SnapshotListener,
): () => void {
  let entry = shared.get(connection);
  if (!entry) {
    const created: Shared = { listeners: new Set() };
    entry = created;
    shared.set(connection, created);
    created.unsubscribe = connection
      .subscribeMessage<Snapshot>(
        (snapshot) => {
          created.snapshot = snapshot;
          created.error = undefined;
          created.listeners.forEach((l) => l(snapshot));
        },
        { type: `${DOMAIN}/subscribe` },
      )
      .catch((err: unknown) => {
        created.error = err;
        created.listeners.forEach((l) => l(undefined, err));
        if (shared.get(connection) === created) {
          shared.delete(connection);
        }
        return undefined;
      });
  }
  const current = entry;
  current.listeners.add(listener);
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
