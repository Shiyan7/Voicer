import { A } from '@solidjs/router';
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
      <A
        class={styles.card({ collapsed: props.isCollapsed })}
        href={vm.accountHref}
      >
        <span class={styles.avatar({ collapsed: props.isCollapsed })}>
          <Show when={vm.avatarUrl()} fallback={vm.firstLetterName()}>
            {(url) => <img class={styles.avatarImage()} src={url()} alt="" />}
          </Show>
        </span>
        <Show when={!props.isCollapsed}>
          <span class={styles.info()}>
            <span class={styles.name()}>{vm.name()}</span>
            <span class={styles.email()}>{vm.email()}</span>
          </span>
        </Show>
      </A>
    </Show>
  );
}
