import { useNavigate } from '@solidjs/router';

import {
  setMeetingFavoriteMutation,
  useMeetingDelete,
  useRecordingExport,
} from '@/entities/meeting';
import { paths } from '@/shared/router';

import { getMoreActionOptions } from '../lib/getMoreActionOptions';
import { MoreAction } from '../types/MoreAction';
import { MoreActionsDeps } from '../types/MoreActionsDeps';

export const useMoreActions = (deps: MoreActionsDeps) => {
  const navigate = useNavigate();
  const [, setFavorite] = setMeetingFavoriteMutation();
  const { isDeleting, request, confirm, cancel } = useMeetingDelete(() =>
    navigate(paths.meetings),
  );
  const { runExport } = useRecordingExport(deps);

  const options = () =>
    getMoreActionOptions(deps.isFavorite, Boolean(deps.audioUrl));

  const toggleFavorite = () =>
    setFavorite({ id: deps.meetingId, isFavorite: !deps.isFavorite });

  const selectAction = (action: MoreAction) => {
    if (action === 'find') deps.onFind();
    else if (action === 'favorite') void toggleFavorite();
    else if (action === 'delete') request(deps.meetingId);
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
