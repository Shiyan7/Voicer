import { i18n } from '@/shared/i18n';
import { PageFade } from '@/shared/ui/page-fade';
import { useViewModel } from '@/shared/view-model';

import { meetingsStyles } from './Meetings.styles';
import { MeetingsPageViewModel } from './model/MeetingsPageViewModel';
import { MeetingsList } from './segments/meetings-list/ui/MeetingsList';
import { Toolbar } from './segments/toolbar/ui/Toolbar';

const styles = meetingsStyles();

export function MeetingsOrchestrator() {
  const vm = useViewModel(MeetingsPageViewModel);

  return (
    <PageFade>
      <div class={styles.root()}>
        <header class={styles.header()}>
          <h1 class={styles.title()}>{i18n.t('meetings.title')}</h1>
          <Toolbar
            canRecord={vm.canRecord}
            canUpload={vm.canUpload}
            isUploading={vm.isUploading}
            onStartRecording={() => vm.startRecording()}
            onFileSelected={vm.onFileSelected}
          />
        </header>
        <MeetingsList
          cards={vm.cards}
          isLoading={vm.isLoading}
          isEmpty={vm.isEmpty}
          onOpen={vm.openMeeting}
        />
      </div>
    </PageFade>
  );
}
