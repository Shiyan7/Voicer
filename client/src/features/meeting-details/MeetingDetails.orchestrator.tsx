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
import { SummarizeAction, SummaryStyleBadge } from './segments/summarize';

const styles = meetingDetailsStyles();

export function MeetingDetailsOrchestrator() {
  const vm = useMeetingDetailsPage();

  return (
    <PageFade>
      <div class={styles.page()}>
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
                          summaryStyle={meeting().summaryStyle}
                          isSummarizing={vm.isSummarizing()}
                          onStarted={vm.goToNotesTab}
                        />
                      </Show>
                      <MoreActions
                        meetingId={meeting().id}
                        audioUrl={meeting().audioUrl}
                        fileName={meeting().title}
                        isFavorite={meeting().isFavorite}
                      />
                    </div>
                  </div>
                  <Show when={vm.isTranscribing()}>
                    <NotesLoading
                      title={i18n.t('meetings.transcript_loading.title')}
                      description={i18n.t(
                        'meetings.transcript_loading.description',
                      )}
                    />
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
                    <Switch>
                      <Match when={vm.activeTab() === 'recording'}>
                        <Recording
                          transcript={vm.transcript()}
                          isLoading={vm.isTranscriptLoading()}
                          currentTimeMs={vm.currentTimeMs()}
                          focusId={vm.focusId()}
                          onSeek={vm.seekToMs}
                        />
                      </Match>
                      <Match when={vm.notesState() === 'loading'}>
                        <NotesLoading
                          title={i18n.t('meetings.notes_loading.title')}
                          description={i18n.t(
                            'meetings.notes_loading.description',
                          )}
                        />
                      </Match>
                      <Match when={vm.notesState() === 'empty'}>
                        <NotesEmpty />
                      </Match>
                      <Match when={vm.notesState() === 'content'}>
                        <div class={styles.tabPanel()}>
                          <Show when={meeting().summaryStyle}>
                            {(style) => <SummaryStyleBadge style={style()} />}
                          </Show>
                          <ActionItemsSection
                            items={vm.actionItems()}
                            focusId={vm.focusId()}
                          />
                          <KeyPoints
                            points={vm.keyPoints()}
                            focusId={vm.focusId()}
                          />
                        </div>
                      </Match>
                    </Switch>
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
