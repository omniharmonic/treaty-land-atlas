import { expect, test } from '@playwright/test';

test('home timeline is still with reduced motion and can be explored by keyboard', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const year = page.getByRole('slider', { name: 'Year of recorded cessions' });
  await expect(year).toHaveValue('1784');
  await expect(page.getByRole('button', { name: 'Play land history' })).toBeVisible();
  await year.focus();
  await page.keyboard.press('End');
  await expect(page.locator('#clock-year')).toHaveText('Today');
  await expect(year).toHaveAttribute('aria-valuetext', 'Native lands today');
  await expect(page.locator('#land')).toHaveClass(/show-today/);
  await page.keyboard.press('Home');
  await expect(page.locator('#clock-year')).toHaveText('1784');
  await expect(page.locator('#land')).not.toHaveClass(/show-today/);
});

test("the support button goes to the page's own list of who is doing the work", async ({
  page,
}) => {
  await page.goto('/treaties/tla-t-369/');
  await page.locator('.header-support').click();
  await expect(page).toHaveURL(/#support$/);
  await expect(page.locator('#support')).toBeInViewport();
  await page.goto('/about/');
  await expect(page.locator('.header-support')).toHaveAttribute('href', '/organizations/');
});

test('organization directory offers direct engagement with Native-led work', async ({ page }) => {
  await page.goto('/organizations/');
  const narf = page
    .locator('.organization-card')
    .filter({ has: page.getByRole('heading', { name: 'Native American Rights Fund (NARF)' }) });
  await expect(narf.getByRole('link', { name: 'Explore their work' })).toHaveAttribute(
    'href',
    /narf\.org/,
  );
  await expect(narf.getByRole('link', { name: 'Give directly' })).toHaveAttribute(
    'href',
    /^https:\/\//,
  );
});
