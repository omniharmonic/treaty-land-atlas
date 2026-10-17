// Print browser console errors and warnings for a page: node scripts/console-errors.mjs <url>
import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage();
page.on(
  'console',
  (m) => ['error', 'warning'].includes(m.type()) && console.log(m.type(), m.text().slice(0, 400)),
);
page.on('pageerror', (e) => console.log('pageerror', e.message.slice(0, 400)));
await page.goto(process.argv[2], { waitUntil: 'networkidle' });
await page.waitForTimeout(Number(process.env.WAIT ?? 4000));
await browser.close();
