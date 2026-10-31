import { Injectable } from '@nestjs/common';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { MeetingsService } from '../../meetings/meetings.service';
import { TranscriptSegmentOutput } from '../../meetings/transcript-segment.output';
import { formatTimestamp } from '../format-timestamp';
import { McpTool } from '../mcp-tool';
import { READ_ONLY_ANNOTATIONS } from '../read-only-annotations';

const inputSchema = {
  meetingId: z.uuid(),
  fromMs: z
    .number()
    .int()
    .min(0)
    .default(0)
    .describe('Start from this offset, e.g. atMs from search_meetings'),
  maxChars: z.number().int().min(1000).max(100_000).default(20_000),
};

@Injectable()
export class GetTranscriptTool implements McpTool {
  constructor(private readonly meetingsService: MeetingsService) {}

  register(server: McpServer, userId: string): void {
    server.registerTool(
      'get_transcript',
      {
        title: 'Get meeting transcript',
        description:
          'Verbatim diarized transcript as "[mm:ss] Speaker N: text" lines. Long meetings come in chunks: when nextFromMs is returned, call again with fromMs=nextFromMs.',
        inputSchema,
        annotations: READ_ONLY_ANNOTATIONS,
      },
      async ({ meetingId, fromMs, maxChars }) => {
        const segments = await this.meetingsService.getMeetingTranscript(
          userId,
          meetingId,
        );

        return this.toChunk(
          segments.filter((segment) => segment.startMs >= fromMs),
          maxChars,
        );
      },
    );
  }

  private toChunk(
    segments: TranscriptSegmentOutput[],
    maxChars: number,
  ): CallToolResult {
    const lines = this.takeLines(segments, maxChars);
    const nextFromMs = segments[lines.length]?.startMs ?? null;
    const footer =
      nextFromMs === null ? [] : [`[truncated, nextFromMs=${nextFromMs}]`];

    return {
      content: [{ type: 'text', text: [...lines, ...footer].join('\n') }],
      structuredContent: { segmentCount: lines.length, nextFromMs },
    };
  }

  private takeLines(
    segments: TranscriptSegmentOutput[],
    maxChars: number,
  ): string[] {
    const lines: string[] = [];
    let length = 0;

    for (const segment of segments) {
      const line = `[${formatTimestamp(segment.startMs)}] Speaker ${segment.speakerIndex}: ${segment.text}`;
      if (lines.length && length + line.length > maxChars) break;
      lines.push(line);
      length += line.length + 1;
    }

    return lines;
  }
}
