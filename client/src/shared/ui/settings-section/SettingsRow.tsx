import { JSX, Show } from 'solid-js';

import { settingsRowStyles } from './SettingsRow.styles';

interface SettingsRowProps {
  label?: string;
  hint?: string;
  children: JSX.Element;
}

const styles = settingsRowStyles();

export function SettingsRow(props: SettingsRowProps) {
  return (
    <div class={styles.row()}>
      <div class={styles.text()}>
        <span class={styles.label()}>{props.label}</span>
        <Show when={props.hint}>
          <span class={styles.hint()}>{props.hint}</span>
        </Show>
      </div>
      {props.children}
    </div>
  );
}
