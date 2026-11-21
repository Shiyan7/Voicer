import { A } from '@solidjs/router';
import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';
import { Icon } from '@/shared/ui/icon';
import { MoreActionsMenu } from '@/shared/ui/more-actions-menu';
import { Tooltip } from '@/shared/ui/tooltip';

import { useThreadList } from '../model/useThreadList';
import { ThreadListDeps } from '../types/ThreadListDeps';
import { RenameThreadModal } from './RenameThreadModal';
import { threadListStyles } from './ThreadList.styles';

const styles = threadListStyles();

export function ThreadList(deps: ThreadListDeps) {
  const vm = useThreadList(deps);

  return (
    <aside class={styles.root()}>
      <RenameThreadModal
        draft={vm.draft()}
        counter={vm.counter()}
        canSave={vm.canSave()}
        inputRef={vm.selectInput}
        onDraft={vm.setDraft}
        onSave={vm.saveRename}
        onCancel={vm.cancelRename}
      />
      <button class={styles.newButton()} type="button" onClick={deps.onNew}>
        <Icon size={18} name="common:pencil-square" />
        {i18n.t('chat.new')}
      </button>
      <section class={styles.section()}>
        <h2 class={styles.sectionTitle()}>{i18n.t('chat.recent')}</h2>
        <nav class={styles.list()}>
          <Show
            when={!deps.isLoading}
            fallback={<div class={styles.skeleton()} />}
          >
            <For
              each={deps.threads}
              fallback={
                <p class={styles.empty()}>{i18n.t('chat.empty_threads')}</p>
              }
            >
              {(thread) => (
                <Tooltip
                  class={styles.item({ active: thread.isActive })}
                  label={thread.title}
                  position="right"
                  overflowOnly
                >
                  <A
                    class={styles.link({ active: thread.isActive })}
                    href={paths.chatThread(thread.id)}
                  >
                    {thread.title}
                  </A>
                  <div class={styles.actions()}>
                    <Show when={thread.isPinned}>
                      <Icon class={styles.pin()} size={15} name="common:pin" />
                    </Show>
                    <MoreActionsMenu
                      class={styles.menu()}
                      variant="ghost"
                      options={vm.actions(thread.isPinned)}
                      onSelect={(action) => vm.selectAction(thread.id, action)}
                    />
                  </div>
                </Tooltip>
              )}
            </For>
          </Show>
        </nav>
      </section>
    </aside>
  );
}
