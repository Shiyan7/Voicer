import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { useViewModel } from '@/shared/view-model';

import { NavigationViewModel } from '../model/NavigationViewModel';

export function ActivityBar() {
  const navigation = useViewModel(NavigationViewModel);

  return (
    <Show when={navigation.isActivityOpened}>
      <div
        id="activity"
        class="w-md absolute left-full top-0 h-full bg-white shadow-2xl"
      >
        <h2 class="text-md p-4 text-gray-900">{i18n.t('nav.activity')}</h2>
      </div>
    </Show>
  );
}
