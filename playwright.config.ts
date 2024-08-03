import { defineConfig, devices } from "@playwright/test";
import proxyData from "./testData/proxyList.json";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const projects = proxyData.map(proxy => ({
	name: proxy.region,
	use: {
		...devices['Desktop Chrome'],
		launchOptions: {
			proxy: {
				server: proxy.server,
				username: proxy.username,
				password: proxy.password,
			},
		},
	},
}));
export default defineConfig({
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		// baseURL: 'http://127.0.0.1:3000',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on",
		headless: false,
		ignoreHTTPSErrors: true
	},
	//globalSetup: 'global-setup.ts',
	testDir: "./tests",

	//testMatch: "**/*.spec.ts",

	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : 1,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: "html",
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	// use: {
	// 	/* Base URL to use in actions like `await page.goto('/')`. */
	// 	// baseURL: 'http://127.0.0.1:3000',

	// 	/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
	// 	trace: "on",
	// 	headless: false,
	// 	ignoreHTTPSErrors: true
	// },
	//globalTimeout: 10 * 60 * 1000,
	timeout: 2 * 60 * 1000,
	/* Configure projects for major browsers */
	//projects: projects,
	// projects: [
	// 	{
	// 		name: "RU",
	// 		use: {
	// 			...devices["Desktop Chrome"],
	// 			launchOptions: {
	// 				proxy: {
	// 					server: "http://geonode_Zr3aVjywHC-country-ru:bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd@premium-residential.geonode.com:9000",
	// 					username: "geonode_Zr3aVjywHC-country-ru",
	// 					password: "bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd"
	// 				},
	// 			},
	// 			actionTimeout: 60000,
	// 			//region: "RU",

	// 		},

	// 	},
	// 	{
	// 		name: "TR",
	// 		use: {
	// 			...devices["Desktop Chrome"],
	// 			launchOptions: {
	// 				proxy: {
	// 					server: "http://geonode_Zr3aVjywHC-country-tr:bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd@premium-residential.geonode.com:9000",
	// 					username: 'geonode_Zr3aVjywHC-country-tr',
	// 					password: 'bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd',
	// 				},
	// 			},
	// 			//region: "TR",
	// 		},
	// 	},]

		// {
		//   name: "firefox",
		//   use: { ...devices["Desktop Firefox"] },
		// },

		// {
		//   name: "webkit",
		//   use: { ...devices["Desktop Safari"] },
		// },

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		// },
	//],

	/* Run your local dev server before starting the tests */
	// webServer: {
	//   command: 'npm run start',
	//   url: 'http://127.0.0.1:3000',
	//   reuseExistingServer: !process.env.CI,
	// },
});
