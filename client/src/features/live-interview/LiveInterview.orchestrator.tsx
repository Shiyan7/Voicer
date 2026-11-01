import { Show } from 'solid-js';

import { MeetingPlayer } from '@/entities/meeting-player';
import { PageFade } from '@/shared/ui/page-fade';

import { liveInterviewStyles } from './LiveInterview.styles';
import { useLiveInterview } from './model/useLiveInterview';
import { LivePrep } from './segments/prep';
import { LiveSession } from './segments/session';

const styles = liveInterviewStyles;

export function LiveInterviewOrchestrator() {
  const vm = useLiveInterview();

  return (
    <PageFade>
      <div class={styles()}>
        <Show
          when={vm.isSession()}
          fallback={
            <LivePrep
              resumeLabel={vm.prep.resumeLabel()}
              hasResume={vm.prep.hasResume()}
              vacancy={vm.prep.vacancy()}
              language={vm.prep.language()}
              onSelectLanguage={vm.prep.setLanguage}
              isPreparing={vm.prep.isPreparing()}
              canPrepare={vm.prep.canPrepare()}
              isReady={vm.prep.isReady()}
              errorMessage={vm.prep.errorMessage()}
              sectionTabs={vm.prep.sectionTabs()}
              activeSection={vm.prep.activeSection()}
              activeItems={vm.prep.activeItems()}
              onSelectSection={vm.prep.setActiveSection}
              pastSessions={vm.history.pastSessions()}
              onResumeSelected={vm.prep.onResumeSelected}
              onVacancyInput={vm.prep.onVacancyInput}
              onPrepare={vm.prep.prepare}
              onStart={vm.startInterview}
              onOpenPastSession={vm.openPastSession}
            />
          }
        >
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
