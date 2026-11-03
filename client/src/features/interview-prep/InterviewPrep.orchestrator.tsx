import { PageFade } from '@/shared/ui/page-fade';

import { useInterviewPrep } from './model/useInterviewPrep';
import { PrepForm } from './segments/prep-form';
import { ResumePicker } from './segments/resume-picker';

export function InterviewPrepOrchestrator() {
  const vm = useInterviewPrep();

  return (
    <PageFade>
      <PrepForm
        form={vm.form}
        resumePicker={
          <ResumePicker selection={vm.resume()} onChange={vm.setResume} />
        }
        language={vm.language()}
        languageLabel={vm.languageLabel()}
        onSelectLanguage={vm.setLanguage}
        errorMessage={vm.errorMessage()}
        onPrepare={vm.prepare}
        onBack={vm.goBack}
      />
    </PageFade>
  );
}
