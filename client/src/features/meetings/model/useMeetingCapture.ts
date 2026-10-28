import { uploadMeetingAudioMutation } from '@/entities/meeting';
import { useToasts } from '@/entities/toasts';
import { i18n } from '@/shared/i18n';
import { startRecording as startRecorderCommand } from '@/shared/lib/recorder';

export const useMeetingCapture = () => {
  const toasts = useToasts();
  const [uploadResult, uploadAudio] = uploadMeetingAudioMutation();

  const isUploading = () => uploadResult.fetching;

  const startRecording = async () => {
    try {
      const result = await startRecorderCommand();
      if (result.warnings.length) {
        console.warn('[recorder] start warnings:', result.warnings);
      }
    } catch (error) {
      console.error('[recorder] failed to start recording:', error);
    }
  };

  const onFileSelected = async (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) return;

    const result = await uploadAudio({ file });
    if (result.error) toasts.show('error', i18n.t('meetings.upload_error'));
  };

  return { isUploading, startRecording, onFileSelected };
};
