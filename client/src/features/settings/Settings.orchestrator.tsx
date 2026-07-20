import { isTauri } from '@tauri-apps/api/core';
import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { PageFade } from '@/shared/ui/page-fade';

import { General } from './segments/general/ui/General';
import { Recording } from './segments/recording/ui/Recording';
import { settingsStyles } from './Settings.styles';

const styles = settingsStyles();

export function SettingsOrchestrator() {
  return (
    <PageFade>
      <div class={styles.root()}>
        <h1 class={styles.pageTitle()}>{i18n.t('labels.settings')}</h1>
        <General />
        <Show when={isTauri()}>
          <Recording />
        </Show>
      </div>
    </PageFade>
  );
}
