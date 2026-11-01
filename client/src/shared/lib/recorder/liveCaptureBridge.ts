import { Channel, invoke } from '@tauri-apps/api/core';

export interface LiveCaptureHandlers {
  onSystemChunk: (pcm: Int16Array) => void;
  onMicChunk?: (pcm: Int16Array) => void;
}

const toPcm = (data: ArrayBuffer | number[]) =>
  data instanceof ArrayBuffer
    ? new Int16Array(data)
    : new Int16Array(Uint8Array.from(data).buffer);

export const startLiveCapture = ({
  onSystemChunk,
  onMicChunk,
}: LiveCaptureHandlers) => {
  const onSystem = new Channel<ArrayBuffer>();
  onSystem.onmessage = (data) => onSystemChunk(toPcm(data));
  const onMic = new Channel<ArrayBuffer>();
  onMic.onmessage = (data) => onMicChunk?.(toPcm(data));
  return invoke<void>('start_live_capture', {
    onSystem,
    onMic,
    includeMic: Boolean(onMicChunk),
  });
};

export const stopLiveCapture = () => invoke<void>('stop_live_capture');

export const captureScreenshot = async () => {
  const data = await invoke<ArrayBuffer>('capture_screenshot');
  return new Blob([data], { type: 'image/png' });
};
