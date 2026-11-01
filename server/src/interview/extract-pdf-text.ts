import { PDFParse } from 'pdf-parse';

export async function extractPdfText(pdf: Buffer): Promise<string> {
  const parser = new PDFParse({ data: pdf });
  try {
    const { text } = await parser.getText();
    return text.trim();
  } finally {
    await parser.destroy();
  }
}
