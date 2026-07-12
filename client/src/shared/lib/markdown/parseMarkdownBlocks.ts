import { MarkdownInline, parseInlines } from './parseInlines';

export type MarkdownBlock =
  | { type: 'heading'; inlines: MarkdownInline[] }
  | { type: 'list'; items: MarkdownInline[][] }
  | { type: 'paragraph'; inlines: MarkdownInline[] };

export function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({
      type: 'paragraph',
      inlines: parseInlines(paragraph.join(' ')),
    });
    paragraph = [];
  };

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    const heading = line.match(/^#{1,6}\s+(.*)$/);

    if (heading) {
      flushParagraph();
      blocks.push({ type: 'heading', inlines: parseInlines(heading[1]) });
      continue;
    }

    const bullet = line.match(/^[-*•]\s+(.*)$/);

    if (bullet) {
      flushParagraph();
      const prev = blocks[blocks.length - 1];
      const item = parseInlines(bullet[1]);

      if (prev?.type === 'list') {
        prev.items.push(item);
      } else {
        blocks.push({ type: 'list', items: [item] });
      }

      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();

  return blocks;
}
