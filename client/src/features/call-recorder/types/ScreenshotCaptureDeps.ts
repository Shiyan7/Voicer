export interface ScreenshotCaptureDeps {
  isCapturing: () => boolean;
  elapsedMs: () => number;
}
