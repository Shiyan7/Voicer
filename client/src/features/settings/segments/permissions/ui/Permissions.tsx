import { For, Show } from 'solid-js';

import { settingsSectionStyles } from '@/features/settings/Settings.styles';
import { i18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';

import { usePermissions } from '../model/usePermissions';
import { permissionsStyles } from './Permissions.styles';

const section = settingsSectionStyles();
const styles = permissionsStyles();

export function Permissions() {
  const vm = usePermissions();

  return (
    <section class={section.section()}>
      <h2 class={section.sectionTitle()}>
        {i18n.t('settings.permissions.title')}
      </h2>
      <div class={section.card()}>
        <For each={vm.rows()}>
          {(row) => (
            <div class={section.row()}>
              <div class={section.rowText()}>
                <span class={section.rowLabel()}>{row.label}</span>
                <Show when={row.granted === false}>
                  <span class={section.rowHint()}>
                    {i18n.t('settings.permissions.hint')}
                  </span>
                </Show>
              </div>
              <div class={styles.rowActions()}>
                <Show when={row.granted !== null}>
                  <span
                    class={styles.status({ granted: row.granted ?? undefined })}
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
  );
}
