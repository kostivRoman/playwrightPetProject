import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

// const projects = landList.map((el, i) => ({
// 	name: `${i}-${el["Affilka Landing URL"]},${el.GEO}`, // Ensure each project has a unique name
// 	use: {
// 		...devices["Desktop Chrome"],
// 		launchOptions: {
// 			// 	proxy: {
// 			// 		server: 'proxy-server',

// 			// 	}
// 			// },
// 			proxy: {
// 				server: proxyData.find((proxy) => proxy.region === el.GEO)?.server as string,
// 				username: proxyData.find((proxy) => proxy.region === el.GEO)?.username as string,
// 				password: proxyData.find((proxy) => proxy.region === el.GEO)?.username as string,
// 				// }
// 			},
// 		},
// 		timeout: 5 * 60 * 1000,
// 		actionTimeout: 15000,
// 	},
// 	metadata: {
// 		url: el["Affilka Landing URL"],
// 		server: proxyData.find((proxy) => proxy.region === el.GEO)?.server as string,
// 		username: proxyData.find((proxy) => proxy.region === el.GEO)?.username as string,
// 		password: proxyData.find((proxy) => proxy.region === el.GEO)?.username as string,
// 	},
// 	trace: "on",
// 	headless: false,
// 	ignoreHTTPSErrors: true,
// }));
export default defineConfig({

	// use: {
	// 	/* Base URL to use in actions like `await page.goto('/')`. */
	// 	// baseURL: 'http://127.0.0.1:3000',

	// 	/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
	// 	trace: "on",
	// 	headless: false,
	// 	ignoreHTTPSErrors: true,
	// },
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
	use: {
		launchOptions: {
			proxy: {
				server: 'proxy-server',
			}
		},
	},
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
	timeout: 5 * 60 * 1000,
	/* Configure projects for major browsers */
	//projects: projects,
	projects: [
		{
			name: "RU",
			use: {
				...devices["Desktop Chrome"],
				launchOptions: {
					proxy: {
						server: "proxy"// "http://geonode_Zr3aVjywHC-country-ru:bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd@premium-residential.geonode.com:9000",
						// username: "geonode_Zr3aVjywHC-country-ru",
						// password: "bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd"
					},
				},
				actionTimeout: 60000,
				//region: "RU",

			},
		}],
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
