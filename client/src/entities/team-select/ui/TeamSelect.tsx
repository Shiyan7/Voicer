import { Show } from 'solid-js';

import { Button } from '@/shared/ui/button';

import { useTeamSelect } from '../model/useTeamSelect';
import { TeamSelectDeps } from '../types/TeamSelectDeps';
import { teamSelectStyles } from './TeamSelect.styles';

const styles = teamSelectStyles();

export function TeamSelect(props: TeamSelectDeps) {
  const vm = useTeamSelect(props);

  return (
    <Show
      when={vm.isAuthorized()}
      fallback={
        <Button class={styles.authBtn()} onClick={vm.openAuth} size="md">
          {vm.authLabel()}
        </Button>
      }
    >
      <Show
        when={!props.isCollapsed}
        fallback={
          <button class={styles.avatarBtn()}>{vm.firstLetterName()}</button>
        }
      >
        <div class={styles.info()}>
          <span class={styles.name()}>{vm.user()?.name}</span>
          <span class={styles.email()}>{vm.user()?.email}</span>
        </div>
      </Show>
    </Show>
  );
}
