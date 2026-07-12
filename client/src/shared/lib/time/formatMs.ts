import { formatSeconds } from './formatSeconds';

export const formatMs = (ms: number) => formatSeconds(ms / 1000);
