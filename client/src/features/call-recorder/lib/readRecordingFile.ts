import { readFile } from '@tauri-apps/plugin-fs';

export const readRecordingFile = async (path: string): Promise<File> => {
  const extension = path.split('.').pop()?.toLowerCase() ?? 'flac';
  const bytes = await readFile(path);

  return new File([bytes], `recording.${extension}`, {
    type: `audio/${extension}`,
  });
};
