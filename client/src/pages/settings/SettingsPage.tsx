import { For } from 'solid-js';

import { i18n, languages, Locale } from '@/shared/i18n';
import { PageFade } from '@/shared/ui/page-fade';

export default function SettingsPage() {
  const handleLangChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    i18n.changeLang(target.value as Locale);
  };

  return (
    <PageFade>
      <div class="text-gray-900">{i18n.t('labels.change_lang')}</div>
      <select
        class="mt-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
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
