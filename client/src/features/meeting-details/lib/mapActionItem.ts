import type { ActionItemOutput } from '@schema';

import { ActionItemData } from '@/entities/action-item';
import { getMeetingTitle } from '@/entities/meeting';
import { formatClockMs } from '@/shared/lib/time';
import { getSpeakerLabel, getSpeakerTone } from '@/shared/ui/speaker-avatar';

export function mapActionItem(
  item: ActionItemOutput,
  focusId: string | null,
): ActionItemData {
  return {
    id: item.id,
    meetingId: item.meetingId,
    text: item.text,
    isDone: item.isDone,
    createdAt: item.createdAt,
    meetingTitle: getMeetingTitle({
      title: item.meetingTitle,
      source: item.meetingSource,
      startedAt: item.meetingStartedAt,
    }),
    speakerLabel:
      item.speakerIndex != null
        ? getSpeakerLabel(item.speakerIndex)
        : undefined,
    speakerTone:
      item.speakerIndex != null ? getSpeakerTone(item.speakerIndex) : undefined,
    timeLabel: item.atMs != null ? formatClockMs(item.atMs) : undefined,
    isFocused: item.id === focusId,
  };
}
