import { getRecorderState, startRecording } from '@/shared/lib/recorder';

export const ensureRecording = async () => {
  const state = await getRecorderState();
  if (state.state === 'recording') {
    return { startedAt: state.startedAt, isOwned: false };
  }
  const { startedAt } = await startRecording();
  return { startedAt, isOwned: true };
};
