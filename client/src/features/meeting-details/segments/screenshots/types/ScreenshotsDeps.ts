import type { MeetingScreenshotOutput } from '@schema';

export interface ScreenshotsDeps {
  screenshots: MeetingScreenshotOutput[];
  onSeek: (ms: number) => void;
}
