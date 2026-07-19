import { settingsRoot } from '@/shared/roots/settingsRoot';

export const useRecording = () => {
  const autoRecord = () => settingsRoot.autoRecord;

  const toggleAutoRecord = () => {
    settingsRoot.toggleAutoRecord();
  };

  return { autoRecord, toggleAutoRecord };
};
