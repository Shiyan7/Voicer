import { DeleteInterviewModal } from '@/entities/interview-session';
import { MoreActionsMenu } from '@/shared/ui/more-actions-menu';

import { useReviewActions } from '../model/useReviewActions';
import { ReviewActionsProps } from '../types/ReviewActionsProps';

export function ReviewActions(props: ReviewActionsProps) {
  const vm = useReviewActions(props);

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
