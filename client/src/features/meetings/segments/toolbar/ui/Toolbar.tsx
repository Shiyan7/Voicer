import { isTauri } from '@tauri-apps/api/core';
import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';

import { ToolbarProps } from '../types/ToolbarProps';
import { toolbarStyles } from './Toolbar.styles';

const styles = toolbarStyles();

export function Toolbar(props: ToolbarProps) {
  return (
    <div class={styles.root()}>
      <Show when={isTauri()}>
        <Button variant="primary" onClick={props.onStartRecording}>
          {i18n.t('meetings.record_now')}
        </Button>
      </Show>
      <Button
        class={props.isUploading ? 'pointer-events-none opacity-60' : ''}
        as="label"
        variant="secondary"
      >
        <Show
          when={props.isUploading}
          fallback={i18n.t('meetings.upload_audio')}
        >
          {i18n.t('meetings.uploading_file')}
        </Show>
        <input
          class={styles.uploadInput()}
          accept="audio/*"
          disabled={props.isUploading}
          type="file"
          onChange={props.onFileSelected}
        />
      </Button>
    </div>
  );
}
