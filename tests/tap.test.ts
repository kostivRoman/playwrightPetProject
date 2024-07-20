import { test, chromium, BrowserContextOptions } from "@playwright/test";
import proxyList from "../testData/proxyList.json";
import landList from "../testData/landList.json";

const tapLands = landList.filter((land) => land.Action.includes("Tap"));

for (const proxy of proxyList) {
	test.describe(`Proxy: ${proxy.url}`, () => {
		let i = 0;
		for (const land of tapLands) {
			test.describe(`Land: ${land.Brand}`, () => {
				if (proxy.region === land.GEO) {
					test(`${proxy.region},${land.Brand} ${i}`, async () => {
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
						await page.goto("https://www.google.com");

						// Close the browser at the end of the test
						await browser.close();
					});
				}
			});
			i++;
		}
	});
}
