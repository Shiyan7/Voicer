import { Show } from 'solid-js';

import { Button } from '@/shared/ui/button';
import { useViewModel } from '@/shared/view-model';

import { TeamSelectViewModel } from '../model/TeamSelectViewModel';
import { TeamSelectDeps } from '../types/TeamSelectDeps';
import { teamSelectStyles } from './TeamSelect.styles';

const styles = teamSelectStyles();

export function TeamSelect(props: TeamSelectDeps) {
  const vm = useViewModel(TeamSelectViewModel, () => props);

  return (
    <Show
      when={vm.session.isAuthorized}
      fallback={
        <Button
          class={styles.authBtn()}
          onClick={() => vm.onAuthBtnClick()}
          size="md"
        >
          {vm.authLabel}
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
