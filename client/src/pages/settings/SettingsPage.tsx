import { For } from 'solid-js';

import { i18n, languages, Locale } from '@/shared/i18n';
import { PageFade } from '@/shared/ui/page-fade';

import { settingsStyles } from './Settings.styles';

const styles = settingsStyles();

export default function SettingsPage() {
  const handleLangChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    i18n.changeLang(target.value as Locale);
  };

  return (
    <PageFade>
      <div class={styles.label()}>{i18n.t('labels.change_lang')}</div>
      <select
        class={styles.select()}
        onChange={handleLangChange}
        value={i18n.locale()}
      >
        <For each={languages}>
          {(lang) => <option value={lang.value}>{lang.label}</option>}
        </For>
      </select>
    </PageFade>
  );
}
