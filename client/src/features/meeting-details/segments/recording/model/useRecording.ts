import { createMemo } from 'solid-js';

import { mapTranscriptSegments } from '../lib/mapTranscriptSegments';
import { RecordingDeps } from '../types/RecordingDeps';

export const useRecording = (props: RecordingDeps) => {
  const segments = createMemo(() =>
    mapTranscriptSegments(props.transcript, props.focusId),
  );

  const activeParagraphId = createMemo(() => {
    const time = props.currentTimeMs;

    for (const group of segments()) {
      const paragraph = group.paragraphs.find(
        (item) => time >= item.startMs && time < item.endMs,
      );
      if (paragraph) return paragraph.id;
    }

    return null;
  });

  const isParagraphActive = (id: string) => activeParagraphId() === id;

  const isEmpty = () => !props.isLoading && segments().length === 0;

  return { segments, isParagraphActive, isEmpty };
};
