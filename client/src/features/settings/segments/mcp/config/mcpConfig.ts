export const MCP_SERVER_NAME = 'voicer';

export const MCP_URL = new URL(
  '/mcp',
  import.meta.env.VITE_GRAPHQL_API_URL ?? window.location.origin,
).toString();
