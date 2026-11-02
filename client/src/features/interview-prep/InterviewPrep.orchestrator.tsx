import { PageFade } from '@/shared/ui/page-fade';

import { useInterviewPrep } from './model/useInterviewPrep';
import { InterviewPrep } from './ui/InterviewPrep';

export function InterviewPrepOrchestrator() {
  const vm = useInterviewPrep();

  return (
    <PageFade>
      <InterviewPrep
        form={vm.form}
        language={vm.language()}
        languageLabel={vm.languageLabel()}
        onSelectLanguage={vm.setLanguage}
        modeOptions={vm.modeOptions()}
        mode={vm.mode()}
        onSelectMode={vm.selectMode}
        prepareLabel={vm.prepareLabel()}
        isPreparing={vm.isPreparing()}
        isReady={vm.isReady()}
        errorMessage={vm.errorMessage()}
        sectionTabs={vm.sectionTabs()}
        activeSection={vm.activeSection()}
        activeItems={vm.activeItems()}
        onSelectSection={vm.setActiveSection}
        onPrepare={vm.prepare}
        onStart={vm.start}
        onBack={vm.goBack}
      />
    </PageFade>
  );
}
