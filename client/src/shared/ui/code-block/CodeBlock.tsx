import { For, Show } from 'solid-js';

import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';
import { Tooltip } from '@/shared/ui/tooltip';

import { codeBlockStyles, codeTokenStyles } from './CodeBlock.styles';
import { highlightCode } from './lib/highlightCode';
import { CodeBlockProps } from './types/CodeBlockProps';

const styles = codeBlockStyles();

export function CodeBlock(props: CodeBlockProps) {
  const clipboard = useCopyToClipboard();
  const copyLabel = () =>
    i18n.t(clipboard.isCopied() ? 'common.copied' : 'common.copy');

  return (
    <div class={styles.root({ class: props.class })}>
      <div class={styles.header()}>
        <span class={styles.language()}>{props.language}</span>
        <Tooltip label={copyLabel()} isOpen={clipboard.isCopied()}>
          <button
            class={styles.copy()}
            type="button"
            aria-label={copyLabel()}
            onClick={() => clipboard.copy(props.code)}
          >
            <Show
              when={clipboard.isCopied()}
              fallback={<Icon name="common:copy" size={16} />}
            >
              <Icon name="common:check" size={16} />
            </Show>
          </button>
        </Tooltip>
      </div>
      <pre class={styles.pre()}>
        <code>
          <For each={highlightCode(props.code)}>
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
