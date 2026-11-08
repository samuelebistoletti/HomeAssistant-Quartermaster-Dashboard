import { expect } from "@open-wc/testing";

import {
  fitSize,
  ImageTooLargeError,
  ImageUnreadableError,
  prepareImage,
  toBase64,
} from "../src/image";
import { must } from "./fixtures";

function pngBlob(width: number, height: number): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = must(canvas.getContext("2d"));
  // Any pixels will do; the test never shows them.
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "black");
  gradient.addColorStop(1, "white");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(must(b)), "image/png"));
}

function decode(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

describe("fitSize", () => {
  it("scales the long side down to the limit", () => {
    expect(fitSize(4032, 3024)).to.deep.equal({ width: 1280, height: 960 });
    expect(fitSize(3024, 4032)).to.deep.equal({ width: 960, height: 1280 });
  });

  it("never upscales", () => {
    expect(fitSize(800, 600)).to.deep.equal({ width: 800, height: 600 });
    expect(fitSize(1280, 10)).to.deep.equal({ width: 1280, height: 10 });
  });

  it("keeps at least one pixel", () => {
    expect(fitSize(10000, 1, 100)).to.deep.equal({ width: 100, height: 1 });
  });
});

describe("toBase64", () => {
  it("encodes bytes, including large buffers", () => {
    expect(toBase64(new Uint8Array([0, 1, 2, 255]))).to.equal("AAEC/w==");
    const big = new Uint8Array(100000).map((_, i) => i % 256);
    expect(decode(toBase64(big))).to.deep.equal(big);
  });
});

describe("prepareImage", () => {
  it("resizes and re-encodes as JPEG", async () => {
    const result = await prepareImage(await pngBlob(2000, 1000));
    expect(result.width).to.equal(1280);
    expect(result.height).to.equal(640);
    const bytes = decode(result.base64);
    expect(bytes.length).to.equal(result.bytes);
    // JPEG start-of-image marker.
    expect([bytes[0], bytes[1]]).to.deep.equal([0xff, 0xd8]);
  });

  it("keeps small images at their size", async () => {
    const result = await prepareImage(await pngBlob(300, 200));
    expect([result.width, result.height]).to.deep.equal([300, 200]);
  });

  it("refuses an image over the size limit after encoding", async () => {
    let error: unknown;
    try {
      await prepareImage(await pngBlob(400, 400), { maxBytes: 10 });
    } catch (err) {
      error = err;
    }
    expect(error).to.be.instanceOf(ImageTooLargeError);
  });

  it("reports a file that is not an image", async () => {
    let error: unknown;
    try {
      await prepareImage(new Blob(["not an image"], { type: "text/plain" }));
    } catch (err) {
      error = err;
    }
    expect(error).to.be.instanceOf(ImageUnreadableError);
  });
});
