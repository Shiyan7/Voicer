import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { tmpdir } from 'os';
import { createInterface } from 'readline';
import { LlmTextModel } from '../llm/llm-text-model';
import { LlmTurn } from '../llm/llm-turn';
import { ClaudeJsonResult, ClaudeStreamLine } from './claude.types';

const DEFAULT_CLAUDE_MODEL = 'haiku';
const JSON_SYSTEM_PROMPT = 'Return only data matching the given JSON schema.';
const CLAUDE_TIMEOUT_MS = 180_000;

interface ClaudeRun {
  child: ChildProcessWithoutNullStreams;
  finished: Promise<void>;
}

@Injectable()
export class ClaudeService implements LlmTextModel {
  private readonly model: string;

  constructor(configService: ConfigService) {
    this.model =
      configService.get<string>('CLAUDE_MODEL') ?? DEFAULT_CLAUDE_MODEL;
  }

  async streamText(
    systemInstruction: string,
    turns: LlmTurn[],
    onText: (text: string) => Promise<void>,
    signal?: AbortSignal,
  ): Promise<string> {
    const { child, finished } = this.run(
      [
        ...this.buildArgs(systemInstruction),
        '--output-format',
        'stream-json',
        '--verbose',
        '--include-partial-messages',
      ],
      signal,
    );
    child.stdin.end(this.toPrompt(turns));

    const [text] = await Promise.all([
      this.readStream(child.stdout, onText),
      finished,
    ]);
    return text;
  }

  async generateJson<T>(prompt: string, schema: object): Promise<T> {
    const { child, finished } = this.run([
      ...this.buildArgs(JSON_SYSTEM_PROMPT),
      '--output-format',
      'json',
      '--json-schema',
      JSON.stringify(schema),
    ]);
    child.stdin.end(prompt);

    const [chunks] = await Promise.all([child.stdout.toArray(), finished]);
    const result = JSON.parse(
      Buffer.concat(chunks as Buffer[]).toString('utf8'),
    ) as ClaudeJsonResult;
    if (result.is_error || !result.structured_output) {
      throw new Error(`Claude failed: ${result.result}`);
    }
    return result.structured_output as T;
  }

  private run(args: string[], signal?: AbortSignal): ClaudeRun {
    const timeout = AbortSignal.timeout(CLAUDE_TIMEOUT_MS);
    const child = spawn('claude', args, {
      cwd: tmpdir(),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
    child.stdin.on('error', () => undefined);

    let stderr = '';
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });

    const finished = new Promise<void>((resolve, reject) => {
      child.once('error', reject);
      child.once('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Claude exited with ${code}: ${stderr.trim()}`));
      });
    });
    return { child, finished };
  }

  private toPrompt(turns: LlmTurn[]): string {
    if (turns.some((turn) => turn.images?.length)) {
      throw new Error('ClaudeService does not support images');
    }
    if (turns.length === 1) return turns[0].text;
    return turns.map((turn) => `${turn.role}: ${turn.text}`).join('\n\n');
  }

  private buildArgs(systemInstruction: string): string[] {
    return [
      '-p',
      '--model',
      this.model,
      '--system-prompt',
      systemInstruction,
      '--tools',
      '',
      '--no-session-persistence',
      '--setting-sources',
      '',
      '--strict-mcp-config',
      '--effort',
      'low',
    ];
  }

  private async readStream(
    stdout: NodeJS.ReadableStream,
    onText: (text: string) => Promise<void>,
  ): Promise<string> {
    let text = '';

    for await (const raw of createInterface({ input: stdout })) {
      const line = JSON.parse(raw) as ClaudeStreamLine;
      if (line.type === 'result' && line.is_error) {
        throw new Error(`Claude failed: ${line.result}`);
      }
      const delta = this.parseDelta(line);
      if (!delta) continue;
      text += delta;
      await onText(text);
    }

    return text;
  }

  private parseDelta(line: ClaudeStreamLine): string {
    if (line.type !== 'stream_event') return '';
    if (line.event?.type !== 'content_block_delta') return '';
    return line.event.delta?.text ?? '';
  }
}
