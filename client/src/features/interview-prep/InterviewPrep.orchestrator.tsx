import { PageFade } from '@/shared/ui/page-fade';

import { useInterviewPrep } from './model/useInterviewPrep';
import { InterviewPrep } from './ui/InterviewPrep';

export function InterviewPrepOrchestrator() {
  const vm = useInterviewPrep();

  return (
    <PageFade>
      <InterviewPrep
        resumeLabel={vm.resumeLabel()}
        hasResume={vm.hasResume()}
        vacancy={vm.vacancy()}
        language={vm.language()}
        languageLabel={vm.languageLabel()}
        onSelectLanguage={vm.setLanguage}
        modeOptions={vm.modeOptions()}
        mode={vm.mode()}
        onSelectMode={vm.selectMode}
        prepareLabel={vm.prepareLabel()}
        isPreparing={vm.isPreparing()}
        canPrepare={vm.canPrepare()}
        isReady={vm.isReady()}
        errorMessage={vm.errorMessage()}
        sectionTabs={vm.sectionTabs()}
        activeSection={vm.activeSection()}
        activeItems={vm.activeItems()}
        onSelectSection={vm.setActiveSection}
        onResumeSelected={vm.onResumeSelected}
        onVacancyInput={vm.onVacancyInput}
        onPrepare={vm.prepare}
        onStart={vm.start}
        onBack={vm.goBack}
      />
    </PageFade>
  );
}
