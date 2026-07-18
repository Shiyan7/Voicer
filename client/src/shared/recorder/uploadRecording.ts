import type { MutationMeetingUploadAudioArgs } from '@schema';
import { readFile } from '@tauri-apps/plugin-fs';

import {
  MEETING_UPLOAD_AUDIO_MUTATION,
  type MeetingUploadAudioMutation,
} from '@/shared/api';
import { i18n } from '@/shared/i18n';
import { formatShortDateTime } from '@/shared/lib/time';
import { urqlClient } from '@/shared/urql-client';

const fileNameFor = (extension: string, startedAt: number) =>
  `${i18n.t('recorder.recording')} ${formatShortDateTime(startedAt)}.${extension}`;

export const uploadRecording = async (
  path: string,
  startedAt: number,
): Promise<string> => {
  const extension = path.split('.').pop()?.toLowerCase() ?? 'flac';
  const bytes = await readFile(path);
  const file = new File([bytes], fileNameFor(extension, startedAt), {
    type: `audio/${extension}`,
  });

  const result = await urqlClient
    .mutation<MeetingUploadAudioMutation, MutationMeetingUploadAudioArgs>(
      MEETING_UPLOAD_AUDIO_MUTATION,
      { file },
    )
    .toPromise();

  if (result.error) throw result.error;

  const meetingId = result.data?.meetingUploadAudio.id;
  if (!meetingId) throw new Error('meetingUploadAudio returned no id');

  return meetingId;
};
