import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export const toToolResult = (payload: object): CallToolResult => {
  const structuredContent = JSON.parse(JSON.stringify(payload));

  return {
    content: [{ type: 'text', text: JSON.stringify(structuredContent) }],
    structuredContent,
  };
};
