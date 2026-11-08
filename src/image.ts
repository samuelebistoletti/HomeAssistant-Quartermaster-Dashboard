/**
 * Browser-side photo preparation (spec §6.5): EXIF orientation applied,
 * long side at most 1280 px, JPEG quality 0.8 through a canvas (which drops
 * all metadata), at most 2 MB after encoding.
 */

export const MAX_SIDE = 1280;
export const JPEG_QUALITY = 0.8;
export const MAX_BYTES = 2 * 1024 * 1024;

export class ImageTooLargeError extends Error {
  constructor(readonly bytes: number) {
    super(`Image is ${bytes} bytes after encoding`);
    this.name = "ImageTooLargeError";
  }
}

export class ImageUnreadableError extends Error {
  constructor(cause?: unknown) {
    super("The file cannot be decoded as an image", { cause });
    this.name = "ImageUnreadableError";
  }
}

/** Size that fits `maxSide` on the long side, keeping the aspect ratio; never upscales. */
export function fitSize(
  width: number,
  height: number,
  maxSide: number = MAX_SIDE,
): { width: number; height: number } {
  const longSide = Math.max(width, height);
  if (longSide <= maxSide) {
    return { width, height };
  }
  const scale = maxSide / longSide;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** Base64 (without the data URL prefix) of some bytes. */
export function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new ImageUnreadableError())),
      "image/jpeg",
      quality,
    );
  });
}

export interface PreparedImage {
  base64: string;
  bytes: number;
  width: number;
  height: number;
}

/**
 * Decode, orient, resize and re-encode an image file as JPEG.
 * Throws ImageUnreadableError or ImageTooLargeError.
 */
export async function prepareImage(
  file: Blob,
  options: { maxSide?: number; quality?: number; maxBytes?: number } = {},
): Promise<PreparedImage> {
  const maxSide = options.maxSide ?? MAX_SIDE;
  const quality = options.quality ?? JPEG_QUALITY;
  const maxBytes = options.maxBytes ?? MAX_BYTES;
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch (err) {
    throw new ImageUnreadableError(err);
  }
  try {
    const { width, height } = fitSize(bitmap.width, bitmap.height, maxSide);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new ImageUnreadableError();
    }
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, width, height);
    const blob = await canvasToJpeg(canvas, quality);
    if (blob.size > maxBytes) {
      throw new ImageTooLargeError(blob.size);
    }
    const bytes = new Uint8Array(await blob.arrayBuffer());
    return { base64: toBase64(bytes), bytes: blob.size, width, height };
  } finally {
    bitmap.close();
  }
}
