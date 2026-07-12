export type MarkdownInline = {
  text: string;
  bold?: boolean;
};

export function parseInlines(text: string): MarkdownInline[] {
  const inlines: MarkdownInline[] = [];
  const parts = text.split(/\*\*(.+?)\*\*/g);

  parts.forEach((part, index) => {
    if (!part) return;
    inlines.push(index % 2 === 1 ? { text: part, bold: true } : { text: part });
  });

  return inlines;
}
