import { Icon } from '@/shared/ui/icon';
import { PageFade } from '@/shared/ui/page-fade';

import { useSharedNotes } from './model/useSharedNotes';
import { sharedNotesStyles } from './SharedNotes.styles';

const styles = sharedNotesStyles();

export function SharedNotesOrchestrator() {
  const vm = useSharedNotes();

  return (
    <PageFade>
      <div class={styles.root()}>
        <h1 class={styles.title()}>{vm.title()}</h1>
        <div class={styles.empty()}>
          <span class={styles.emptyIcon()}>
            <Icon size={24} name="navigation:users" />
          </span>
          <span class={styles.emptyTitle()}>{vm.emptyTitle()}</span>
          <span class={styles.emptyHint()}>{vm.emptyHint()}</span>
        </div>
      </div>
    </PageFade>
  );
}
