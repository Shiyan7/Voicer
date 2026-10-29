export const MCP_SERVER_NAME = 'voicer';

export const MCP_URL = (import.meta.env.VITE_GRAPHQL_API_URL ?? '').replace(
  /\/graphql$/,
  '/mcp',
);
