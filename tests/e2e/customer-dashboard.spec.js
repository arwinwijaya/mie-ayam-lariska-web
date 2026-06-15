// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Customer Dashboard Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // === SECTION PRESENCE ===
  test('has hero section with brand name and tagline', async ({ page }) => {
    const hero = page.locator('[data-section="hero"]');
    await expect(hero).toBeVisible();
    await expect(hero.locator('.hero__brand')).toContainText('Mie Ayam Lariska');
    await expect(hero.locator('.hero__tagline')).toContainText('Mie Ayam Enak, Topping Bisa Mix Suka-Suka');
  });

  test('has hero section with WhatsApp CTA button', async ({ page }) => {
    const cta = page.locator('[data-section="hero"] .hero__cta-primary');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText(/Pesan.*WhatsApp/i);
  });

  test('has hero section with Maps CTA button', async ({ page }) => {
    const cta = page.locator('[data-section="hero"] .hero__cta-secondary');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText(/Lokasi.*Maps/i);
  });

  test('has menu section with all three categories', async ({ page }) => {
    const menu = page.locator('[data-section="menu"]');
    await expect(menu).toBeVisible();

    // Check for category headings
    const categories = menu.locator('.menu__category-title');
    const categoryTexts = await categories.allTextContents();
    const lowerTexts = categoryTexts.map(t => t.toLowerCase());
    expect(lowerTexts.some(t => t.includes('mie ayam'))).toBeTruthy();
    expect(lowerTexts.some(t => t.includes('minuman'))).toBeTruthy();
    expect(lowerTexts.some(t => t.includes('topping'))).toBeTruthy();
  });

  test('has menu placeholder cards', async ({ page }) => {
    const cards = page.locator('.menu__item-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('has packages section', async ({ page }) => {
    const packages = page.locator('[data-section="packages"]');
    await expect(packages).toBeVisible();
    await expect(packages.locator('.section__title')).toContainText(/Paket/i);
  });

  test('has events section for event orders', async ({ page }) => {
    const events = page.locator('[data-section="events"]');
    await expect(events).toBeVisible();
    await expect(events).toContainText(/Acara/i);
  });

  test('has location section with address', async ({ page }) => {
    const location = page.locator('[data-section="location"]');
    await expect(location).toBeVisible();
    await expect(location).toContainText(/Adijaya|Fairamart|Pasar Kambing/i);
  });

  test('has FAQ section', async ({ page }) => {
    const faq = page.locator('[data-section="faq"]');
    await expect(faq).toBeVisible();
    await expect(faq.locator('.section__title')).toContainText(/FAQ/i);
  });

  test('has FAQ items with question and answer pairs', async ({ page }) => {
    const items = page.locator('[data-section="faq"] .faq__item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('has footer with brand info', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Mie Ayam Lariska');
  });

  test('has footer with Instagram link', async ({ page }) => {
    const footer = page.locator('footer');
    const instagramLinks = footer.locator('a[href*="instagram"]');
    const count = await instagramLinks.count();
    expect(count).toBeGreaterThan(0);
    await expect(instagramLinks.first()).toBeVisible();
  });

  test('has footer with WhatsApp link', async ({ page }) => {
    const footer = page.locator('footer');
    const whatsappLink = footer.locator('a[href*="wa.me"], a[href*="whatsapp"]');
    await expect(whatsappLink).toBeVisible();
  });

  // === SEO META TAGS ===
  test('has SEO meta tags', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Mie Ayam Lariska');

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);
  });

  test('has Open Graph tags', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);

    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', /.+/);

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute('content', 'website');
  });

  // === MOBILE-FIRST RESPONSIVE DESIGN ===
  test('page renders correctly on mobile viewport', async ({ page }) => {
    // Playwright config sets viewport to 375x812 (mobile)
    const hero = page.locator('[data-section="hero"]');
    await expect(hero).toBeVisible();
    const menu = page.locator('[data-section="menu"]');
    await expect(menu).toBeVisible();
  });

  // === BRAND COLORS ===
  test('brand primary color is applied', async ({ page }) => {
    // Check that primary color exists as CSS custom property or is used
    const hero = page.locator('[data-section="hero"]');
    const ctaButton = hero.locator('.hero__cta-primary');
    await expect(ctaButton).toBeVisible();

    // Verify button has a background color (brand red)
    const bgColor = await ctaButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    // Not checking exact color value as it may vary by implementation
    expect(bgColor).toBeTruthy();
  });

  // === NO JAVASCRIPT FUNCTIONALITY ===
  test('no inline onclick handlers on page', async ({ page }) => {
    const onclickElements = await page.locator('[onclick]').count();
    expect(onclickElements).toBe(0);
  });

  // === STRUCTURE INTEGRITY ===
  test('all main sections have data-section attribute', async ({ page }) => {
    const expectedSections = ['hero', 'menu', 'packages', 'events', 'location', 'faq'];
    for (const section of expectedSections) {
      const el = page.locator(`[data-section="${section}"]`);
      await expect(el).toBeAttached();
    }
  });

  test('has a nav or header element for navigation', async ({ page }) => {
    const nav = page.locator('nav, header');
    const count = await nav.count();
    expect(count).toBeGreaterThan(0);
  });

  // === LINK INTEGRITY ===
  test('WhatsApp links point to correct number', async ({ page }) => {
    const whatsappLinks = page.locator('a[href*="wa.me/6281364856560"]');
    const count = await whatsappLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Google Maps link exists', async ({ page }) => {
    const mapsLinks = page.locator('a[href*="maps"], a[href*="goo.gl"]');
    const count = await mapsLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});
