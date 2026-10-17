// Screenshots for design review: node scripts/screenshot.mjs <base-url> <out-dir> <path> [path ...]
import { chromium } from '@playwright/test';
const [, , base, out, ...paths] = process.argv;
const browser = await chromium.launch();
for (const [i, p] of paths.entries()) {
  for (const [w, h, tag] of [
    [1280, 900, 'd'],
    [375, 800, 'm'],
  ]) {
    const page = await browser.newPage({
      viewport: { width: w, height: h },
      colorScheme: process.env.DARK ? 'dark' : 'light',
    });
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(Number(process.env.WAIT ?? 800));
    await page.screenshot({ path: `${out}/shot-${i}-${tag}.png`, fullPage: false });
    await page.close();
  }
}
await browser.close();
