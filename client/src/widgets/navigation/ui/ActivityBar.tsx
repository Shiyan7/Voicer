import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { useViewModel } from '@/shared/view-model';

import { NavigationViewModel } from '../model/NavigationViewModel';
import { activityBarStyles } from './ActivityBar.styles';

const styles = activityBarStyles();

export function ActivityBar() {
  const navigation = useViewModel(NavigationViewModel);

  return (
    <Show when={navigation.isActivityOpened}>
      <div id="activity" class={styles.root()}>
        <h2 class={styles.title()}>{i18n.t('nav.activity')}</h2>
      </div>
    </Show>
  );
}
