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
        resumeOptions={vm.savedResumes.options()}
        selectedResumeId={vm.savedResumes.selectedId()}
        onSelectResume={vm.selectResume}
        isDeletingResume={vm.savedResumes.isDeleting()}
        onRequestResumeDelete={vm.savedResumes.requestDelete}
        onConfirmResumeDelete={vm.savedResumes.confirmDelete}
        onCancelResumeDelete={vm.savedResumes.cancelDelete}
        vacancy={vm.vacancy()}
        language={vm.language()}
        languageLabel={vm.languageLabel()}
        onSelectLanguage={vm.setLanguage}
        canPrepare={vm.canPrepare()}
        errorMessage={vm.errorMessage()}
        onResumeSelected={vm.onResumeSelected}
        onVacancyInput={vm.onVacancyInput}
        onPrepare={vm.prepare}
        onBack={vm.goBack}
      />
    </PageFade>
  );
}
