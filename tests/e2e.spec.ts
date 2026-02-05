import { test, expect } from '@playwright/test';

test.describe('Elite Cars Frontend Verification', () => {

    test('Public Pages Load Correctly', async ({ page }) => {
        // Console logging
        page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()} `));
        page.on('pageerror', err => console.log(`BROWSER ERROR: ${err} `));

        console.log('Navigating to home...');
        await page.goto('/');

        // Dump initial content
        const content = await page.content();
        console.log('Initial Content Length:', content.length);
        if (content.length < 2000) {
            console.log('Short Content Dump:', content);
        }

        const title = await page.title();
        console.log('Title:', title);

        await expect(page).toHaveTitle(/Elite/i);

        console.log('Checking Browse Vehicles...');
        try {
            await expect(page.locator('text=Browse Vehicles').first()).toBeVisible({ timeout: 10000 });
        } catch (e) {
            console.log('Browse Vehicles NOT found. Dumping body text...');
            console.log(await page.textContent('body'));
            throw e;
        }
    });

    test('Admin Authentication & Workflows', async ({ page }) => {
        // 1. Login
        try {
            console.log('Navigating to login...');
            await page.goto('/admin/login');

            console.log('Filling email...');
            await page.fill('input[type="email"]', 'admin@example.com');

            console.log('Filling password...');
            await page.fill('input[type="password"]', 'admin');

            console.log('Submitting login form...');
            await page.click('button[type="submit"]');
        } catch (e) {
            console.log('Login Form Interaction Failed:', e);
            console.log('Body Dump at failure:', await page.textContent('body'));
            throw e;
        }

        // Wait for navigation
        try {
            await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 });
            console.log('Navigated to Dashboard successfully');
        } catch (e) {
            console.log('Navigation failed. Current URL:', page.url());
            console.log('Body dump:', await page.textContent('body'));
            throw e;
        }

        // Verify Dashboard Content
        await expect(page.locator('h1')).toContainText('Admin Dashboard');
        await expect(page.locator('text=Total Cars')).toBeVisible();

        // 2. Add a Car (Verify CRUD)
        console.log('Opening Add Car Modal...');
        await page.click('text=Add New Car');
        await expect(page.locator('text=Add New Vehicle')).toBeVisible();

        console.log('Filling Car Form...');
        await page.fill('input[name="name"]', 'Test Tesla Model S');
        await page.fill('input[name="price"]', '$99,000');

        // Select Type (Shadcn Select)
        await page.click('text=Select type');
        await page.click('text=Electric Luxury');

        // Description
        await page.fill('textarea[name="description"]', 'This is a test vehicle description that is long enough.');

        // Specs
        await page.fill('input[name="specs.power"]', '1020 hp');
        await page.fill('input[name="specs.speed"]', '200 mph');
        await page.fill('input[name="specs.acceleration"]', '1.99s');
        await page.fill('input[name="specs.range"]', '396 miles');

        // Images (Min 5)
        for (let i = 0; i < 5; i++) {
            await page.click('text=Add Image');
            // Wait for input to appear? It's synchronous usually.
            // Assuming image url placeholder or name
            await page.fill(`input[name="images.${i}"]`, `https://example.com/car${i}.jpg`);
        }

        console.log('Submitting Car...');
        await page.click('button:has-text("Save Vehicle")');

        // Verify Success Toast or Dialog Close
        await expect(page.locator('text=Vehicle has been added successfully')).toBeVisible();

        // Verify it appears in list
        await expect(page.locator('text=Test Tesla Model S')).toBeVisible();
    });
});
