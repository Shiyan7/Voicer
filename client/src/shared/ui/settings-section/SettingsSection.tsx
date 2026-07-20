import { JSX } from 'solid-js';

import { settingsSectionStyles } from './SettingsSection.styles';

interface SettingsSectionProps {
  title?: string;
  children: JSX.Element;
}

const styles = settingsSectionStyles();

export function SettingsSection(props: SettingsSectionProps) {
  return (
    <section class={styles.section()}>
      <h2 class={styles.title()}>{props.title}</h2>
      <div class={styles.card()}>{props.children}</div>
    </section>
  );
}
