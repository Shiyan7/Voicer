import { Show } from 'solid-js';

import { Icon } from '@/shared/ui/icon';

import { fileInputStyles } from './FileInput.styles';
import { FileInputProps } from './types/FileInputProps';

export function FileInput(props: FileInputProps) {
  const styles = () =>
    fileInputStyles({ filled: props.isFilled, invalid: !!props.error });

  return (
    <div class={styles().root()}>
      <label class={styles().field()}>
        <Icon
          name={props.isFilled ? 'common:check' : 'common:upload'}
          size={20}
        />
        <span class={styles().label()}>{props.label}</span>
        <input
          {...props.inputProps}
          class={styles().input()}
          type="file"
          accept={props.accept}
        />
      </label>
      <Show when={props.error}>
        <span class={styles().error()}>{props.error}</span>
      </Show>
    </div>
  );
}
