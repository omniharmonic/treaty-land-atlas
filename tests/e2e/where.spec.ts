import { expect, test } from '@playwright/test';

test('a place reads as a land record, with the people doing the work', async ({ page }) => {
  await page.goto('/where/#at=40.015,-105.27&p=Boulder%2C%20CO&s=CO');
  await expect(page.getByRole('heading', { level: 2 }).first()).toContainText('1861');
  await expect(page.getByRole('heading', { name: 'How this land was taken' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Who is doing the work' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Cheyenne and Arapaho Tribes' }).first(),
  ).toBeVisible();
});

test('the home lookup puts the address in the hash, never the query string', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  await page.goto('/');
  await page.getByLabel('Your address, town or ZIP code').fill('Tulsa, OK');
  await page.getByRole('button', { name: 'Look it up' }).click();
  await expect(page).toHaveURL(/\/where\/#q=Tulsa/);
  expect(requests.some((u) => u.includes('?q=Tulsa') && !u.includes('/api/geocode'))).toBe(false);
});
