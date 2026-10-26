import { isTauri } from '@tauri-apps/api/core';
import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';

import { ToolbarProps } from '../types/ToolbarProps';
import { toolbarStyles } from './Toolbar.styles';

const styles = toolbarStyles();

export function Toolbar(props: ToolbarProps) {
  return (
    <div class={styles.root()}>
      <Show when={isTauri()}>
        <button
          class={styles.action()}
          type="button"
          title={i18n.t('meetings.record_now')}
          aria-label={i18n.t('meetings.record_now')}
          onClick={props.onStartRecording}
        >
          <Icon size={20} name="common:microphone" />
        </button>
      </Show>
      <label
        class={styles.action({ busy: props.isUploading })}
        title={i18n.t('meetings.upload_audio')}
        aria-label={i18n.t('meetings.upload_audio')}
      >
        <Icon size={20} name="common:upload" />
        <Show when={props.isUploading}>
          <span>{i18n.t('meetings.uploading_file')}</span>
        </Show>
        <input
          class={styles.uploadInput()}
          accept="audio/*"
          disabled={props.isUploading}
          type="file"
          onChange={props.onFileSelected}
        />
      </label>
    </div>
  );
}
