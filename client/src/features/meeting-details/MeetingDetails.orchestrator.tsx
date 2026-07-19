import { A } from '@solidjs/router';
import { Match, Show, Switch } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { PageFade } from '@/shared/ui/page-fade';
import { Tabs } from '@/shared/ui/tabs';

import { meetingDetailsStyles } from './MeetingDetails.styles';
import { useMeetingDetailsPage } from './model/useMeetingDetailsPage';
import { ActionItemsSection } from './segments/action-items';
import { DetailsHeader } from './segments/details-header';
import { KeyPoints } from './segments/key-points';
import { Recording } from './segments/recording';

const styles = meetingDetailsStyles();

export function MeetingDetailsOrchestrator() {
  const vm = useMeetingDetailsPage();

  return (
    <PageFade>
      <div class={styles.root()}>
        <A class={styles.backLink()} href={paths.meetings}>
          <Icon size={12} name="common:arrow-left" />
          {i18n.t('meetings.back')}
        </A>
        <Switch>
          <Match when={vm.isLoading()}>
            <div class={styles.skeleton({ size: 'header' })} />
            <div class={styles.skeleton({ size: 'content' })} />
          </Match>
          <Match when={vm.isEmpty()}>
            <div class={styles.notFound()}>
              <h1 class={styles.notFoundTitle()}>
                {i18n.t('meetings.not_found')}
              </h1>
              <Button as={A} href={paths.meetings} variant="secondary">
                {i18n.t('meetings.back')}
              </Button>
            </div>
          </Match>
          <Match when={vm.meeting()}>
            {(meeting) => (
              <>
                <DetailsHeader meeting={meeting()} />
                <Show when={vm.processingStatus()}>
                  <div class={styles.processing()}>
                    <span class={styles.processingSpinner()} />
                    <span class={styles.processingLabel()}>
                      {vm.processingLabel()}…
                    </span>
                  </div>
                </Show>
                <Show when={vm.isFailed()}>
                  <div class={styles.processing()}>
                    <span class={styles.processingLabel()}>
                      {i18n.t('meetings.processing_failed')}
                    </span>
                  </div>
                </Show>
                <Show when={vm.isReady()}>
                  <Tabs
                    tabs={vm.tabs()}
                    activeTab={vm.activeTab()}
                    onSelect={vm.setActiveTab}
                  />
                  <Show
                    when={vm.activeTab() === 'notes'}
                    fallback={
                      <Recording
                        meetingId={meeting().id}
                        audioUrl={meeting().audioUrl}
                      />
                    }
                  >
                    <ActionItemsSection meetingId={meeting().id} />
                    <KeyPoints meetingId={meeting().id} />
                  </Show>
                </Show>
              </>
            )}
          </Match>
        </Switch>
      </div>
    </PageFade>
  );
}
