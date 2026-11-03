import { useNavigate } from '@solidjs/router';

import { useInterviewDelete } from '@/entities/interview-session';
import { useRecordingExport } from '@/entities/meeting';
import { paths } from '@/shared/router';

import { getReviewActionOptions } from '../lib/getReviewActionOptions';
import { ReviewAction } from '../types/ReviewAction';
import { ReviewActionsDeps } from '../types/ReviewActionsDeps';

export const useReviewActions = (deps: ReviewActionsDeps) => {
  const navigate = useNavigate();
  const { runExport } = useRecordingExport(deps);
  const { isDeleting, request, confirm, cancel } = useInterviewDelete(() =>
    navigate(paths.live),
  );

  const options = () => getReviewActionOptions(Boolean(deps.meetingId));

  const selectAction = (action: ReviewAction) => {
    if (action === 'delete') request(deps.sessionId);
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
