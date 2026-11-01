import { For, Show } from 'solid-js';

import { Icon } from '@/shared/ui/icon';
import { Tooltip } from '@/shared/ui/tooltip';

import { codeBlockStyles, codeTokenStyles } from './CodeBlock.styles';
import { useCodeBlock } from './model/useCodeBlock';
import { CodeBlockProps } from './types/CodeBlockProps';

const styles = codeBlockStyles();

export function CodeBlock(props: CodeBlockProps) {
  const vm = useCodeBlock(props);

  return (
    <div class={styles.root({ class: props.class })}>
      <div class={styles.header()}>
        <span class={styles.language()}>{props.language}</span>
        <Tooltip label={vm.copyLabel()} isOpen={vm.isCopied()}>
          <button
            class={styles.copy()}
            type="button"
            aria-label={vm.copyLabel()}
            onClick={vm.copy}
          >
            <Show
              when={vm.isCopied()}
              fallback={<Icon name="common:copy" size={16} />}
            >
              <Icon name="common:check" size={16} />
            </Show>
          </button>
        </Tooltip>
      </div>
      <pre class={styles.pre()}>
        <code>
          <For each={vm.tokens()}>
            {(token) => (
              <span class={codeTokenStyles({ kind: token.kind })}>
                {token.text}
              </span>
            )}
          </For>
        </code>
      </pre>
    </div>
  );
}
