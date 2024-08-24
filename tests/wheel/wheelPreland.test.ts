import { BrowserContextOptions } from "playwright";
import test, { expect } from "playwright/test";
import { Wheel } from "../../app/components/wheel.component";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import landList from "../../testData/landList.data.json";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";

const WHEEL = landList.filter((land) => land.Action.includes("Wheel"));
const WHEEL_PRELAND = WHEEL.filter((land) => land.Type === "Preland");
// console.log("DE_TAP_LAND", DE_TAP_LAND.length);
// let i = 0;
for (const land of WHEEL_PRELAND) {
	const proxyObject = proxyList.find((proxy) => proxy.region === land.GEO) || {
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
		`${land.Action},${land.Brand}, ${land.GEO},s ${land["Affilka Landing URL"]}`,
		{
			tag: ["@wheel", "@preland", `@${land.GEO}`, `@${land.Brand}`],
		},
		async ({ browser }) => {
			const context = await browser.newContext(proxySettings);
			const page = await context.newPage();
			const wheel = new Wheel(page);
			try {
				await tryNavigate(page, land["Affilka Landing URL"], 5);
				await wheel.spinWheel();
				await wheel.claimBonus();
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
			} catch (error) {
				//@ts-ignore
				console.error(`Test failed: ${error.message}`);
				throw error; // Re-throw the error to mark the test as failed
			} finally {
				// Ensure the page and context are closed
				await page.close();
				await context.close();
			}
		},
	);
}
