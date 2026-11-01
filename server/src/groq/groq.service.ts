import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiTurn } from '../gemini/gemini.types';
import { GroqMessage, GroqStreamChunk } from './groq.types';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'openai/gpt-oss-120b';

@Injectable()
export class GroqService {
  private readonly apiKey: string | undefined;

  constructor(configService: ConfigService) {
    this.apiKey = configService.get<string>('GROQ_API_KEY');
  }

  async streamText(
    systemInstruction: string,
    turns: GeminiTurn[],
    onText: (text: string) => Promise<void>,
    signal?: AbortSignal,
  ): Promise<string> {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: this.toMessages(systemInstruction, turns),
        stream: true,
        reasoning_effort: 'low',
        include_reasoning: false,
      }),
      signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`Groq failed with ${response.status}`);
    }

    return this.readStream(response.body, onText);
  }

  private async readStream(
    body: ReadableStream<Uint8Array>,
    onText: (text: string) => Promise<void>,
  ): Promise<string> {
    const decoder = new TextDecoder();
    let buffer = '';
    let text = '';

    const reader = body.getReader();

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      const delta = lines.map((line) => this.parseDelta(line)).join('');
      if (!delta) continue;
      text += delta;
      await onText(text);
    }

    return text;
  }

  private parseDelta(line: string): string {
    const payload = line.trim();
    if (!payload.startsWith('data:')) return '';
    const json = payload.slice(5).trim();
    if (json === '[DONE]') return '';
    const chunk = JSON.parse(json) as GroqStreamChunk;
    return chunk.choices?.[0]?.delta?.content ?? '';
  }

  private toMessages(
    systemInstruction: string,
    turns: GeminiTurn[],
  ): GroqMessage[] {
    return [
      { role: 'system', content: systemInstruction },
      ...turns.map(
        (turn): GroqMessage => ({
          role: turn.role === 'model' ? 'assistant' : 'user',
          content: turn.text,
        }),
      ),
    ];
  }
}
