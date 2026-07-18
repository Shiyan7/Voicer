import { readFile } from '@tauri-apps/plugin-fs';

import { i18n } from '@/shared/i18n';
import { formatShortDateTime } from '@/shared/lib/time';

const fileNameFor = (extension: string, startedAt: number) =>
  `${i18n.t('recorder.recording')} ${formatShortDateTime(startedAt)}.${extension}`;

export const readRecordingFile = async (
  path: string,
  startedAt: number,
): Promise<File> => {
  const extension = path.split('.').pop()?.toLowerCase() ?? 'flac';
  const bytes = await readFile(path);

  return new File([bytes], fileNameFor(extension, startedAt), {
    type: `audio/${extension}`,
  });
};
