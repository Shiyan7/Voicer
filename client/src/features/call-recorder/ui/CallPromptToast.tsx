import { Button } from '@/shared/ui/button';

import { callPromptToastStyles } from './CallPromptToast.styles';

const styles = callPromptToastStyles();

type CallPromptToastProps = {
  message: string | undefined;
  recordLabel: string | undefined;
  skipLabel: string | undefined;
  onRecord: () => void;
  onSkip: () => void;
};

export function CallPromptToast(props: CallPromptToastProps) {
  return (
    <div class={styles.root()}>
      <span class={styles.dot()} />
      <span class={styles.message()}>{props.message}</span>
      <div class={styles.actions()}>
        <Button variant="secondary" onClick={() => props.onSkip()}>
          {props.skipLabel}
        </Button>
        <Button variant="primary" onClick={() => props.onRecord()}>
          {props.recordLabel}
        </Button>
      </div>
    </div>
  );
}
