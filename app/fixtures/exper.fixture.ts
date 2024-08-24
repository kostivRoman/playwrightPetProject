import { test as base, Browser, BrowserContext, chromium, Page } from '@playwright/test';

export const test = base.extend<{
      browser: Browser;
      context: BrowserContext;
      page: Page;
}>({
      //@ts-ignore
      browser: async ({ }, use) => {
            // Launch a new browser instance
            const browser = await chromium.launch({
                  headless: true, // Set to false if you want to see the browser UI
            });
            // Use the browser instance in the tests
            await use(browser);
            // Close the browser after the tests are done
            await browser.close();
      },

      context: async ({ browser }, use) => {
            // Create a new browser context
            const context = await browser.newContext();
            // Use the context in the tests
            await use(context);
            // Close the context after the tests are done
            await context.close();
      },

      page: async ({ context }, use) => {
            // Create a new page
            const page = await context.newPage();
            // Use the page in the tests
            await use(page);
            // Close the page after the tests are done
            await page.close();
      },
});