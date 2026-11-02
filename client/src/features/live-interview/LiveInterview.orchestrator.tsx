import { Show } from 'solid-js';

import { MeetingPlayer } from '@/entities/meeting-player';
import { PageFade } from '@/shared/ui/page-fade';

import { liveInterviewStyles } from './LiveInterview.styles';
import { useLiveInterview } from './model/useLiveInterview';
import { ReviewActions } from './segments/review-actions';
import { LiveSession, LiveSessionBar, ReviewHeader } from './segments/session';

const styles = liveInterviewStyles();

export function LiveInterviewOrchestrator() {
  const vm = useLiveInterview();

  return (
    <PageFade>
      <div class={styles.root()}>
        <Show when={vm.isLoaded()}>
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
