import { HeatLevel } from './HeatLevel';

export interface HeatCell {
  date: string;
  count: number;
  durationSec: number;
  level: HeatLevel;
  isOutside: boolean;
  isFuture: boolean;
}
