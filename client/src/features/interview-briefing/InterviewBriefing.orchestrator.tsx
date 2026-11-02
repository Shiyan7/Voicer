import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { BackButton } from '@/shared/ui/back-button';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { PageFade } from '@/shared/ui/page-fade';
import { Tabs } from '@/shared/ui/tabs';

import { useInterviewBriefing } from './model/useInterviewBriefing';
import { interviewBriefingStyles } from './ui/InterviewBriefing.styles';

const styles = interviewBriefingStyles();

export function InterviewBriefingOrchestrator() {
  const vm = useInterviewBriefing();

  return (
    <PageFade>
      <div class={styles.root()}>
        <header class={styles.header()}>
          <BackButton onClick={vm.goBack} />
          <h1 class={styles.title()}>{vm.title()}</h1>
        </header>
        <Show when={vm.isPreparing()}>
          <p class={styles.status()} role="status">
            {i18n.t('live.prep.preparing')}
          </p>
          <div class={interviewBriefingStyles({ size: 'header' }).skeleton()} />
          <div
            class={interviewBriefingStyles({ size: 'content' }).skeleton()}
          />
        </Show>
        <Show when={vm.isFailed()}>
          <div class={styles.failed()} role="alert">
            <span>{i18n.t('live.prep.error')}</span>
            <Button variant="secondary" onClick={vm.retry}>
              {i18n.t('live.prep.retry')}
            </Button>
          </div>
        </Show>
        <Show when={vm.isReady()}>
          <section class={styles.section()}>
            <Tabs
              tabs={vm.sectionTabs()}
              activeTab={vm.activeSection()}
              onSelect={vm.setActiveSection}
            />
            <ol class={styles.items()}>
              <For each={vm.activeItems()}>
                {(item) => <li class={styles.item()}>{item}</li>}
              </For>
            </ol>
          </section>
          <Button class={styles.start()} size="lg" onClick={vm.start}>
            <Icon name="common:microphone" size={18} />
            {i18n.t('live.prep.start')}
          </Button>
        </Show>
      </div>
    </PageFade>
  );
}
