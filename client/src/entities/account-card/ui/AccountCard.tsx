import { A } from '@solidjs/router';
import { Show } from 'solid-js';

import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { useAccountCard } from '../model/useAccountCard';
import { AccountCardDeps } from '../types/AccountCardDeps';
import { accountCardStyles } from './AccountCard.styles';

const styles = accountCardStyles();

export function AccountCard(props: AccountCardDeps) {
  const vm = useAccountCard(props);

  return (
    <Show
      when={vm.isAuthorized()}
      fallback={
        <Button
          class={styles.authBtn({ collapsed: props.isCollapsed })}
          size="lg"
          aria-label={vm.authLabel()}
          onClick={vm.openAuth}
        >
          <Icon size={18} name="common:login" />
          <Show when={!props.isCollapsed}>{vm.authLabel()}</Show>
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
