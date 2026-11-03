import { createMemo } from 'solid-js';

import { mapTranscriptSegments } from '../lib/mapTranscriptSegments';
import { RecordingDeps } from '../types/RecordingDeps';

export const useRecording = (deps: RecordingDeps) => {
  const segments = createMemo(() =>
    mapTranscriptSegments(deps.transcript, deps.focusId),
  );

  const activeParagraphId = createMemo(() => {
    const time = deps.currentTimeMs;

    for (const group of segments()) {
      const paragraph = group.paragraphs.find(
        (item) => time >= item.startMs && time < item.endMs,
      );
      if (paragraph) return paragraph.id;
    }

    return null;
  });

  const isParagraphActive = (id: string) => activeParagraphId() === id;

  const isEmpty = () => !deps.isLoading && segments().length === 0;

  return { segments, isParagraphActive, isEmpty };
};
