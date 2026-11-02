import { Show } from 'solid-js';

import { useInterviewPreparation } from '@/entities/interview-session';
import { MeetingPlayer } from '@/entities/meeting-player';
import { i18n } from '@/shared/i18n';
import { BackButton } from '@/shared/ui/back-button';
import { Button } from '@/shared/ui/button';
import { PageFade } from '@/shared/ui/page-fade';

import { liveInterviewStyles } from './LiveInterview.styles';
import { useLiveInterview } from './model/useLiveInterview';
import { ReviewActions } from './segments/review-actions';
import { LiveSession, LiveSessionBar, ReviewHeader } from './segments/session';

const styles = liveInterviewStyles();

export function LiveInterviewOrchestrator() {
  const vm = useLiveInterview();
  const preparation = useInterviewPreparation(vm.sessionId);

  return (
    <PageFade>
      <div class={styles.root()}>
        <Show when={vm.isMock()}>
          <div class={styles.mockPlaceholder()}>
            <BackButton onClick={vm.closeReview} />
            <Show when={preparation.isPreparing()}>
              <p>{i18n.t('live.session.mock_preparing')}</p>
            </Show>
            <Show when={preparation.isReady()}>
              <p>{i18n.t('live.session.mock_placeholder')}</p>
            </Show>
            <Show when={preparation.isFailed()}>
              <p>{i18n.t('live.prep.error')}</p>
              <Button variant="secondary" onClick={preparation.retry}>
                {i18n.t('live.prep.retry')}
              </Button>
            </Show>
          </div>
        </Show>
        <Show when={vm.isLoaded() && !vm.isMock()}>
          <LiveSession
            header={
              <Show
                when={vm.isReview()}
                fallback={
                  <LiveSessionBar
                    timerLabel={vm.session.timerLabel()}
                    statusLabel={vm.session.statusLabel()}
                    isAnswering={vm.session.isAnswering()}
                    onCaptureCode={vm.session.captureCode}
                    onAnswerNow={vm.session.answerNow}
                    onStop={vm.finishInterview}
                  />
                }
              >
                <ReviewHeader
                  title={vm.reviewTitle()}
                  onBack={vm.closeReview}
                  actions={
                    <ReviewActions
                      sessionId={vm.sessionId()}
                      meetingId={vm.recording.meetingId()}
                      audioUrl={vm.recording.audioUrl()}
                      fileName={vm.reviewTitle()}
                    />
                  }
                />
              </Show>
            }
            player={
              <Show when={vm.isReview() && vm.recording.audioUrl()}>
                {(audioUrl) => (
                  <MeetingPlayer
                    audioUrl={audioUrl()}
                    transcript={vm.recording.transcript()}
                    playback={vm.recording.playback}
                  />
                )}
              </Show>
            }
            turns={vm.session.turnViews()}
            isEmpty={vm.session.isEmpty()}
            emptyLabel={vm.emptyLabel()}
            onToggleDetails={vm.session.toggleDetails}
          />
        </Show>
      </div>
    </PageFade>
  );
}
