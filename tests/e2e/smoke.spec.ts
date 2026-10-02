import { test, expect, type Page } from '@playwright/test';

/** Pages render, key sections exist, nothing throws, and the browser address maker works. */

// CI runners draw WebGL in software (a few frames a second), which makes the animated
// scenes crawl. Reduced motion renders each scene once: the same markup, a fair smoke test.

async function prepare(page: Page, { consent = true } = {}) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // a privacy choice already made, so the card never sits over what a test clicks
  if (consent) await page.addInitScript(() => window.localStorage.setItem('ix-consent', JSON.stringify({ v: 1, at: Date.now(), external: false })));
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/nodeStatus.txt*', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ BH: 6278700, M: 51, R: 12 }) }),
  );
  return errors;
}

test('home: hero, sections, live numbers, no errors', async ({ page }) => {
  const errors = await prepare(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Connect anything');
  for (const id of ['how', 'trust', 'build', 'spixi', 'start', 'platform']) await expect(page.locator(`#${id}`)).toBeAttached();
  await expect(page.getByText('6,278,700').first()).toBeAttached(); // the live block height arrived (hidden in the phone hero by design)
  expect(errors).toEqual([]);
});

test('home: "Try it" makes a real address in the browser', async ({ page }) => {
  const errors = await prepare(page);
  await page.goto('/#start');
  await page.getByRole('button', { name: /Make my address/ }).click();
  await expect(page.getByText('Signed a message and verified it with the key')).toBeVisible({ timeout: 30_000 });
  const address = await page.locator('#start code').first().innerText();
  expect(address).toMatch(/^[1-9A-HJ-NP-Za-km-z]{60,70}$/);
  expect(errors).toEqual([]);
});

test('home: How it works steps, pair swap, use-case links and the measured round trip', async ({ page }) => {
  const errors = await prepare(page);
  await page.goto('/#how');
  const how = page.locator('#how');
  // phones: the steps ride in a sideways rail over the pinned drawing, and the "n / 5" label is hidden
  const phone = (page.viewportSize()?.width ?? 1440) <= 860;
  const stepOn = async (name: string, n: number) => {
    if (phone) await expect(how.getByLabel('Steps').locator('[aria-current="step"]')).toContainText(name);
    else await expect(how.getByText(`${n} / 5 · ${name}`)).toBeVisible();
  };
  const steps = phone ? how.getByLabel('Steps') : how.locator('ol').first();
  await steps.getByRole('button', { name: /Find/ }).click();
  await stepOn('Find', 3);
  await how.getByRole('button', { name: /Try another pair of endpoints/ }).click();
  await expect(how.getByText('dashboard ↔ Raspberry Pi')).toBeVisible();
  // the use cases are a grid of links into the docs
  const uc = how.getByRole('link', { name: /^IoT and devices:/ });
  await expect(uc).toHaveAttribute('href', /^https:\/\/docs\.ixian\.io\//);
  await expect(how.locator('a[href^="https://docs.ixian.io/"][aria-label*=":"]')).toHaveCount(6);
  // the round trip really runs here: RSA-4096 keys, a signature, SHA3, the hybrid exchange, two cipher layers
  if (!phone) await expect(how.getByText(/every exchange after/)).toBeVisible({ timeout: 40_000 });
  await expect(how.getByText('B checks the signature').or(how.getByText('A hashes B’s address to find its sector'))).toBeVisible();
  // the statement's nouns are links to the step each one replaces
  await how.getByRole('link', { name: 'a payment processor' }).click();
  await stepOn('Pay', 5);
  expect(errors).toEqual([]);
});

test('home: How it works follows the scroll on a tall desktop window, and the step dots jump', async ({ page }) => {
  const errors = await prepare(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/#how');
  const how = page.locator('#how');
  await how.locator('ol').first().getByRole('button', { name: /Talk/ }).click();
  await expect(how.getByText('4 / 5 · Talk')).toBeVisible();
  await how.getByRole('button', { name: 'Step 2: Proof' }).click();
  await expect(how.getByText('2 / 5 · Proof')).toBeVisible();
  expect(errors).toEqual([]);
});

test('home: the Spixi stage switches scenes and shows each finished scene', async ({ page }) => {
  const errors = await prepare(page);
  await page.goto('/#spixi');
  const tab = (n: string) => page.locator('#spixi').getByRole('tab', { name: n, exact: true });
  await tab('Mini Apps').click();
  await expect(tab('Mini Apps')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#spixi-panel-2').getByText('Done. Export limit is now 80%.')).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(tab('Agents')).toBeFocused();
  await expect(page.locator('#spixi-panel-1').getByText('Design preview').first()).toBeAttached();
  await expect(page.locator('#spixi').getByRole('link', { name: /Read the case study/ })).toHaveAttribute('href', '/blog/spixi-infrastructure-costs');
  expect(errors).toEqual([]);
});

test('the Ecosystem page keeps the drawn Spixi stage', async ({ page }) => {
  const errors = await prepare(page);
  await page.goto('/get-involved');
  await expect(page.locator('[id$="-panel-0"]').first()).toBeAttached();
  expect(errors).toEqual([]);
});

test('blog: the index lists the case study and the post renders', async ({ page }) => {
  const errors = await prepare(page);
  await page.goto('/blog');
  await expect(page.getByRole('heading', { level: 1, name: 'Blog.' })).toBeVisible();
  await page.getByRole('link', { name: /How Spixi minimized infrastructure costs/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: /How Spixi minimized infrastructure costs/ })).toBeVisible();
  await expect(page.locator('article').getByRole('link', { name: 'Medium' })).toHaveAttribute('href', /medium\.com\/ixian/);
  // the Spixi screens: a tab or a click brings one to the front
  await page.locator('article').getByRole('button', { name: 'Wallet', exact: true }).click();
  await expect(page.locator('#post-phones-panel-2')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('article').getByRole('button', { name: 'Bring Chats to the front' }).dispatchEvent('click');
  await expect(page.locator('#post-phones-panel-0')).toHaveAttribute('aria-pressed', 'true');
  expect(errors).toEqual([]);
});

for (const path of ['/technology', '/build', '/get-involved', '/about-us', '/privacy-policy', '/terms-of-use', '/cookie-policy']) {
  test(`page ${path} renders without errors`, async ({ page }) => {
    const errors = await prepare(page);
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('unknown pages show the 404', async ({ page }) => {
  await prepare(page);
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('the 404 hashes the path and points to the page you likely meant', async ({ page }) => {
  const errors = await prepare(page);
  await page.goto('/quickstrat');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Nobody');
  await expect(page.getByText('/quickstrat', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Did you mean Quickstart/ })).toHaveAttribute('href', '/quickstart');
  expect(errors).toEqual([]);
});

test('quickstart: the address fills every command, the key is made here, the CTA points here', async ({ page }) => {
  const errors = await prepare(page);
  await page.goto('/quickstart');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Message your phone');
  const addr = '1BvKqF7nH2sXgT4cLmZ8wR5yPpD3eJ6aUkN9tVbC1xMq2hYo8ZfQ';
  await page.getByLabel('Your Spixi address').fill(addr);
  const pair = page.locator('#pair pre', { hasText: 'addContact' }).first();
  await expect(pair).toContainText(`address=${addr}`);
  // Spixi's Address tab copies the address with a `_` suffix; it must be accepted as is
  await page.getByLabel('Your Spixi address').fill(`${addr}_3`);
  await expect(pair).toContainText(`address=${addr}_3`);
  await expect(pair).not.toContainText('YOUR_API_KEY');
  await expect(page.locator('#run pre').first()).toContainText('apiBind = http://127.0.0.1:8001/');
  await page.getByRole('radio', { name: 'Windows' }).click();
  await expect(pair).toContainText('curl.exe');
  await expect(page.locator('a.ix-btn--primary', { hasText: 'Start building' }).first()).toHaveAttribute('href', '/quickstart');
  expect(errors).toEqual([]);
});

test('platform: the live strip, the address decomposer, the seal and an address made here', async ({ page }) => {
  const errors = await prepare(page);
  await page.goto('/technology');
  // DLT: the live height reaches the chain; the sentence says what is true of the selected block
  const dlt = page.locator('#dlt');
  await expect(dlt.getByText('6,278,700', { exact: true })).toBeVisible();
  await expect(dlt.getByText('Block 6,278,695 is final. Its signer set is frozen into the header of block 6,278,700.')).toBeVisible();
  await dlt.getByRole('button', { name: 'Signing: 6,278,698' }).click();
  await expect(dlt.getByText(/Block 6,278,698 is being signed, 2 of 5 deep/)).toBeVisible();
  // Identity: the docs example validates, a typo fails visibly
  const id = page.locator('#identity');
  await expect(id.getByText('Checksum matches')).toBeVisible();
  await id.getByRole('button', { name: 'Make a typo' }).click();
  await expect(id.getByText(/does not match|decodes to/)).toBeVisible();
  // Post-quantum: sealed and opened in this browser
  await page.locator('#security').scrollIntoViewIfNeeded();
  await expect(page.locator('#security').getByText('key generation, once')).toBeVisible({ timeout: 30_000 });
  // Build: an address is made, signed and verified in this browser
  const build = page.locator('#build');
  await build.getByRole('button', { name: 'Make my address' }).click();
  await expect(build.getByText('Yes, with the key behind it')).toBeVisible({ timeout: 60_000 });
  await expect(build.getByRole('button', { name: 'Make another' })).toBeVisible();
  expect(errors).toEqual([]);
});

// With motion on (the other tests run reduced): a page reached by client-side navigation,
// not a reload, must reveal its [data-reveal] content.
test('navigation: a page reached by a link reveals its content', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/nodeStatus.txt*', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ BH: 6278700, M: 51, R: 12 }) }),
  );
  await page.addInitScript(() => window.localStorage.setItem('ix-consent', JSON.stringify({ v: 1, at: Date.now(), external: false })));
  await page.goto('/about-us');
  await page.locator('a[href="/build"]:visible').first().click();
  await expect(page).toHaveURL(/\/build/);
  await page.waitForTimeout(800);
  // scroll through the page so every reveal can fire
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= h; y += 500) {
    await page.evaluate((to) => window.scrollTo(0, to), y);
    await page.waitForTimeout(120);
  }
  // reveals finish on their own; slow engines (WebKit in CI) need more than a fixed wait,
  // but a section that never appears still fails after the timeout
  await expect
    .poll(() => page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter((e) => Number(getComputedStyle(e).opacity) < 0.5).length), { timeout: 8000 })
    .toBe(0);
  expect(errors).toEqual([]);
});

// A jump that carries sections past the viewport between two observer checks (an anchor,
// a fast fling, a slow engine) must not leave them hidden above the reader.
test('navigation: a jump to the bottom leaves nothing hidden above it', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/nodeStatus.txt*', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ BH: 6278700, M: 51, R: 12 }) }),
  );
  await page.addInitScript(() => window.localStorage.setItem('ix-consent', JSON.stringify({ v: 1, at: Date.now(), external: false })));
  await page.goto('/about-us');
  await page.locator('a[href="/build"]:visible').first().click();
  await expect(page).toHaveURL(/\/build/);
  // past the 2.5 s safety pass, so only the scroll sweep can catch the skipped sections
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            [...document.querySelectorAll('[data-reveal]')].filter(
              (e) => e.getBoundingClientRect().top < window.innerHeight * 0.9 && Number(getComputedStyle(e).opacity) < 0.5,
            ).length,
        ),
      { timeout: 8000 },
    )
    .toBe(0);
  expect(errors).toEqual([]);
});

test('privacy: the first visit asks once, the footer reopens the settings', async ({ page }) => {
  const errors = await prepare(page, { consent: false });
  await page.goto('/about-us');
  const card = page.getByRole('region', { name: 'Privacy choices' });
  await expect(card).toBeVisible({ timeout: 10_000 });
  await card.getByRole('button', { name: 'Keep them off' }).click();
  await expect(card).toBeHidden();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ix-consent') || '{}').external)).toBe(false);
  await page.getByRole('button', { name: 'Privacy settings' }).click();
  const sw = card.getByRole('switch', { name: 'External content' });
  await expect(sw).toHaveAttribute('aria-checked', 'false');
  await sw.click();
  await card.getByRole('button', { name: 'Save' }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ix-consent') || '{}').external)).toBe(true);
  expect(errors).toEqual([]);
});
