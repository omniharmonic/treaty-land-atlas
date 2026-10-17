import { handleClaim } from '../lib/claim.js';

export const config = { runtime: 'nodejs', maxDuration: 10 };

export default {
  fetch(request: Request) {
    return handleClaim(request, process.env);
  },
};
