import { Channel, invoke } from '@tauri-apps/api/core';

const toPcm = (data: ArrayBuffer | number[]) =>
  data instanceof ArrayBuffer
    ? new Int16Array(data)
    : new Int16Array(Uint8Array.from(data).buffer);

export const startLiveCapture = (onChunk: (pcm: Int16Array) => void) => {
  const onSystem = new Channel<ArrayBuffer>();
  onSystem.onmessage = (data) => onChunk(toPcm(data));
  return invoke<void>('start_live_capture', { onSystem });
};

export const stopLiveCapture = () => invoke<void>('stop_live_capture');

export const captureScreenshot = async () => {
  const data = await invoke<ArrayBuffer>('capture_screenshot');
  return new File([data], 'screenshot.png', { type: 'image/png' });
};
