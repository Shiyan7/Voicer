import { For } from 'solid-js';

import { i18n, languages } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';
import { SettingsRow, SettingsSection } from '@/shared/ui/settings-section';

import { useGeneral } from '../model/useGeneral';
import { generalStyles } from './General.styles';

const styles = generalStyles();

export function General() {
  const vm = useGeneral();

  return (
    <SettingsSection title={i18n.t('settings.general')}>
      <SettingsRow label={i18n.t('labels.change_lang')}>
        <select
          class={styles.select()}
          value={vm.locale()}
          onChange={(event) => vm.changeLang(event.currentTarget.value)}
        >
          <For each={languages}>
            {(lang) => <option value={lang.value}>{lang.label}</option>}
          </For>
        </select>
      </SettingsRow>
      <SettingsRow label={i18n.t('settings.theme.title')}>
        <select
          class={styles.select()}
          value={vm.theme()}
          onChange={(event) => vm.changeTheme(event.currentTarget.value)}
        >
          <For each={vm.themes()}>
            {(theme) => (
              <option value={theme}>{i18n.t(`settings.theme.${theme}`)}</option>
            )}
          </For>
        </select>
      </SettingsRow>
      <div class={styles.logoutRow()}>
        <button class={styles.logout()} type="button" onClick={vm.logout}>
          <Icon size={24} name="common:logout" />
          {i18n.t('settings.logout')}
        </button>
      </div>
    </SettingsSection>
  );
}
