import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { useViewModel } from '@/shared/view-model';

import { TeamSelectViewModel } from '../model/TeamSelectViewModel';
import { teamSelectStyles } from './TeamSelect.styles';

interface TeamSelectProps {
  isCollapsed: boolean;
}

const styles = teamSelectStyles();

export function TeamSelect(props: TeamSelectProps) {
  const vm = useViewModel(TeamSelectViewModel);

  return (
    <Show
      when={vm.session.isAuthorized}
      fallback={
        <Button class={styles.authBtn()} onClick={vm.onAuthBtnClick} size="md">
          {!props.isCollapsed
            ? i18n.t('labels.auth_button')
            : i18n.t('labels.log_in')}
        </Button>
      }
    >
      <Show
        when={!props.isCollapsed}
        fallback={
          <button class={styles.avatarBtn()}>{vm.firstLetterName}</button>
        }
      >
        <div class={styles.info()}>
          <span class={styles.name()}>{vm.session.user?.name}</span>
          <span class={styles.email()}>{vm.session.user?.email}</span>
        </div>
      </Show>
    </Show>
  );
}
