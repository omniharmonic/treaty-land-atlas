import { handleGeocode } from '../lib/geocode.js';

export const config = { runtime: 'nodejs', maxDuration: 10 };

export default {
  fetch(request: Request) {
    return handleGeocode(request, process.env);
  },
};
