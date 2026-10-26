import { downloadDir, join } from '@tauri-apps/api/path';
import { exists, writeFile } from '@tauri-apps/plugin-fs';
import { revealItemInDir } from '@tauri-apps/plugin-opener';
import { createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { DropdownOption } from '@/shared/ui/dropdown';

import { MoreAction } from '../types/MoreAction';
import { MoreActionsDeps } from '../types/MoreActionsDeps';

const sanitize = (name: string) => name.replace(/[\\/:*?"<>|]/g, '-').trim();

export const useMoreActions = (deps: MoreActionsDeps) => {
  const [isRevealing, setIsRevealing] = createSignal(false);

  const options = (): DropdownOption<MoreAction>[] => [
    {
      value: 'show-in-finder',
      label: i18n.t('meetings.show_in_finder'),
      icon: 'common:folder',
    },
  ];

  const showInFinder = async (audioUrl: string) => {
    if (isRevealing()) return;

    setIsRevealing(true);
    try {
      const extension = audioUrl.split('.').pop() ?? 'mp3';
      const path = await join(
        await downloadDir(),
        `${sanitize(deps.fileName)}.${extension}`,
      );

      if (!(await exists(path))) {
        const response = await fetch(audioUrl);
        await writeFile(path, new Uint8Array(await response.arrayBuffer()));
      }
      await revealItemInDir(path);
    } finally {
      setIsRevealing(false);
    }
  };

  const selectAction = (action: MoreAction) => {
    if (action === 'show-in-finder' && deps.audioUrl) {
      void showInFinder(deps.audioUrl);
    }
  };

  return { options, selectAction };
};
