import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('the new identity has a visible contour mark and the exact product name', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Living Law, Living Land');
  await expect(page.locator('.wordmark')).toContainText(/Living Law,\s*Living Land/);
  const box = await page.locator('.brand-icon').boundingBox();
  expect(box!.width).toBeGreaterThan(20);
  expect(box!.height).toBeGreaterThan(20);
});

test('find an agreement, open it, and return to the same search and region', async ({ page }) => {
  await page.goto('/treaties/');
  const search = page.getByRole('searchbox', { name: 'Find an agreement' });
  await expect(search).toBeEnabled();
  await search.fill('Fort Laramie 1868');
  await expect(page.locator('.agreement a[href$="/tla-t-369/"]')).toBeVisible();
  await search.fill('Point Elliott');
  await page.getByLabel('Region', { exact: true }).selectOption('Pacific Northwest');
  await expect(page.locator('.agreement')).toHaveCount(1);
  await expect(page).toHaveURL(/q=Point\+Elliott.*region=Pacific/);
  await page.locator('.agreement h3 a').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Treaty of Point Elliott, 1855');
  await expect(page.getByRole('navigation', { name: 'On this page' })).toBeVisible();
  await page.goBack();
  await expect(search).toHaveValue('Point Elliott');
  await expect(page.getByLabel('Region', { exact: true })).toHaveValue('Pacific Northwest');
  await expect(page.locator('.agreement')).toHaveCount(1);
});

test('search supports empty results, reset, and unratified instruments', async ({ page }) => {
  await page.goto('/treaties/');
  const search = page.getByRole('searchbox', { name: 'Find an agreement' });
  await expect(search).toBeEnabled();
  await search.fill('zzzz-no-record');
  await expect(page.getByRole('heading', { name: 'No agreements match yet.' })).toBeVisible();
  await page.getByRole('button', { name: 'Show all agreements' }).click();
  await expect(search).toHaveValue('');
  await page.getByLabel('Ratification', { exact: true }).selectOption('unratified');
  await expect(page.locator('.agreement').first()).toContainText('Never ratified');
  await page.locator('.agreement h3 a').first().click();
  await expect(page.locator('.unratified-note')).toContainText('never ratified');
});

test('what happened next tells the land and the records in order, with links', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/treaties/tla-t-369/');
  const rows = page.locator('#after .tl-row');
  const years = await rows.evaluateAll((els) =>
    els.map((e) => Number(e.querySelector('.tl-year')!.textContent)).filter((y) => y > 0),
  );
  expect(years).toEqual([...years].sort((a, b) => a - b));
  await expect(page.locator('#after .tl-row.anchor')).toContainText('This treaty');
  const black = page.locator('[data-key="V024"]');
  await expect(black).toContainText('Black Hills');
  await expect(black.locator('a').first()).toHaveAttribute('href', '/violations/v024/');
  await expect(page.locator('[data-key="V030"] .tl-tag')).toHaveText('Related history');
  await expect(page.locator('#after')).not.toContainText('Royce');
});

test('stepping through the timeline lights the land it concerns', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/treaties/tla-t-299/');
  const row = page.locator('#after .tl-row').filter({ hasText: 'set aside' }).first();
  await row.hover();
  await expect(page.locator('#after .tl-map path.on').first()).toBeVisible();
  await expect(page.locator('#after .tl-map path.kept').first()).toBeVisible();
  await expect(page.locator('#land .areas li').first()).toBeVisible();
  await expect(page.locator('#land .areas a').first()).toHaveAttribute('href', /\/cessions\//);
});

test('the full map offers an obvious way into the linked treaty', async ({ page }) => {
  await page.goto('/map/#y=1868&sel=geo-royce-516');
  await expect(page.locator('.treaty-open').first()).toBeVisible();
  await page.locator('.treaty-open').first().click();
  await expect(page).toHaveURL(/\/treaties\//);
  await expect(page.getByRole('navigation', { name: 'On this page' })).toBeVisible();
});

for (const path of ['/treaties/', '/treaties/tla-t-369/#event=V030', '/treaties/tla-u-ca-a/']) {
  test(`new treaty experience meets automated WCAG AA checks: ${path}`, async ({ page }) => {
    await page.goto(path);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`),
    ).toEqual([]);
  });
}

test('warm identity, directory and timeline fit 320px and 390px screens', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of [
      '/',
      '/treaties/',
      '/treaties/tla-t-369/#event=V024',
      '/treaties/tla-u-ca-a/',
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
        `${width}: ${path}`,
      ).toBeLessThanOrEqual(1);
    }
  }
});

test('treaty reading and evidence remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/treaties/tla-t-369/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Fort Laramie');
  await expect(page.locator('.promises')).toContainText('three-fourths');
  await expect(page.locator('#after .tl-row a').first()).toHaveAttribute('href', /^\//);
  await expect(page.locator('#evidence .sources a').first()).toBeVisible();
  await context.close();
});

test('reader notes show, research notes wait behind a toggle, and corrections keep evidence', async ({
  page,
}) => {
  await page.goto('/treaties/tla-t-299/');
  await expect(page.locator('#story .note')).toContainText('ceded no land');
  await expect(page.locator('#story .cautions')).toBeHidden();
  await page.goto('/treaties/tla-t-004/');
  await expect(page.getByRole('heading', { name: 'Corrections to this record' })).toBeVisible();
  await expect(page.locator('.record-corrections a').first()).toHaveAttribute(
    'href',
    /^https:\/\//,
  );
  await expect(page.locator('.record-corrections q').first()).toBeVisible();
});

test('courts and laws connected to a treaty are listed with what each did', async ({ page }) => {
  await page.goto('/treaties/tla-t-369/');
  const law = page.locator('#law');
  await expect(
    law.getByRole('link', { name: 'United States v. Sioux Nation of Indians', exact: true }),
  ).toBeVisible();
  await expect(law.locator('li').first().locator('p').last()).not.toBeEmpty();
});

test('older event links still land on their step, on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/treaties/tla-t-369/#event=V024');
  await expect(page.locator('[data-key="V024"]')).toHaveClass(/\bon\b/);
  await expect(page.locator('[data-key="V024"]')).toBeInViewport();
});
