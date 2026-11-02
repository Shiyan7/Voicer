import { DeleteMeetingModal } from '@/entities/meeting';
import { MoreActionsMenu } from '@/shared/ui/more-actions-menu';

import { useMoreActions } from '../model/useMoreActions';
import { MoreActionsDeps } from '../types/MoreActionsDeps';

export function MoreActions(props: MoreActionsDeps) {
  const vm = useMoreActions(props);

  return (
    <>
      <MoreActionsMenu options={vm.options()} onSelect={vm.selectAction} />
      <DeleteMeetingModal
        isDeleting={vm.isDeleting()}
        onConfirm={vm.confirmDelete}
        onCancel={vm.cancelDelete}
      />
    </>
  );
}
