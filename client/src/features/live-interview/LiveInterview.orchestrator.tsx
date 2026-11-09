import { Show } from 'solid-js';

import { PageFade } from '@/shared/ui/page-fade';

import { liveInterviewStyles } from './LiveInterview.styles';
import { useLiveInterview } from './model/useLiveInterview';
import { LiveRun } from './segments/live-run';
import { Review } from './segments/review';

const styles = liveInterviewStyles();

export function LiveInterviewOrchestrator() {
  const vm = useLiveInterview();

  return (
    <PageFade>
      <div class={styles.root()}>
        <Show when={vm.loaded()} keyed>
          {(loaded) => (
            <Show
              when={loaded.details.finishedAt}
              fallback={
                <LiveRun
                  sessionId={loaded.details.id}
                  initialTurns={loaded.turns}
                  onFinished={vm.reload}
                />
              }
            >
              <Review
                details={loaded.details}
                turns={loaded.turns}
                onBack={vm.closeReview}
              />
            </Show>
          )}
        </Show>
      </div>
    </PageFade>
  );
}
