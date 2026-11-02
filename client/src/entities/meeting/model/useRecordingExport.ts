import { useClient } from '@urql/solid';
import { createSignal } from 'solid-js';

import {
  revealAudioInDownloads,
  revealTextInDownloads,
} from '@/shared/lib/downloads';

import { fetchMeetingTranscript } from '../api/fetchMeetingTranscript';
import { buildTranscriptText } from '../lib/buildTranscriptText';
import { RecordingExportAction } from '../types/RecordingExportAction';
import { RecordingExportDeps } from '../types/RecordingExportDeps';

export const useRecordingExport = (props: RecordingExportDeps) => {
  const client = useClient();
  const [isBusy, setIsBusy] = createSignal(false);

  const runExclusive = async (task: () => Promise<void>) => {
    if (isBusy()) return;

    setIsBusy(true);
    try {
      await task();
    } finally {
      setIsBusy(false);
    }
  };

  const showInFinder = (audioUrl: string) =>
    runExclusive(() => revealAudioInDownloads(audioUrl, props.fileName));

  const exportText = () =>
    runExclusive(async () => {
      const segments = await fetchMeetingTranscript(client, props.meetingId);
      await revealTextInDownloads(
        buildTranscriptText(props.fileName, segments),
        props.fileName,
      );
    });

  const runExport = (action: RecordingExportAction) => {
    if (action === 'export-text') void exportText();
    if (action === 'show-in-finder' && props.audioUrl) {
      void showInFinder(props.audioUrl);
    }
  };

  return { runExport };
};
