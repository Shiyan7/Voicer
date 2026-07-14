import { settingsSectionStyles } from '@/features/settings/Settings.styles';
import { i18n } from '@/shared/i18n';

import { useRecording } from '../model/useRecording';
import { recordingStyles } from './Recording.styles';

const section = settingsSectionStyles();
const styles = recordingStyles();

export function Recording() {
  const vm = useRecording();

  return (
    <section class={section.section()}>
      <h2 class={section.sectionTitle()}>
        {i18n.t('settings.recording.title')}
      </h2>
      <div class={section.card()}>
        <div class={section.row()}>
          <div class={section.rowText()}>
            <span class={section.rowLabel()}>
              {i18n.t('settings.recording.auto')}
            </span>
            <span class={section.rowHint()}>
              {i18n.t('settings.recording.auto_hint')}
            </span>
          </div>
          <button
            class={styles.toggle({ checked: vm.autoRecord() })}
            role="switch"
            aria-checked={vm.autoRecord()}
            aria-label={i18n.t('settings.recording.auto')}
            onClick={vm.toggleAutoRecord}
          >
            <span class={styles.toggleThumb({ checked: vm.autoRecord() })} />
          </button>
        </div>
      </div>
    </section>
  );
}
