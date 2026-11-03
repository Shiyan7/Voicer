import { PageFade } from '@/shared/ui/page-fade';

import { useInterviewBriefing } from './model/useInterviewBriefing';
import { BriefingLayout } from './segments/briefing-layout';
import { BriefingSections } from './segments/sections';
import { BriefingVacancy } from './segments/vacancy';

export function InterviewBriefingOrchestrator() {
  const vm = useInterviewBriefing();

  return (
    <PageFade>
      <BriefingLayout
        title={vm.title()}
        status={vm.status()}
        hasBriefing={vm.hasBriefing()}
        vacancy={<BriefingVacancy text={vm.vacancyText()} />}
        sections={<BriefingSections recommendations={vm.recommendations()} />}
        onRetry={vm.retry}
        onStart={vm.start}
        onBack={vm.goBack}
      />
    </PageFade>
  );
}
