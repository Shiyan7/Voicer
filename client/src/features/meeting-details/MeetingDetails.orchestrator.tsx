import { A } from '@solidjs/router';
import { Match, Show, Switch } from 'solid-js';

import { MeetingPlayer } from '@/entities/meeting-player';
import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';
import { Button } from '@/shared/ui/button';
import { PageFade } from '@/shared/ui/page-fade';
import { Tabs } from '@/shared/ui/tabs';

import { meetingDetailsStyles } from './MeetingDetails.styles';
import { useMeetingDetailsPage } from './model/useMeetingDetailsPage';
import { ActionItemsSection } from './segments/action-items';
import { DetailsHeader } from './segments/details-header';
import { KeyPoints } from './segments/key-points';
import { MoreActions } from './segments/more-actions';
import { NotesEmpty } from './segments/notes-empty';
import { NotesLoading } from './segments/notes-loading';
import { Recording } from './segments/recording';
import { SummarizeAction } from './segments/summarize';

const styles = meetingDetailsStyles();

export function MeetingDetailsOrchestrator() {
  const vm = useMeetingDetailsPage();

  return (
    <PageFade>
      <div class={styles.page()}>
        <div class={styles.glowClip()}>
          <div class={styles.glow()} />
        </div>
        <div class={styles.root()}>
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
                  <div class={styles.headerRow()}>
                    <DetailsHeader
                      meeting={meeting()}
                      speakerTones={vm.speakerTones()}
                      onBack={vm.goBack}
                    />
                    <div class={styles.headerActions()}>
                      <Show when={vm.hasContent()}>
                        <SummarizeAction
                          meetingId={meeting().id}
                          isSummarizing={vm.isSummarizing()}
                          onStarted={vm.goToNotesTab}
                        />
                      </Show>
                      <MoreActions
                        meetingId={meeting().id}
                        audioUrl={meeting().audioUrl}
                        fileName={meeting().title ?? ''}
                        isFavorite={meeting().isFavorite}
                      />
                    </div>
                  </div>
                  <Show when={vm.isTranscribing()}>
                    <div class={styles.processing()}>
                      <span class={styles.processingSpinner()} />
                      <span class={styles.processingLabel()}>
                        {i18n.t('meetings.status.transcribing')}…
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
                  <Show when={vm.hasContent()}>
                    <Tabs
                      tabs={vm.tabs()}
                      activeTab={vm.activeTab()}
                      onSelect={vm.setActiveTab}
                    />
                    <Show
                      when={vm.activeTab() === 'notes'}
                      fallback={
                        <Recording
                          transcript={vm.transcript()}
                          isLoading={vm.isTranscriptLoading()}
                          currentTimeMs={vm.currentTimeMs()}
                          onSeek={vm.seekToMs}
                        />
                      }
                    >
                      <Show
                        when={!vm.isSummarizing()}
                        fallback={<NotesLoading />}
                      >
                        <Show
                          when={!vm.showNotesEmpty()}
                          fallback={<NotesEmpty />}
                        >
                          <div class={styles.tabPanel()}>
                            <ActionItemsSection items={vm.actionItems()} />
                            <KeyPoints points={vm.keyPoints()} />
                          </div>
                        </Show>
                      </Show>
                    </Show>
                  </Show>
                </>
              )}
            </Match>
          </Switch>
        </div>
        <Show when={vm.meeting()?.audioUrl}>
          {(audioUrl) => (
            <MeetingPlayer
              audioUrl={audioUrl()}
              transcript={vm.transcript()}
              playback={vm.playback}
            />
          )}
        </Show>
      </div>
    </PageFade>
  );
}
