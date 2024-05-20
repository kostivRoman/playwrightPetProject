import { test as baseTest } from "@playwright/test";
import { Application } from "@app";

/**
 * Represents a test fixture for the application.
 * @template T - The type of the application.
 */
export const test = baseTest.extend<
       { app: Application }
>({
      /**
       * Initializes the test fixture.
       * @param {BrowserContext} browser - The browser context.
       * @param {Page} page - The page object.
       * @param {Function} use - The function to use the application.
       */
      app: async ({ browser, page }, use: Function) => {
            test.info().annotations.push({
                  type: "Browser",
                  description: `${browser.browserType().name()} ${browser.version()}`,
            });
            const app = new Application(page);
            await use(app);
      }
});