import { expect } from "@open-wc/testing";

import { RETRY_DELAYS_MS, subscribeSnapshot } from "../src/data";
import type { HassConnection, Snapshot } from "../src/types";
import { sampleSnapshot } from "./fixtures";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** A connection whose first `failures` subscriptions are refused. */
function flakyConnection(failures: number) {
  const state = { attempts: 0, unsubscribed: 0 };
  const connection = {
    async subscribeMessage<T>(callback: (message: T) => void) {
      state.attempts += 1;
      if (state.attempts <= failures) {
        throw { code: "not_loaded", message: "x" };
      }
      setTimeout(() => callback(sampleSnapshot() as unknown as T), 0);
      return () => {
        state.unsubscribed += 1;
      };
    },
  } as unknown as HassConnection;
  return { connection, state };
}

describe("subscribeSnapshot", () => {
  const delays = [...RETRY_DELAYS_MS];

  beforeEach(() => {
    RETRY_DELAYS_MS.fill(10);
  });

  afterEach(() => {
    RETRY_DELAYS_MS.splice(0, RETRY_DELAYS_MS.length, ...delays);
  });

  it("tries again after a refused subscription", async () => {
    const { connection, state } = flakyConnection(2);
    const seen: Array<[Snapshot | undefined, unknown]> = [];
    const unsubscribe = subscribeSnapshot(connection, (snapshot, error) => seen.push([snapshot, error]));
    await wait(100);
    expect(state.attempts).to.equal(3);
    expect(seen.slice(0, 2).every(([snapshot, error]) => !snapshot && !!error)).to.equal(true);
    const [snapshot, error] = seen[seen.length - 1];
    expect(snapshot?.api_version).to.equal(1);
    expect(error).to.equal(undefined);
    unsubscribe();
    await wait(10);
    expect(state.unsubscribed).to.equal(1);
  });

  it("stops trying when the last card leaves", async () => {
    const { connection, state } = flakyConnection(100);
    const unsubscribe = subscribeSnapshot(connection, () => undefined);
    await wait(5);
    unsubscribe();
    const attempts = state.attempts;
    await wait(60);
    expect(state.attempts).to.equal(attempts);
  });
});
