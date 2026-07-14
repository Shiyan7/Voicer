import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';

import { ToolbarDeps } from '../types/ToolbarDeps';
import { toolbarStyles } from './Toolbar.styles';

const styles = toolbarStyles();

export function Toolbar(props: ToolbarDeps) {
  return (
    <div class={styles.root()}>
      <Show when={props.canRecord}>
        <Button variant="primary" onClick={props.onStartRecording}>
          {i18n.t('meetings.record_now')}
        </Button>
      </Show>
      <Show when={props.canUpload}>
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
      </Show>
    </div>
  );
}
