import { i18n } from '@/shared/i18n';
import { BorderBeam } from '@/shared/ui/border-beam';
import { GlassIconButton } from '@/shared/ui/glass-icon-button';
import { Icon } from '@/shared/ui/icon';

import { MAX_QUESTION_LENGTH } from '../config/chatConfig';
import { ChatComposerProps } from '../types/ChatComposerProps';
import { chatComposerStyles } from './ChatComposer.styles';

const styles = chatComposerStyles();

export function ChatComposer(props: ChatComposerProps) {
  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    props.onSubmit();
  };

  return (
    <div class={styles.root()}>
      <form class={styles.form()} onSubmit={submit}>
        <BorderBeam class={styles.inputBeam()} radius={26}>
          <textarea
            class={styles.input()}
            ref={props.inputRef}
            rows={1}
            maxLength={MAX_QUESTION_LENGTH}
            value={props.draft}
            placeholder={props.placeholder}
            onInput={(event) => props.onDraft(event.currentTarget.value)}
            onKeyDown={props.onInputKeyDown}
          />
          <GlassIconButton
            class={styles.send()}
            size="sm"
            type="submit"
            disabled={!props.canSend}
            label={i18n.t('chat.send')}
          >
            <Icon size={18} name="common:arrow-up" />
          </GlassIconButton>
        </BorderBeam>
      </form>
      <p class={styles.disclaimer()}>{i18n.t('chat.disclaimer')}</p>
    </div>
  );
}
