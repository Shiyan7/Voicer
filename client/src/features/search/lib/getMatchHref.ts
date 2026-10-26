import { SearchMatchKind, SearchResultOutput } from '@schema';

import { paths } from '@/shared/router';

export function getMatchHref(result: SearchResultOutput): string {
  switch (result.kind) {
    case SearchMatchKind.Transcript:
      return paths.meetingFocus(result.meetingId, 'recording', result.matchId);
    case SearchMatchKind.KeyPoint:
    case SearchMatchKind.ActionItem:
      return paths.meetingFocus(result.meetingId, 'notes', result.matchId);
    default:
      return paths.meeting(result.meetingId);
  }
}
