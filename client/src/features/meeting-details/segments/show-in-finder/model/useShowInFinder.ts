import { downloadDir, join } from '@tauri-apps/api/path';
import { exists, writeFile } from '@tauri-apps/plugin-fs';
import { revealItemInDir } from '@tauri-apps/plugin-opener';
import { createSignal } from 'solid-js';

import { ShowInFinderParams } from '../types/ShowInFinderParams';

const sanitize = (name: string) => name.replace(/[\\/:*?"<>|]/g, '-').trim();

export const useShowInFinder = (props: ShowInFinderParams) => {
  const [isRevealing, setIsRevealing] = createSignal(false);

  const reveal = async () => {
    if (isRevealing()) return;

    setIsRevealing(true);
    try {
      const extension = props.audioUrl.split('.').pop() ?? 'mp3';
      const path = await join(
        await downloadDir(),
        `${sanitize(props.fileName)}.${extension}`,
      );

      if (!(await exists(path))) {
        const response = await fetch(props.audioUrl);
        await writeFile(path, new Uint8Array(await response.arrayBuffer()));
      }
      await revealItemInDir(path);
    } finally {
      setIsRevealing(false);
    }
  };

  return { isRevealing, reveal };
};
