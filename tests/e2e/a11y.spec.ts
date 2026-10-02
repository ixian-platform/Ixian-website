import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/** WCAG 2.2 AA checks with axe on every page, and keyboard focus that never gets stuck. */

const PAGES = ['/', '/technology', '/build', '/quickstart', '/get-involved', '/about-us', '/blog', '/privacy-policy', '/cookie-policy', '/terms-of-use', '/404.html'];

/* Kept on purpose, so not checked for contrast: inactive steps and older log rows are faded
   until they play. The How it works step dots are below 24 px, but the named step buttons do
   the same job (WCAG 2.5.8 equivalent-control exception). */
const FADED = ['#how', '[class*="Round4_stop__"]:not([data-on])'];
const SMALL_ON_PURPOSE = '[class*="HowItWorks_dots__"] button';

async function prepare(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => window.localStorage.setItem('ix-consent', JSON.stringify({ v: 1, at: Date.now(), external: false })));
  await page.route('**/nodeStatus.txt*', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ BH: 6278700, M: 51, R: 12 }) }),
  );
}

/* scroll once so every revealed section is in its final state */
async function settle(page: Page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 900) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  // let fades and the chapter bar finish their transitions
  await page.waitForTimeout(1000);
}

const short = (v: { id: string; nodes: { target: unknown[] }[] }) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`;

for (const path of PAGES) {
  test(`a11y: ${path} has no WCAG A/AA violations`, async ({ page }) => {
    await prepare(page);
    await page.goto(path);
    await settle(page);
    const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
    const all = await new AxeBuilder({ page }).withTags(tags).disableRules(['color-contrast', 'target-size']).analyze();
    let contrast = new AxeBuilder({ page }).withTags(tags).withRules(['color-contrast']);
    for (const sel of FADED) contrast = contrast.exclude(sel);
    const size = await new AxeBuilder({ page }).withTags(tags).withRules(['target-size']).exclude(SMALL_ON_PURPOSE).analyze();
    const found = [...all.violations, ...(await contrast.analyze()).violations, ...size.violations];
    expect(found.map(short)).toEqual([]);
  });
}

test('keyboard: Tab moves through the Platform roadmap and on to the footer', async ({ page }) => {
  await prepare(page);
  await page.goto('/technology');
  await settle(page);
  const chip = page.getByRole('button', { name: /Direct P2P transaction delivery/ });
  await chip.focus();
  await page.keyboard.press('Tab');
  // focus must land on the next control, not drop back to the page
  const next = await page.evaluate(() => document.activeElement?.tagName);
  expect(next).toBe('BUTTON');
  await expect(chip).not.toBeFocused();
  let inFooter = false;
  for (let i = 0; i < 80 && !inFooter; i++) {
    await page.keyboard.press('Tab');
    inFooter = await page.evaluate(() => !!document.activeElement?.closest('footer'));
  }
  expect(inFooter).toBe(true);
});
