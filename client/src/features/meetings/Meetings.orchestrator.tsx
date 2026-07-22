import { i18n } from '@/shared/i18n';
import { PageFade } from '@/shared/ui/page-fade';

import { meetingsStyles } from './Meetings.styles';
import { useMeetingsPage } from './model/useMeetingsPage';
import { DeleteMeetingModal } from './segments/delete-meeting';
import { MeetingsList } from './segments/meetings-list';
import { Toolbar } from './segments/toolbar/ui/Toolbar';

const styles = meetingsStyles();

export function MeetingsOrchestrator() {
  const vm = useMeetingsPage();

  return (
    <PageFade>
      <div class={styles.root()}>
        <header class={styles.header()}>
          <h1 class={styles.title()}>{i18n.t('meetings.title')}</h1>
          <Toolbar
            isUploading={vm.isUploading()}
            onStartRecording={vm.startRecording}
            onFileSelected={vm.onFileSelected}
          />
        </header>
        <MeetingsList
          items={vm.items()}
          isLoading={vm.isLoading()}
          isEmpty={vm.isEmpty()}
          currentPage={vm.currentPage()}
          hasPrevPage={vm.hasPrevPage()}
          hasNextPage={vm.hasNextPage()}
          onDelete={vm.requestDeleteMeeting}
          onPrevPage={vm.goToPrevPage}
          onNextPage={vm.goToNextPage}
        />
      </div>
      <DeleteMeetingModal
        isDeleting={vm.isDeleting()}
        onConfirm={vm.confirmDeleteMeeting}
        onCancel={vm.cancelDeleteMeeting}
      />
    </PageFade>
  );
}
