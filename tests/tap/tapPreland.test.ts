import test, { expect } from "playwright/test";
import { Tap } from "../../app/components/tap.component";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import landList from "../../testData/landList.data.json";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";
import { tap } from "node:test/reporters";
import { getCurrentIpAddress } from "../../app/helpers/getIp";

const TAP = landList.filter((land) => land.Action === "Tap");
const TAP_PRELAND = TAP.filter((land) => land.Type === "Preland");
for (const land of TAP_PRELAND) {
	const proxyObject = proxyList.find((proxy) => proxy.region === land.GEO) || {
		region: "DE",
		server:
			"http://geonode_Zr3aVjywHC-country-de:bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd@premium-residential.geonode.com:9000",
		username: "geonode_Zr3aVjywHC-country-de",
		password: "bebe29a2-c13b-4aa5-8c20-eb3dd10a8afd",
	};
	test(
		`${land.Action},${land.GEO},${land.RegForm},${land.affilkaLandingUrl}`,
		{
			tag: [`@${land.Action}`, `@${land.Brand}`, `@${land.GEO}`, `@${land.RegForm}`, `@${land.Type}`],
		},
		async ({ browser }, testInfo) => {
			test.skip(!!land.disabled);
			const context = await browser.newContext({
				proxy: {
					server: proxyObject.server,
					username: proxyObject.username,
					password: proxyObject.password,
				},
				viewport: { width: 1280, height: 720 },
				//userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				ignoreHTTPSErrors: true, // Skip SSL protocol errors
			});
			const page = await context.newPage();
			const tap = new Tap(page);
			try {
				const currentIp = await getCurrentIpAddress(page);
				console.log("Current IP address:", currentIp);
				testInfo.annotations.push({
					type: "currentIp",
					description: currentIp,
				});
			} catch (error) {
				console.error(`Failed to get current IP address: ${(error as Error).message}`);
			}

			try {
				await tryNavigate(page, land.affilkaLandingUrl, 3);
				await tap.tap();
				await tap.clickBonusButton();
				const expectedUrls = serverList.find((server) => server.brand === land.Brand)?.url as RegExp[];
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
				//eslint-disable-next-line
				console.error(`Test failed: ${(error as Error).message}`);
				throw error; // Re-throw the error to mark the test as failed
			} finally {
				// Ensure the page and context are closed
				await page.close();
				await context.close();
			}
		},
	);
}
