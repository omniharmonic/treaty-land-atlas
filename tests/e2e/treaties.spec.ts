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
  await expect(page.getByRole('navigation', { name: 'On this treaty page' })).toBeVisible();
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

test('timeline keeps date ranges, contextual history, evidence, and browser history', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/treaties/tla-t-369/#event=V024');
  await expect(page.locator('#event-title')).toContainText('Black Hills');
  await expect(page.locator('.detail-meta')).toContainText('1874-1877');
  await expect(page.locator('.record-link')).toHaveAttribute('href', '/violations/v024/');
  await expect(page.locator('.event-map figcaption')).toContainText('No event-specific geometry');
  await page.locator('#event-V030').click();
  await expect(page.locator('#event-title')).toContainText('Dakota Access Pipeline');
  await expect(page.locator('.context-note')).toContainText('not itself a finding');
  await expect(page).toHaveURL(/#event=V030$/);
  await page.goBack();
  await expect(page.locator('#event-title')).toContainText('Black Hills');
  await page.locator('#event-V024').focus();
  await page.keyboard.press('Home');
  await expect(page.locator('#event-signed')).toBeFocused();
  await expect(page.locator('#event-signed')).toHaveAttribute('aria-pressed', 'true');
});

test('land entries highlight their own geometry and the map can focus and reset', async ({
  page,
}) => {
  await page.goto('/treaties/tla-t-369/#event=geo-royce-516');
  await expect(page.locator('.shape.current')).toHaveCount(1);
  const map = page.locator('.event-map svg');
  const original = await map.getAttribute('viewBox');
  await page.getByRole('button', { name: 'Focus on land' }).click();
  await expect(map).not.toHaveAttribute('viewBox', original!);
  await page.getByRole('button', { name: 'Show wider map' }).click();
  await expect(map).toHaveAttribute('viewBox', original!);
  await expect(page.locator('.event-map a').first()).toHaveAttribute('href', /\/cessions\//);
});

test('the full map offers an obvious way into the linked treaty', async ({ page }) => {
  await page.goto('/map/#y=1868&sel=geo-royce-516');
  await expect(page.locator('.treaty-open').first()).toBeVisible();
  await page.locator('.treaty-open').first().click();
  await expect(page).toHaveURL(/\/treaties\//);
  await expect(page.getByRole('navigation', { name: 'On this treaty page' })).toBeVisible();
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
  await expect(page.locator('noscript a').first()).toHaveAttribute('href', /^\//);
  await expect(page.locator('#evidence .sources a').first()).toBeVisible();
  await context.close();
});

test('entry confidence and original correction evidence remain visible', async ({ page }) => {
  await page.goto('/treaties/tla-t-369/#event=V030');
  await expect(page.locator('.entry-confidence')).toContainText('Source confidence: Medium');
  await page.goto('/treaties/tla-t-281/#event=camp-puyallup-1989');
  await expect(page.locator('.entry-confidence')).toContainText('Low. Thinly sourced');
  await page.goto('/treaties/tla-t-004/');
  await expect(page.getByRole('heading', { name: 'Corrections to this record' })).toBeVisible();
  await expect(page.locator('.record-corrections a').first()).toHaveAttribute(
    'href',
    /^https:\/\//,
  );
  await expect(page.locator('.record-corrections q').first()).toBeVisible();
});

test('connected events stay in the treaty and section navigation preserves the selection', async ({
  page,
}) => {
  await page.goto('/treaties/tla-t-369/#event=V024');
  await page.locator('.event-connections summary').click();
  await page
    .locator('.event-connections')
    .getByRole('link', { name: 'United States v. Sioux Nation of Indians', exact: true })
    .click();
  await expect(page).toHaveURL(/\/treaties\/tla-t-369\/#event=case-us-v-sioux-nation-1980/);
  await expect(page.locator('#event-title')).toHaveText('United States v. Sioux Nation of Indians');
  await page
    .getByRole('navigation', { name: 'On this treaty page' })
    .getByRole('link', { name: 'Sources and record' })
    .click();
  await expect(page.locator('#event-title')).toHaveText('United States v. Sioux Nation of Indians');
});

test('mobile event permalinks reveal the selected card in the chronology', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/treaties/tla-t-369/#event=V024');
  await expect(page.locator('#event-V024')).toHaveAttribute('aria-pressed', 'true');
  await expect
    .poll(async () => {
      const list = await page.locator('.event-list').boundingBox();
      const card = await page.locator('#event-V024').boundingBox();
      return (
        !!list && !!card && card.x >= list.x - 1 && card.x + card.width <= list.x + list.width + 1
      );
    })
    .toBe(true);
});
