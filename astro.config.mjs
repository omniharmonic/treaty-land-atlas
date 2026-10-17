import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// Static site for landback.land. SITE_BASE lets a GitHub Pages project URL
// (/treaty-land-atlas/) work before the custom domain is pointed at it.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://landback.land',
  base: process.env.SITE_BASE ?? '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [svelte()],
});
