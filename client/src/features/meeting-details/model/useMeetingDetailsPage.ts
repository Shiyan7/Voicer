import { MeetingDetails } from '@/entities/meeting';
import { AudioPlayerApi } from '@/shared/ui/audio-player';

type StatePanelVariant = 'processing' | 'failed';

export function useMeetingDetailsPage() {
  const meeting = (): MeetingDetails | null => null;

  const isLoading = (): boolean => false;

  const loadFailed = (): boolean => false;

  const isReady = (): boolean => false;

  const showPlayer = (): boolean => false;

  const statePanelVariant = (): StatePanelVariant | null => null;

  const currentTimeMs = (): number => 0;

  const audioUrl = (): string => '';

  const setPlayerApi = (api: AudioPlayerApi) => {};

  const onPlayerTimeUpdate = (seconds: number) => {};

  const seekTo = (startMs: number) => {};

  return {
    meeting,
    isLoading,
    loadFailed,
    isReady,
    showPlayer,
    statePanelVariant,
    currentTimeMs,
    audioUrl,
    setPlayerApi,
    onPlayerTimeUpdate,
    seekTo,
  };
}
