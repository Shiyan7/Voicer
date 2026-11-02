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
        onSelectMode={vm.setMode}
        submitLabel={vm.submitLabel()}
        resumeOptions={vm.resumeOptions()}
        selectedResumeId={vm.selectedResumeId()}
        selectedResumeLabel={vm.selectedResumeLabel()}
        onSelectResume={vm.selectResume}
        isSubmitting={vm.isSubmitting()}
        errorMessage={vm.errorMessage()}
        onSubmit={vm.submit}
        onBack={vm.goBack}
      />
    </PageFade>
  );
}
