import { Show } from 'solid-js';

import { DeleteMeetingModal } from '@/entities/meeting';
import { PageFade } from '@/shared/ui/page-fade';

import { meetingsStyles } from './Meetings.styles';
import { useMeetingsPage } from './model/useMeetingsPage';
import { MeetingsList } from './segments/meetings-list';
import { Toolbar } from './segments/toolbar/ui/Toolbar';
import { MeetingsDeps } from './types/MeetingsDeps';

const styles = meetingsStyles();

export function MeetingsOrchestrator(props: MeetingsDeps) {
  const vm = useMeetingsPage(props);

  return (
    <PageFade>
      <div class={styles.root()}>
        <header class={styles.header()}>
          <h1 class={styles.title()}>{vm.title()}</h1>
          <Show when={vm.showToolbar()}>
            <Toolbar
              isUploading={vm.isUploading()}
              onStartRecording={vm.startRecording}
              onFileSelected={vm.onFileSelected}
            />
          </Show>
        </header>
        <MeetingsList
          items={vm.items()}
          isLoading={vm.isLoading()}
          isEmpty={vm.isEmpty()}
          emptyLabel={vm.emptyLabel()}
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
