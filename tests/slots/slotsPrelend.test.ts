import { BrowserContextOptions } from "playwright";
import test, { expect } from "playwright/test";
import { Wheel } from "../../app/components/wheel.component";
import { tryNavigate } from "../../app/helpers/tryNavigate";
import landList from "../../testData/landList.data.json";
import proxyList from "../../testData/proxyList.json";
import { serverList } from "../../testData/serverList";
import { getCurrentIpAddress } from "../../app/helpers/getIp";

const WHEEL = landList.filter((land) => land.Action === "Slots");
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
		`${land.Action},${land.GEO},${land.RegForm},${land.affilkaLandingUrl}`,
		{
			tag: [`@${land.Action}`, `@${land.Brand}`, `@${land.GEO}`, `@${land.RegForm}`, `@${land.Type}`],
		},
		async ({ browser }, testInfo) => {
			test.skip(!!land.disabled);
			const context = await browser.newContext(proxySettings);
			const page = await context.newPage();
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

			const wheel = new Wheel(page);
			try {
				await tryNavigate(page, land.affilkaLandingUrl, 5);
				await wheel.spinWheel();
				try{
				await wheel.claimBonus();
				}catch(error){
					console.log("Bonus not available");
				}
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
