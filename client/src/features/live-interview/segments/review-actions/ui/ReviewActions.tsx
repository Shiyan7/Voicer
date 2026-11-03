import { DeleteInterviewModal } from '@/entities/interview-session';
import { MoreActionsMenu } from '@/shared/ui/more-actions-menu';

import { useReviewActions } from '../model/useReviewActions';
import { ReviewActionsDeps } from '../types/ReviewActionsDeps';

export function ReviewActions(deps: ReviewActionsDeps) {
  const vm = useReviewActions(deps);

  return (
    <>
      <MoreActionsMenu options={vm.options()} onSelect={vm.selectAction} />
      <DeleteInterviewModal
        isDeleting={vm.isDeleting()}
        onConfirm={vm.confirmDelete}
        onCancel={vm.cancelDelete}
      />
    </>
  );
}
