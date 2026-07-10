import { Show } from 'solid-js';

import { SessionViewModel } from '@/entities/session';
import { i18n } from '@/shared/i18n';
import { MODALS, showModal } from '@/shared/lib/modal';
import { Button } from '@/shared/ui/button';
import { useViewModel } from '@/shared/view-model';

import { teamSelectStyles } from './TeamSelect.styles';

const styles = teamSelectStyles();

interface TeamSelectProps {
  isExpanded: boolean;
}

export function TeamSelect(props: TeamSelectProps) {
  const session = useViewModel(SessionViewModel);

  return (
    <Show
      when={session.isAuthorized}
      fallback={
        <Button
          class={styles.authBtn()}
          onClick={() => showModal(MODALS.AUTH)}
          size="md"
        >
          {props.isExpanded
            ? i18n.t('labels.auth_button')
            : i18n.t('labels.log_in')}
        </Button>
      }
    >
      <Show
        when={props.isExpanded}
        fallback={
          <button class={styles.avatarBtn()}>
            {session.user?.name[0].toUpperCase()}
          </button>
        }
      >
        <div class={styles.info()}>
          <span class={styles.name()}>{session.user?.name}</span>
          <span class={styles.email()}>{session.user?.email}</span>
        </div>
      </Show>
    </Show>
  );
}
