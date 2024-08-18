import { BrowserContextOptions } from "playwright";
import test, { expect } from "playwright/test";
import { Aviator } from "../../app/components/aviator.component";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import { landList } from "../../testData/landList.data";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";

const AVIATOR = landList.filter((land) => land.Action.includes("Aviator"));
const AVIATOR_PRELAND = AVIATOR.filter((land) => land.Type == "Preland");
//console.log("DE_TAP_LAND", DE_TAP_LAND.length);

for (const land of AVIATOR_PRELAND) {
	const proxyObject = proxyList.find((proxy) => proxy.region == land.GEO) || {
		region: "DE",
		server:
			"http://geonode_Zr3aVjywHC-country-de:bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd@premium-residential.geonode.com:9000",
		username: "geonode_Zr3aVjywHC-country-de",
		password: "bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd",
	};
	const proxySettings: BrowserContextOptions = {
		proxy: {
			server: proxyObject.server,
			username: proxyObject.username,
			password: proxyObject.password,
		},
	};

	test(
		`${land.Action},${land.GEO},${land["Affilka Landing URL"]}  `,
		{
			tag: ["@aviator", "@land", `@${land.GEO}`],
		},
		async ({ browser }) => {
			const context = await browser.newContext(proxySettings);
			const page = await context.newPage();
			await page.addLocatorHandler(page.locator(".form-inner.error-inner"), async () => {
				await page.locator("retry-btn").click();
			});
			const aviator = new Aviator(page);
			await tryNavigate(page, land["Affilka Landing URL"], 5);
			await aviator.clickMainButton();
			await page.waitForTimeout(2000);
			const expectedUrls = serverList.find((server) => server.brand == land.Brand)?.url as RegExp[];
			let urlMatched = false;

			for (const url of expectedUrls) {
				try {
					await expect(page).toHaveURL(url, { timeout: 60000 });
					console.log(`URL matched: ${url}`);
					urlMatched = true;
					break;
				} catch (error) {
					console.log(`URL did not match: ${url}`);
				}
			}

			if (!urlMatched) {
				throw new Error("None of the expected URLs matched the current URL.");
			}
			await page.close();
			await context.close();
		},
	);
}
