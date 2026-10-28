import type { KeyPointOutput } from '@schema';

export interface KeyPointsParams {
  points: KeyPointOutput[];
  focusId: string | null;
  onSeek: (ms: number) => void;
}
