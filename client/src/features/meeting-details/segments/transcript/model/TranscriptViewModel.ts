import { injectable } from '@/shared/di';
import { i18n } from '@/shared/i18n';
import { formatMs } from '@/shared/lib/time';
import { StatefulViewModel } from '@/shared/view-model';

import { TranscriptDeps } from '../types/TranscriptDeps';

@injectable()
export class TranscriptViewModel extends StatefulViewModel<TranscriptDeps> {
  constructor() {
    super();
  }

  get segments() {
    return (this.deps.segments ?? []).map((segment) => ({
      id: segment.id,
      speakerLabel:
        segment.speaker === 'me'
          ? i18n.t('meetings.speaker.me')
          : i18n.t('meetings.speaker.other'),
      speaker: segment.speaker,
      timeLabel: formatMs(segment.startMs),
      text: segment.text,
      isActive:
        this.deps.currentTimeMs >= segment.startMs &&
        this.deps.currentTimeMs < segment.endMs,
      startMs: segment.startMs,
    }));
  }

  get isEmpty() {
    return this.segments.length === 0;
  }

  seekTo = (startMs: number) => {
    this.deps.onSeek(startMs);
  };
}
