import { For } from 'solid-js';

import { settingsSectionStyles } from '@/features/settings/Settings.styles';
import { i18n, languages } from '@/shared/i18n';

import { useGeneral } from '../model/useGeneral';
import { generalStyles } from './General.styles';

const section = settingsSectionStyles();
const styles = generalStyles();

export function General() {
  const vm = useGeneral();

  return (
    <section class={section.section()}>
      <h2 class={section.sectionTitle()}>{i18n.t('settings.general')}</h2>
      <div class={section.card()}>
        <div class={section.row()}>
          <div class={section.rowText()}>
            <span class={section.rowLabel()}>{i18n.t('labels.change_lang')}</span>
          </div>
          <select
            class={styles.select()}
            value={vm.locale()}
            onChange={(event) => vm.changeLang(event.currentTarget.value)}
          >
            <For each={languages}>
              {(lang) => <option value={lang.value}>{lang.label}</option>}
            </For>
          </select>
        </div>
        <button class={styles.logout()} type="button" onClick={vm.logout}>
          logout
        </button>
      </div>
    </section>
  );
}
