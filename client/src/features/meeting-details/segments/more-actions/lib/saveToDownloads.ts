import { downloadDir, join } from '@tauri-apps/api/path';
import { exists, writeFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { revealItemInDir } from '@tauri-apps/plugin-opener';

import { toFileName } from './toFileName';

const downloadPath = async (fileName: string, extension: string) =>
  join(await downloadDir(), `${toFileName(fileName)}.${extension}`);

export async function revealAudioInDownloads(
  audioUrl: string,
  fileName: string,
): Promise<void> {
  const path = await downloadPath(fileName, audioUrl.split('.').pop() ?? 'mp3');

  if (!(await exists(path))) {
    const response = await fetch(audioUrl);
    await writeFile(path, new Uint8Array(await response.arrayBuffer()));
  }

  await revealItemInDir(path);
}

export async function revealTextInDownloads(
  text: string,
  fileName: string,
): Promise<void> {
  const path = await downloadPath(fileName, 'txt');

  await writeTextFile(path, text);
  await revealItemInDir(path);
}
