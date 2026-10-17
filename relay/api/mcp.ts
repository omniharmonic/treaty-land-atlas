import { mcpHandler } from '../lib/mcp.js';

export const config = { runtime: 'nodejs', maxDuration: 30 };

const handler = mcpHandler(process.env);

export default {
  fetch(request: Request) {
    return handler(request);
  },
};
