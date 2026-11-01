import { Show } from 'solid-js';

import { MeetingPlayer } from '@/entities/meeting-player';
import { PageFade } from '@/shared/ui/page-fade';

import { liveInterviewStyles } from './LiveInterview.styles';
import { useLiveInterview } from './model/useLiveInterview';
import { LiveSession } from './segments/session';

const styles = liveInterviewStyles;

export function LiveInterviewOrchestrator() {
  const vm = useLiveInterview();

  return (
    <PageFade>
      <div class={styles()}>
        <Show when={vm.isLoaded()}>
          <LiveSession
            timerLabel={vm.session.timerLabel()}
            statusLabel={vm.session.statusLabel()}
            isAnswering={vm.session.isAnswering()}
            isEmpty={vm.session.isEmpty()}
            turns={vm.session.turnViews()}
            onToggleDetails={vm.session.toggleDetails}
            onAnswerNow={vm.session.answerNow}
            onCaptureCode={vm.session.captureCode}
            onStop={vm.finishInterview}
            isReadOnly={vm.isReview()}
            onBack={vm.closeReview}
            reviewTitle={vm.reviewTitle()}
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
          />
        </Show>
      </div>
    </PageFade>
  );
}
