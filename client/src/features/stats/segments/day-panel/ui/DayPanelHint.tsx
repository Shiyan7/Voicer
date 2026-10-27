import { i18n } from '@/shared/i18n';

import { dayPanelStyles } from './DayPanel.styles';

const styles = dayPanelStyles();

export function DayPanelHint() {
  return (
    <section class={styles.root()}>
      <p class={styles.hint()}>{i18n.t('stats.pick_day')}</p>
    </section>
  );
}
