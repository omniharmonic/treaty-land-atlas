import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  '/',
  '/nations/',
  '/nations/cherokee-nation/',
  '/nations/pd-duwamish-tribe/',
  '/treaties/',
  '/treaties/tla-t-369/',
  '/cessions/517/',
  '/law/',
  '/cases/mcgirt-v-oklahoma-2020/',
  '/returns/',
  '/tours/fort-laramie-and-the-black-hills/',
  '/claim/',
  '/glossary/',
  '/places/state-ok/',
  '/map/',
];

for (const path of pages) {
  test(`no WCAG 2.2 AA violations: ${path}`, async ({ page }) => {
    await page.goto(path);
    if (path === '/map/') await page.waitForSelector('.summary');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .exclude('.maplibregl-canvas')
      .analyze();
    const summary = results.violations.map((v) => `${v.id}: ${v.nodes.length} (${v.help})`);
    expect(summary).toEqual([]);
  });
}

test('works at 320px without horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  for (const path of ['/', '/nations/cherokee-nation/', '/treaties/']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(1);
  }
});
