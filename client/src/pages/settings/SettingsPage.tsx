import { For, Show } from 'solid-js';

import { i18n, languages } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { PageFade } from '@/shared/ui/page-fade';
import { useViewModel } from '@/shared/view-model';

import { settingsStyles } from './Settings.styles';
import { SettingsViewModel } from './SettingsViewModel';

const styles = settingsStyles();

export default function SettingsPage() {
  const vm = useViewModel(SettingsViewModel);

  return (
    <PageFade>
      <div class={styles.root()}>
        <h1 class={styles.pageTitle()}>{i18n.t('labels.settings')}</h1>

        <section class={styles.section()}>
          <h2 class={styles.sectionTitle()}>{i18n.t('settings.general')}</h2>
          <div class={styles.card()}>
            <div class={styles.row()}>
              <div class={styles.rowText()}>
                <span class={styles.rowLabel()}>
                  {i18n.t('labels.change_lang')}
                </span>
              </div>
              <select
                class={styles.select()}
                onChange={(e) => vm.changeLang(e.currentTarget.value)}
                value={vm.locale}
              >
                <For each={languages}>
                  {(lang) => <option value={lang.value}>{lang.label}</option>}
                </For>
              </select>
            </div>
            <button onClick={vm.onLogoutClick}>logout</button>
          </div>
        </section>

        <Show when={vm.isDesktop}>
          <section class={styles.section()}>
            <h2 class={styles.sectionTitle()}>
              {i18n.t('settings.recording.title')}
            </h2>
            <div class={styles.card()}>
              <div class={styles.row()}>
                <div class={styles.rowText()}>
                  <span class={styles.rowLabel()}>
                    {i18n.t('settings.recording.auto')}
                  </span>
                  <span class={styles.rowHint()}>
                    {i18n.t('settings.recording.auto_hint')}
                  </span>
                </div>
                <button
                  class={styles.toggle({ checked: vm.autoRecord })}
                  role="switch"
                  aria-checked={vm.autoRecord}
                  aria-label={i18n.t('settings.recording.auto')}
                  onClick={() => vm.toggleAutoRecord()}
                >
                  <span
                    class={styles.toggleThumb({ checked: vm.autoRecord })}
                  />
                </button>
              </div>
            </div>
          </section>

          <section class={styles.section()}>
            <h2 class={styles.sectionTitle()}>
              {i18n.t('settings.permissions.title')}
            </h2>
            <div class={styles.card()}>
              <For each={vm.permissionRows}>
                {(row) => (
                  <div class={styles.row()}>
                    <div class={styles.rowText()}>
                      <span class={styles.rowLabel()}>{row.label}</span>
                      <Show when={row.granted === false}>
                        <span class={styles.rowHint()}>
                          {i18n.t('settings.permissions.hint')}
                        </span>
                      </Show>
                    </div>
                    <div class={styles.rowActions()}>
                      <Show when={row.granted !== null}>
                        <span
                          class={styles.status({
                            granted: row.granted ?? undefined,
                          })}
                        >
                          {row.granted
                            ? i18n.t('settings.permissions.granted')
                            : i18n.t('settings.permissions.denied')}
                        </span>
                      </Show>
                      <Show when={row.granted === false}>
                        <Button
                          variant="secondary"
                          onClick={() => vm.requestPermissions()}
                        >
                          {i18n.t('settings.permissions.request')}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => vm.openSystemSettings(row.pane)}
                        >
                          {i18n.t('settings.permissions.open_settings')}
                        </Button>
                      </Show>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </section>
        </Show>
      </div>
    </PageFade>
  );
}
