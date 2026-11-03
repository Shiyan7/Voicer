import { A } from '@solidjs/router';
import { Show } from 'solid-js';

import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { useAccountCard } from '../model/useAccountCard';
import { AccountCardDeps } from '../types/AccountCardDeps';
import { accountCardStyles } from './AccountCard.styles';

const styles = accountCardStyles();

export function AccountCard(deps: AccountCardDeps) {
  const vm = useAccountCard(deps);

  return (
    <Show
      when={vm.isAuthorized()}
      fallback={
        <Button
          class={styles.authBtn({ collapsed: deps.isCollapsed })}
          size="lg"
          aria-label={vm.authLabel()}
          onClick={vm.openAuth}
        >
          <Icon size={18} name="common:login" />
          <Show when={!deps.isCollapsed}>{vm.authLabel()}</Show>
        </Button>
      }
    >
      <A
        class={styles.card({ collapsed: deps.isCollapsed })}
        href={vm.accountHref}
      >
        <span class={styles.avatar({ collapsed: deps.isCollapsed })}>
          {vm.firstLetterName()}
        </span>
        <Show when={!deps.isCollapsed}>
          <span class={styles.info()}>
            <span class={styles.name()}>{vm.name()}</span>
            <span class={styles.email()}>{vm.email()}</span>
          </span>
        </Show>
      </A>
    </Show>
  );
}
