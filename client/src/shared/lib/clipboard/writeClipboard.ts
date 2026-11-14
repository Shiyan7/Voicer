import { isTauri } from '@tauri-apps/api/core';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

export async function writeClipboard(text: string): Promise<boolean> {
  const write = isTauri()
    ? writeText
    : navigator.clipboard.writeText.bind(navigator.clipboard);
  return write(text)
    .then(() => true)
    .catch(() => false);
}
