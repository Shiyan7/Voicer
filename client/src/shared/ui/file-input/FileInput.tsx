import { Icon } from '@/shared/ui/icon';

import { fileInputStyles } from './FileInput.styles';
import { FileInputProps } from './types/FileInputProps';

const styles = fileInputStyles();

export function FileInput(props: FileInputProps) {
  const onChange = (event: Event & { currentTarget: HTMLInputElement }) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (file) props.onSelect(file);
  };

  return (
    <label class={styles.root({ filled: props.isFilled })}>
      <span class={styles.label()}>{props.label}</span>
      <Icon
        name={props.isFilled ? 'common:check' : 'common:upload'}
        size={20}
      />
      <input
        class={styles.input()}
        type="file"
        accept={props.accept}
        onChange={onChange}
      />
    </label>
  );
}
