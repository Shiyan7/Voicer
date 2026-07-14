import { MeetingCardData } from '../types/MeetingCardData';

export function useMeetingsPage() {
  const cards = (): MeetingCardData[] => [];

  const isLoading = (): boolean => false;

  const isEmpty = (): boolean => false;

  const isUploading = (): boolean => false;

  const canUpload = (): boolean => false;

  const canRecord = (): boolean => false;

  const startRecording = () => {};

  const openMeeting = (id: string) => {};

  const onFileSelected = (event: Event) => {};

  return {
    cards,
    isLoading,
    isEmpty,
    isUploading,
    canUpload,
    canRecord,
    startRecording,
    openMeeting,
    onFileSelected,
  };
}
