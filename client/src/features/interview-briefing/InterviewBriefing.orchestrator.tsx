import { PageFade } from '@/shared/ui/page-fade';

import { useInterviewBriefing } from './model/useInterviewBriefing';
import { InterviewBriefing } from './ui/InterviewBriefing';

export function InterviewBriefingOrchestrator() {
  const vm = useInterviewBriefing();

  return (
    <PageFade>
      <InterviewBriefing
        title={vm.title()}
        isPreparing={vm.isPreparing()}
        isFailed={vm.isFailed()}
        briefing={vm.briefing()}
        onRetry={vm.retry}
        onStart={vm.start}
        onBack={vm.goBack}
      />
    </PageFade>
  );
}
