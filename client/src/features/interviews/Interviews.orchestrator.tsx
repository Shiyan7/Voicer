import { A } from '@solidjs/router';
import { For } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { ItemList, ListRow } from '@/shared/ui/item-list';
import { PageFade } from '@/shared/ui/page-fade';

import { interviewsStyles } from './Interviews.styles';
import { useInterviews } from './model/useInterviews';

const styles = interviewsStyles();

export function InterviewsOrchestrator() {
  const vm = useInterviews();

  return (
    <PageFade>
      <div class={styles.root()}>
        <header class={styles.header()}>
          <h1 class={styles.title()}>{i18n.t('live.title')}</h1>
          <Button as={A} href={paths.liveNew}>
            <Icon name="common:microphone" size={16} />
            {i18n.t('live.new')}
          </Button>
        </header>
        <ItemList
          isLoading={vm.isLoading()}
          isEmpty={vm.isEmpty()}
          emptyLabel={i18n.t('live.empty')}
        >
          <For each={vm.rows()}>
            {(row) => (
              <ListRow
                href={row.href}
                icon="common:microphone"
                title={row.title}
                meta={row.status}
                dateLabel={row.dateLabel}
                dateTitle={row.dateTitle}
              />
            )}
          </For>
        </ItemList>
      </div>
    </PageFade>
  );
}
