import { Show } from 'solid-js';

import { SessionViewModel } from '@/entities/session';
import { i18n } from '@/shared/i18n';
import { MODALS, showModal } from '@/shared/lib/modal';
import { Button } from '@/shared/ui/button';
import { useViewModel } from '@/shared/view-model';

interface TeamSelectProps {
  isExpanded: boolean;
}

export function TeamSelect(props: TeamSelectProps) {
  const session = useViewModel(SessionViewModel);

  return (
    <Show
      when={session.isAuthorized}
      fallback={
        <Button class="w-full" onClick={() => showModal(MODALS.AUTH)} size="md">
          {props.isExpanded
            ? i18n.t('labels.auth_button')
            : i18n.t('labels.log_in')}
        </Button>
      }
    >
      <Show
        when={props.isExpanded}
        fallback={
          <button class="mx-auto flex h-5 w-5 items-center justify-center rounded-sm border border-gray-500 text-gray-500">
            {session.user?.name}
          </button>
        }
      >
        <div class="flex flex-col items-start">
          <span class="text-2xl font-bold text-gray-900">
            {session.user?.name}
          </span>
          <span class="text-sm text-gray-500">{session.user?.email}</span>
        </div>
      </Show>
    </Show>
  );
}
