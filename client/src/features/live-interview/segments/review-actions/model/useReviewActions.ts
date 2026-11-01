import { useNavigate } from '@solidjs/router';

import { useInterviewDelete } from '@/entities/interview-session';
import { useRecordingExport } from '@/entities/meeting';
import { paths } from '@/shared/router';

import { getReviewActionOptions } from '../lib/getReviewActionOptions';
import { ReviewAction } from '../types/ReviewAction';
import { ReviewActionsProps } from '../types/ReviewActionsProps';

export const useReviewActions = (props: ReviewActionsProps) => {
  const navigate = useNavigate();
  const { runExport } = useRecordingExport(props);
  const { isDeleting, request, confirm, cancel } = useInterviewDelete(() =>
    navigate(paths.live),
  );

  const options = () => getReviewActionOptions(Boolean(props.meetingId));

  const selectAction = (action: ReviewAction) => {
    if (action === 'delete') request(props.sessionId);
    else runExport(action);
  };

  return {
    options,
    selectAction,
    isDeleting,
    confirmDelete: confirm,
    cancelDelete: cancel,
  };
};
