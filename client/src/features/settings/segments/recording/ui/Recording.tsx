import { i18n } from '@/shared/i18n';
import { SettingsRow, SettingsSection } from '@/shared/ui/settings-section';

import { useRecording } from '../model/useRecording';
import { recordingStyles } from './Recording.styles';

const styles = recordingStyles();

export function Recording() {
  const vm = useRecording();

  return (
    <SettingsSection title={i18n.t('settings.recording.title')}>
      <SettingsRow
        label={i18n.t('settings.recording.auto')}
        hint={i18n.t('settings.recording.auto_hint')}
      >
        <button
          class={styles.toggle({ checked: vm.autoRecord() })}
          role="switch"
          aria-checked={vm.autoRecord()}
          aria-label={i18n.t('settings.recording.auto')}
          onClick={vm.toggleAutoRecord}
        >
          <span class={styles.toggleThumb({ checked: vm.autoRecord() })} />
        </button>
      </SettingsRow>
    </SettingsSection>
  );
}
