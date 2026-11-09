import { createEffect, createMemo, on } from 'solid-js';

import { revealIfHidden } from '@/shared/lib/dom';

import {
  SEEK_JUMP_THRESHOLD_MS,
  TRANSCRIPT_VIEWPORT_INSET,
} from '../config/recordingConfig';
import { mapTranscriptSegments } from '../lib/mapTranscriptSegments';
import { RecordingDeps } from '../types/RecordingDeps';

export const useRecording = (deps: RecordingDeps) => {
  let listEl: HTMLDivElement | undefined;

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

  const setListRef = (element: HTMLDivElement) => {
    listEl = element;
  };

  const scrollTo = (selector: string) =>
    requestAnimationFrame(() =>
      revealIfHidden(
        listEl?.querySelector(selector),
        TRANSCRIPT_VIEWPORT_INSET,
      ),
    );

  createEffect(
    on(
      () => deps.currentMatchIndex,
      (index) => {
        if (index !== null) scrollTo('[data-current-match]');
      },
    ),
  );

  createEffect(
    on(
      () => deps.currentTimeMs,
      (time, prev) => {
        if (prev === undefined) return;
        const delta = time - prev;
        if (delta >= 0 && delta < SEEK_JUMP_THRESHOLD_MS) return;
        scrollTo('[data-active-paragraph]');
      },
    ),
  );

  const isParagraphActive = (id: string) => activeParagraphId() === id;

  const isEmpty = () => !deps.isLoading && segments().length === 0;

  return { segments, isParagraphActive, isEmpty, setListRef };
};
