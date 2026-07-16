import { MeetingStatus } from '@schema';

import { DetailsHeaderDeps } from '../types/DetailsHeaderDeps';

export function useDetailsHeader(props: DetailsHeaderDeps) {
  const isEditingTitle = (): boolean => false;

  const title = (): string => '';

  const titleDraft = (): string => '';

  const status = (): MeetingStatus => props.meeting.status;

  const metaLabel = (): string => '';

  const isDeleting = (): boolean => false;

  const startTitleEdit = () => {};

  const onTitleInput = (event: Event) => {};

  const onTitleKeyDown = (event: KeyboardEvent) => {};

  const commitTitle = () => {};

  const requestDelete = () => {};

  const cancelDelete = () => {};

  const confirmDelete = () => {};

  return {
    isEditingTitle,
    title,
    titleDraft,
    status,
    metaLabel,
    isDeleting,
    startTitleEdit,
    onTitleInput,
    onTitleKeyDown,
    commitTitle,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
