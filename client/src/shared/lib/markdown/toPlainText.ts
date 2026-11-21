import { MarkdownBlock } from './types/MarkdownBlock';

const BULLET = '- ';

const toLine = (block: MarkdownBlock) =>
  block.inlines.reduce(
    (line, inline) =>
      inline.kind === 'time' ? line.trimEnd() : line + inline.text,
    block.isBullet ? BULLET : '',
  );

export const toPlainText = (blocks: MarkdownBlock[]) =>
  blocks.map(toLine).join('\n');
