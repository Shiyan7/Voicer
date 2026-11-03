import type { KeyPointOutput } from '@schema';

export interface KeyPointsDeps {
  points: KeyPointOutput[];
  focusId: string | null;
  onSeek: (ms: number) => void;
}
