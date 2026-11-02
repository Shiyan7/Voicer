import { PageFade } from '@/shared/ui/page-fade';

import { useInterviewBriefing } from './model/useInterviewBriefing';
import { InterviewBriefing } from './ui/InterviewBriefing';

export function InterviewBriefingOrchestrator() {
  const vm = useInterviewBriefing();

  return (
    <PageFade>
      <InterviewBriefing
        title={vm.title()}
        status={vm.status()}
        recommendations={vm.session()?.recommendations}
        vacancyText={vm.session()?.vacancyText}
        onRetry={vm.retry}
        onStart={vm.start}
        onBack={vm.goBack}
      />
    </PageFade>
  );
}
