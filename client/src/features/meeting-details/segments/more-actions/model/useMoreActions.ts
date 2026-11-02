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

export const useMoreActions = (props: MoreActionsDeps) => {
  const navigate = useNavigate();
  const [, setFavorite] = setMeetingFavoriteMutation();
  const { isDeleting, request, confirm, cancel } = useMeetingDelete(() =>
    navigate(paths.meetings),
  );
  const { runExport } = useRecordingExport(props);

  const options = () =>
    getMoreActionOptions(props.isFavorite, Boolean(props.audioUrl));

  const toggleFavorite = () =>
    setFavorite({ id: props.meetingId, isFavorite: !props.isFavorite });

  const selectAction = (action: MoreAction) => {
    if (action === 'favorite') void toggleFavorite();
    else if (action === 'delete') request(props.meetingId);
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
