import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { SettingsRow, SettingsSection } from '@/shared/ui/settings-section';

import { useMcp } from '../model/useMcp';
import { mcpStyles } from './Mcp.styles';

const styles = mcpStyles();

export function Mcp() {
  const vm = useMcp();

  return (
    <SettingsSection title={i18n.t('settings.mcp.title')}>
      <SettingsRow label={i18n.t('settings.mcp.url')} hint={vm.mcpUrl()}>
        <Button variant="secondary" onClick={() => vm.copy(vm.mcpUrl())}>
          {i18n.t('settings.mcp.copy')}
        </Button>
      </SettingsRow>
      <form class={styles.form()} onSubmit={vm.submit}>
        <input
          class={styles.nameInput()}
          placeholder={i18n.t('settings.mcp.name_placeholder')}
          value={vm.tokenName()}
          onInput={(event) => vm.setTokenName(event.currentTarget.value)}
        />
        <Button type="submit" disabled={vm.isCreating()}>
          {i18n.t('settings.mcp.create')}
        </Button>
      </form>
      <Show when={vm.connectCommand()}>
        {(command) => (
          <div class={styles.created()}>
            <span class={styles.createdHint()}>
              {i18n.t('settings.mcp.created_hint')}
            </span>
            <code class={styles.command()}>{command()}</code>
            <div class={styles.createdActions()}>
              <Button variant="secondary" onClick={() => vm.copy(command())}>
                {i18n.t('settings.mcp.copy')}
              </Button>
            </div>
          </div>
        )}
      </Show>
      <For each={vm.tokens()}>
        {(token) => (
          <SettingsRow label={token.name} hint={token.hint}>
            <button
              class={styles.revoke()}
              type="button"
              onClick={() => vm.revoke(token.id)}
            >
              {i18n.t('settings.mcp.revoke')}
            </button>
          </SettingsRow>
        )}
      </For>
    </SettingsSection>
  );
}
