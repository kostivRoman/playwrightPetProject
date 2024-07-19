import { test, chromium, TestInfo } from "@playwright/test";
import proxyList from "../testData/proxyList.json";
import landList from "../testData/landList.json";
import { Tap } from "app/components/tap.component";

const tapLands = landList.filter((land) => land.Action.includes("Tap"));

for (const proxy of proxyList) {
	test.describe(`Proxy: ${proxy.url}`, () => {
		let i = 0;
		for (const land of tapLands) {
			// Define a unique test name
			const testName = `${proxy.region},${land.Brand} ${i}`;
			// Increment the counter
			i++;
			// Use test.skip conditionally within the test definition
			test(testName, async ({}, testInfo: TestInfo) => {
				// Skip the test if the land.Brand is "SkipBrand"
				if (proxy.region !== land.GEO) {
					testInfo.skip();
				}
				// Launch a new browser instance with proxy configuration
				const browser = await chromium.launch({
					proxy: {
						server: proxy.url,
						username: proxy.username,
						password: proxy.password,
					},
				});

				// Create a new context and page within the browser instance
				const context = await browser.newContext();
				const page = await context.newPage();
				const tap = new Tap(page);
				await page.goto(land["Affilka Landing URL"]);
				//	await page.pause(1000000000000000);
				await tap.tap();
				await tap.clickBonusButton();

				// Close the browser at the end of the test
				await page.close();
				await context.close();
				await browser.close();
			});
		}
	});
}
