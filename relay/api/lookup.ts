import { handle } from '../lib/handler.js';

export const config = { runtime: 'nodejs', maxDuration: 10 };

export default {
  fetch(request: Request) {
    return handle(request, process.env);
  },
};
