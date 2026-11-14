import { PendingScreenshot } from '../types/PendingScreenshot';
import { addMeetingScreenshot } from './addMeetingScreenshot';

export const uploadMeetingScreenshots = async (
  meetingId: string,
  screenshots: PendingScreenshot[],
) => {
  for (const { image, offsetMs } of screenshots) {
    try {
      await addMeetingScreenshot({ meetingId, image, offsetMs });
    } catch (error) {
      console.error('[recorder] failed to upload screenshot:', error);
    }
  }
};
