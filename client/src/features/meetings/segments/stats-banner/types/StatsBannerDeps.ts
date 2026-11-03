import type { MeetingsStatsOutput } from '@schema';

export interface StatsBannerDeps {
  stats: MeetingsStatsOutput | undefined;
  isLoading: boolean;
}
