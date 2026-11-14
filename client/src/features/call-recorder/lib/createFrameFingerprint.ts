import {
  FRAME_FINGERPRINT_HEIGHT,
  FRAME_FINGERPRINT_WIDTH,
} from '../config/callRecorderConfig';

const toGray = (rgba: Uint8ClampedArray) =>
  Uint8Array.from({ length: rgba.length / 4 }, (_, index) => {
    const offset = index * 4;
    return Math.round(
      (rgba[offset] + rgba[offset + 1] + rgba[offset + 2]) / 3,
    );
  });

export const createFrameFingerprint = async (image: Blob) => {
  const bitmap = await createImageBitmap(image);
  const canvas = new OffscreenCanvas(
    FRAME_FINGERPRINT_WIDTH,
    FRAME_FINGERPRINT_HEIGHT,
  );
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.drawImage(
    bitmap,
    0,
    0,
    FRAME_FINGERPRINT_WIDTH,
    FRAME_FINGERPRINT_HEIGHT,
  );
  bitmap.close();
  const { data } = context.getImageData(
    0,
    0,
    FRAME_FINGERPRINT_WIDTH,
    FRAME_FINGERPRINT_HEIGHT,
  );
  return toGray(data);
};
