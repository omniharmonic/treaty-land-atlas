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
  await page.locator('.record-browser > summary').click();
  const count = Number(await page.locator('.record-browser > summary span').innerText());
  await expect(page.locator('.summary')).toContainText(`${count} cession`);
  await page.locator('.table button').first().click();
  await expect(page.locator('#detail h2')).toContainText('(area ');
  await expect(page.locator('#detail h2')).not.toContainText('Royce');
  await expect(page.locator('#detail .record-reference')).toContainText('Full record of area');
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

test('a selected area is the first visible sidebar content, including after scrolling', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/map/#y=1868&sel=geo-royce-261');
  await expect(page.locator('#detail h2')).toContainText('(area 261)');
  await expect(page.getByRole('link', { name: /Treaty of La Pointe/ }).first()).toBeVisible();
  const inSidebar = () =>
    page.evaluate(() => {
      const detail = document.querySelector('#detail')!.getBoundingClientRect();
      const rail = document.querySelector('.rail')!.getBoundingClientRect();
      return detail.top >= rail.top && detail.top < rail.top + 120;
    });
  await expect.poll(inSidebar).toBe(true);
  await page.locator('.rail').evaluate((el) => (el.scrollTop = el.scrollHeight));
  await page.evaluate(() => {
    location.hash = '#y=1868&sel=geo-royce-516';
  });
  await expect(page.locator('#detail .record-reference')).toContainText('516');
  await expect.poll(inSidebar).toBe(true);
});

test('clicking the actual map reveals a land record without hunting through context', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/map/#y=1868');
  await expect(page.locator('.summary')).toContainText('1868');
  const canvas = page.locator('.maplibregl-canvas');
  await expect(canvas).toBeVisible();
  const bounds = await canvas.boundingBox();
  await expect
    .poll(
      async () => {
        await canvas.click({ position: { x: bounds!.width / 2, y: bounds!.height / 2 } });
        return page.locator('#detail h2').count();
      },
      { timeout: 15000 },
    )
    .toBe(1);
  const detail = await page.locator('#detail').boundingBox();
  const sidebar = await page.locator('.rail').boundingBox();
  expect(detail!.y).toBeLessThan(sidebar!.y + 120);
  await page.getByRole('button', { name: 'Back to the map' }).click();
  await expect(page.locator('#detail')).toHaveCount(0);
  await expect(page.locator('.map-hint')).toBeVisible();
  await expect(page.locator('#year')).toBeVisible();
});

test('mobile selection brings the record into view and can return to the map', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/map/#y=1868&sel=geo-royce-261');
  await expect(page.locator('#detail .record-reference')).toContainText('261');
  await expect
    .poll(async () => {
      const box = await page.locator('#detail').boundingBox();
      return !!box && box.y >= -1 && box.y < 100;
    })
    .toBe(true);
  await page.getByRole('button', { name: 'Back to the map' }).click();
  await expect(page.locator('#detail')).toHaveCount(0);
  await expect
    .poll(async () => {
      const box = await page.locator('.map').boundingBox();
      return !!box && box.y >= -1 && box.y < 100;
    })
    .toBe(true);
});

test('failed detail requests still show the selected land and a full record link', async ({
  page,
}) => {
  await page.route('**/data/entities/GeoFeature/geo-royce-261.json', (r) => r.abort());
  await page.goto('/map/#y=1868&sel=geo-royce-261');
  await expect(page.locator('#detail .record-reference')).toContainText('261');
  await expect(page.locator('#detail .record-status')).toContainText('could not load');
  await expect(page.locator('#detail .plain')).toBeVisible();
  await expect(page.locator('#detail .plain')).toBeVisible();
  await expect(page.locator('#detail h2')).toContainText('Chippewa');
  await expect(page.locator('#detail h2')).not.toContainText('Royce');
  await expect(page.locator('#detail a[href="/cessions/261/"]')).toBeVisible();
});
