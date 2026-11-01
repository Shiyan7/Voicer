import { Show } from 'solid-js';

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
              isPreparing={vm.prep.isPreparing()}
              canPrepare={vm.prep.canPrepare()}
              isReady={vm.prep.isReady()}
              errorMessage={vm.prep.errorMessage()}
              sections={vm.prep.sections()}
              onResumeSelected={vm.prep.onResumeSelected}
              onVacancyInput={vm.prep.onVacancyInput}
              onPrepare={vm.prep.prepare}
              onStart={vm.startInterview}
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
          />
        </Show>
      </div>
    </PageFade>
  );
}
