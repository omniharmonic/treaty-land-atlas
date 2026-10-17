import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'pipeline/test/**/*.test.ts',
      'src/**/*.test.ts',
      'scripts/**/*.test.ts',
      'relay/**/*.test.ts',
    ],
    testTimeout: 30_000,
    globalSetup: ['pipeline/test/global-setup.ts'],
  },
});
