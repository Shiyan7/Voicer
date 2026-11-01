import { For, Match, Switch } from 'solid-js';

import type { MarkdownInline } from '@/shared/lib/markdown';

import { markdownStyles } from './Markdown.styles';
import { MarkdownProps } from './types/MarkdownProps';

const styles = markdownStyles();

export function Markdown(props: MarkdownProps) {
  const renderInline = (inline: MarkdownInline) => (
    <Switch>
      <Match when={inline.kind === 'time' && inline}>
        {(time) => props.renderTime?.(time().ms)}
      </Match>
      <Match when={inline.kind === 'bold' && inline}>
        {(bold) => <strong class={styles.bold()}>{bold().text}</strong>}
      </Match>
      <Match when={inline.kind === 'code' && inline}>
        {(code) => <code class={styles.code()}>{code().text}</code>}
      </Match>
      <Match when={inline.kind === 'text' && inline}>
        {(text) => text().text}
      </Match>
    </Switch>
  );

  return (
    <div class={styles.root({ class: props.class })}>
      <For each={props.blocks}>
        {(block) => (
          <p class={styles.block({ bullet: block.isBullet })}>
            <For each={block.inlines}>{renderInline}</For>
          </p>
        )}
      </For>
    </div>
  );
}
