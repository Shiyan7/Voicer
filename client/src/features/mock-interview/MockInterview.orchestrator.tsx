import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { BackButton } from '@/shared/ui/back-button';
import { Button } from '@/shared/ui/button';

import { useMockInterview } from './model/useMockInterview';
import { MockInterviewProps } from './types/MockInterviewProps';
import { mockInterviewStyles } from './ui/MockInterview.styles';

const styles = mockInterviewStyles();

export function MockInterview(props: MockInterviewProps) {
  const vm = useMockInterview(props);

  return (
    <div class={styles.root()}>
      <div class={styles.bar()}>
        <BackButton onClick={props.onBack} />
        <span class={styles.status()} role="status">
          {vm.statusLabel()}
        </span>
        <span class={styles.spacer()} />
        <Show when={vm.isFailed()}>
          <Button variant="secondary" onClick={vm.retry}>
            {i18n.t('live.prep.retry')}
          </Button>
        </Show>
        <Button variant="danger" onClick={vm.finish}>
          {i18n.t('live.session.mock.finish')}
        </Button>
      </div>
      <p class={styles.question()}>{vm.question()}</p>
      <Show
        when={vm.answer()}
        fallback={
          <Show when={vm.isListening()}>
            <p class={styles.placeholder()}>
              {i18n.t('live.session.mock.answer_placeholder')}
            </p>
          </Show>
        }
      >
        <p class={styles.answer()}>{vm.answer()}</p>
      </Show>
    </div>
  );
}
