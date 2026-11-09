import { expect, test, type Page } from '@playwright/test';

const WORKSPACES = ['cmd', 'vault', 'dossier', 'network'] as const;
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

async function workspaceOverflow(page: Page): Promise<number> {
  return page.locator('main > div').first().evaluate((el) => el.scrollWidth - el.clientWidth);
}

test.describe('routing & i18n', () => {
  test('root redirects to /en by default', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
  });

  test('root redirects Arabic browsers to /ar', async ({ browser }) => {
    const ctx = await browser.newContext({ locale: 'ar-IQ', extraHTTPHeaders: { 'Accept-Language': 'ar-IQ,ar;q=0.9' } });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page).toHaveURL(/\/ar$/);
    await ctx.close();
  });

  for (const [lang, dir] of [['en', 'ltr'], ['ar', 'rtl']] as const) {
    test(`/${lang} is server-rendered with lang=${lang} dir=${dir} and hreflang alternates`, async ({ request }) => {
      const html = await (await request.get(`/${lang}`)).text();
      expect(html).toContain(`<html lang="${lang}" dir="${dir}"`);
      expect(html).toMatch(/hrefLang="ar"/);
      expect(html).toMatch(/hrefLang="x-default"/);
    });
  }

  test('language toggle switches direction and URL', async ({ page }) => {
    await page.goto('/en');
    await page.getByTestId('lang-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page).toHaveURL(/\/ar$/);
  });
});

test.describe('command palette', () => {
  test('Ctrl+K opens, Escape closes, and dispatch switches workspace', async ({ page }) => {
    await page.goto('/en');
    await page.keyboard.press('Control+k');
    const input = page.getByPlaceholder(/./).first();
    await expect(input).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(input).toBeHidden();

    await page.keyboard.press('Control+k');
    await page.getByText('Switch to 03. Systems Blueprints').click();
    await expect(page.getByTestId('nav-dossier')).toHaveAttribute('aria-current', 'page');
  });
});

test.describe('content integrity', () => {
  test('Systems Blueprints shows design studies and the real roadmap — no fabricated citations', async ({ page }) => {
    await page.goto('/en');
    await page.getByTestId('nav-dossier').click();
    const main = page.locator('main');
    await expect(main.getByRole('heading', { name: 'SYSTEMS BLUEPRINTS' })).toBeVisible();
    await expect(main).toContainText('MODELED, NOT YET MEASURED');
    await expect(main).not.toContainText(/DOI|IEEE|ACM SIGOPS/);

    await main.getByRole('button', { name: /RESEARCH ROADMAP/ }).click();
    await expect(page.getByTestId('research-roadmap')).toContainText('5G Private Networks & Network Slicing');
  });

  test('no hardcoded vanity telemetry remains', async ({ page }) => {
    await page.goto('/en');
    for (const id of WORKSPACES) {
      await page.getByTestId(`nav-${id}`).click();
      await expect(page.locator('body')).not.toContainText(/1,420|1420 ONLINE|14ms \(LOCKED\)|IEEE-1588/);
    }
  });

  test('intake form renders with Turnstile and honeypot', async ({ page }) => {
    await page.goto('/en');
    await page.getByTestId('nav-network').click();
    const form = page.getByTestId('intake-form');
    await expect(form.getByLabel(/GITHUB HANDLE/)).toBeVisible();
    await expect(form.getByLabel(/INVITE EMAIL/)).toBeVisible();
    await expect(page.getByTestId('turnstile')).toBeAttached();
    await expect(form.locator('input[name="website"]')).toHaveAttribute('tabindex', '-1');
  });
});

test.describe('1px grid integrity: no horizontal overflow', () => {
  for (const vp of VIEWPORTS) {
    for (const lang of ['en', 'ar'] as const) {
      test(`${vp.name} ${lang}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(`/${lang}`);
        for (const id of WORKSPACES) {
          await page.getByTestId(`nav-${id}`).click();
          await expect(page.getByTestId(`nav-${id}`)).toHaveAttribute('aria-current', 'page');
          expect(await workspaceOverflow(page), `${id} overflows horizontally`).toBeLessThanOrEqual(1);
          const docOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
          expect(docOverflow, `${id} page overflows viewport`).toBeLessThanOrEqual(1);
        }
      });
    }
  }
});
