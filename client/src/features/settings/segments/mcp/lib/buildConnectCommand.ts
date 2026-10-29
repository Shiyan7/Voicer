import { MCP_SERVER_NAME, MCP_URL } from '../config/mcpConfig';

export const buildConnectCommand = (secret: string) =>
  `claude mcp add --transport http ${MCP_SERVER_NAME} ${MCP_URL} --header "Authorization: Bearer ${secret}"`;
