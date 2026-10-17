import { expect, test } from '@playwright/test';

test('slider works by keyboard and updates the URL and summary', async ({ page }) => {
  await page.goto('/map/#y=1830');
  const slider = page.locator('#year');
  await expect(page.locator('.summary')).toContainText('1830');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.summary')).toContainText('1831');
  await page.keyboard.press('End');
  await expect(page.locator('.summary')).toContainText('1894');
  await expect.poll(() => page.evaluate(() => location.hash)).toContain('y=1894');
});

test('selecting a row opens the record and the list matches the summary count', async ({
  page,
}) => {
  await page.goto('/map/#y=1851');
  const count = Number((await page.locator('#inview').innerText()).match(/\((\d+)\)/)![1]);
  await expect(page.locator('.summary')).toContainText(`${count} cession`);
  await page.locator('.table button').first().click();
  await expect(page.locator('#detail h2')).toContainText('Royce cession');
});

test('honored-through view shows the legal status panel', async ({ page }) => {
  await page.goto('/map/#y=1868&v=honored&cut=1851');
  await expect(page.getByRole('heading', { name: 'Legal status today' })).toBeVisible();
});

test('no request goes to native-land.ca unless the reader asks', async ({ page }) => {
  const hits: string[] = [];
  page.on('request', (r) => r.url().includes('native-land.ca') && hits.push(r.url()));
  await page.goto('/map/');
  await page.waitForSelector('.summary');
  await page.waitForTimeout(1500);
  expect(hits).toEqual([]);
});
